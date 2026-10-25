#!/usr/bin/env python3
"""Multi-engine Korean-to-IPA diagnostic on the pinned UGTPHON Korean test split.

This is deliberately an external-comparison harness, not production code. Each
candidate keeps its own native output and a declared adapter. It never routes a
competitor's output back through the ClippyFirst phonological rules. A few
competitors need a representation adapter because they emit Hangul surface text
or a documented custom phone alphabet instead of IPA.
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import os
import random
import re
import subprocess
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path
from typing import Any, Callable

from benchmark_ugtphon_ko import edit_distance, load_corpus, normalize_ipa

_HANGUL_TOKEN = re.compile(r"^[\uac00-\ud7a3]+$")
SEED = 20261024
BOOTSTRAP_REPLICATES = 1000

# KoG2P documents these romanized-phone labels in its README. This explicit
# adapter is lossy and is scored as a separate layer, not treated as KoG2P IPA.
_KOG2P_PHONE_TO_IPA = {
    "p0": "p", "ph": "pʰ", "pp": "p͈",
    "t0": "t", "th": "tʰ", "tt": "t͈",
    "k0": "k", "kh": "kʰ", "kk": "k͈",
    "s0": "s", "ss": "s͈", "h0": "h",
    "c0": "tɕ", "ch": "tɕʰ", "cc": "tɕ͈",
    "mm": "m", "nn": "n", "rr": "ɾ", "ll": "l",
    "kf": "k̚", "tf": "t̚", "pf": "p̚", "mf": "m", "nf": "n",
    "ng": "ŋ",
    "ks": "k̚s", "nc": "ntɕ", "nh": "nh", "lk": "lk", "lm": "lm",
    "lb": "lp", "ls": "ls", "lt": "lt", "lp": "lp", "lh": "lh", "ps": "ps",
    "aa": "a", "qq": "ɛ", "ya": "ja", "yq": "jɛ", "vv": "ʌ", "ee": "e",
    "yv": "jʌ", "ye": "je", "oo": "o", "wa": "wa", "wq": "wɛ", "wo": "we",
    "yo": "jo", "uu": "u", "wv": "wʌ", "we": "we", "wi": "wi", "yu": "ju",
    "xx": "ɯ", "xi": "ɰi", "ii": "i",
    # A silent onset may occur in intermediate output; it contributes no phone.
    "oh": "",
}


def kog2p_phones_to_ipa(value: str) -> str:
    """Map KoG2P's documented two-character labels to broad IPA transparently."""
    tokens = value.strip().split()
    if not tokens:
        raise ValueError("KoG2P returned an empty phone sequence")
    unknown = sorted(set(tokens) - set(_KOG2P_PHONE_TO_IPA))
    if unknown:
        raise ValueError(f"KoG2P phone labels lack an explicit IPA mapping: {unknown}")
    return "".join(_KOG2P_PHONE_TO_IPA[token] for token in tokens)


def _gold_variants(raw: str) -> list[str]:
    return [normalize_ipa(part) for part in raw.split(",") if part.strip()]


def _score(prediction: str, gold_raw: str) -> dict[str, Any]:
    predicted = normalize_ipa(prediction)
    variants = _gold_variants(gold_raw)
    if not variants:
        raise ValueError("no usable IPA reference variants")
    distance, closest = min(
        ((edit_distance(predicted, gold), gold) for gold in variants),
        key=lambda pair: pair[0],
    )
    return {
        "predicted": prediction,
        "normalized_predicted": predicted,
        "closest_normalized_gold": closest,
        "distance": distance,
        "exact": distance == 0,
        "reference_length": len(closest),
    }


def _metrics(items: list[dict[str, Any]]) -> dict[str, Any]:
    if not items:
        return {
            "scored_tokens": 0, "exact_matches": 0, "exact_match_rate": None,
            "character_error_rate": None, "reference_characters": 0,
        }
    exact = sum(bool(item["exact"]) for item in items)
    distance = sum(int(item["distance"]) for item in items)
    ref_chars = sum(int(item["reference_length"]) for item in items)
    return {
        "scored_tokens": len(items),
        "exact_matches": exact,
        "exact_match_rate": round(exact / len(items), 6),
        "character_error_rate": round(distance / ref_chars, 6) if ref_chars else None,
        "reference_characters": ref_chars,
    }


def _bootstrap_ci(items: list[dict[str, Any]], replicates: int = BOOTSTRAP_REPLICATES) -> dict[str, Any]:
    """Deterministic row-cluster bootstrap; repeated tokens in a sentence stay clustered."""
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for item in items:
        grouped[str(item["row_id"])].append(item)
    clusters = list(grouped.values())
    if len(clusters) < 2:
        return {"method": "row-cluster percentile bootstrap", "replicates": 0, "note": "fewer than two scored rows"}
    rng = random.Random(SEED)
    exact_rates: list[float] = []
    cers: list[float] = []
    for _ in range(replicates):
        sample: list[dict[str, Any]] = []
        for _ in clusters:
            sample.extend(rng.choice(clusters))
        if not sample:
            continue
        exact_rates.append(sum(bool(x["exact"]) for x in sample) / len(sample))
        denominator = sum(int(x["reference_length"]) for x in sample)
        if denominator:
            cers.append(sum(int(x["distance"]) for x in sample) / denominator)
    def bounds(values: list[float]) -> list[float] | None:
        if not values:
            return None
        values.sort()
        return [round(values[int((len(values) - 1) * 0.025)], 6),
                round(values[int((len(values) - 1) * 0.975)], 6)]
    return {
        "method": "row-cluster percentile bootstrap",
        "seed": SEED,
        "replicates": len(exact_rates),
        "exact_match_rate_95pct_ci": bounds(exact_rates),
        "character_error_rate_95pct_ci": bounds(cers),
        "interpretation": "diagnostic uncertainty interval; rows are resampled as clusters",
    }


def _paired_bootstrap_delta_ci(
    candidate: list[dict[str, Any]],
    native: list[dict[str, Any]],
    replicates: int = BOOTSTRAP_REPLICATES,
) -> dict[str, Any]:
    """Paired row-cluster bootstrap for candidate-minus-native score deltas."""
    candidate_by_id = {str(x["occurrence_id"]): x for x in candidate}
    native_by_id = {str(x["occurrence_id"]): x for x in native}
    common = sorted(set(candidate_by_id) & set(native_by_id))
    grouped: dict[str, list[tuple[dict[str, Any], dict[str, Any]]]] = defaultdict(list)
    for occurrence_id in common:
        cand = candidate_by_id[occurrence_id]
        ref = native_by_id[occurrence_id]
        grouped[str(cand["row_id"])].append((cand, ref))
    clusters = list(grouped.values())
    if len(clusters) < 2:
        return {
            "method": "paired row-cluster percentile bootstrap",
            "replicates": 0,
            "note": "fewer than two paired rows",
        }
    rng = random.Random(SEED + 1)
    exact_deltas: list[float] = []
    cer_deltas: list[float] = []
    for _ in range(replicates):
        sample: list[tuple[dict[str, Any], dict[str, Any]]] = []
        for _ in clusters:
            sample.extend(rng.choice(clusters))
        if not sample:
            continue
        cand_exact = sum(bool(cand["exact"]) for cand, _ in sample) / len(sample)
        native_exact = sum(bool(ref["exact"]) for _, ref in sample) / len(sample)
        exact_deltas.append(cand_exact - native_exact)
        cand_chars = sum(int(cand["reference_length"]) for cand, _ in sample)
        native_chars = sum(int(ref["reference_length"]) for _, ref in sample)
        if cand_chars and native_chars:
            cand_cer = sum(int(cand["distance"]) for cand, _ in sample) / cand_chars
            native_cer = sum(int(ref["distance"]) for _, ref in sample) / native_chars
            cer_deltas.append(cand_cer - native_cer)
    def bounds(values: list[float]) -> list[float] | None:
        if not values:
            return None
        values.sort()
        return [round(values[int((len(values) - 1) * 0.025)], 6),
                round(values[int((len(values) - 1) * 0.975)], 6)]
    return {
        "method": "paired row-cluster percentile bootstrap",
        "seed": SEED + 1,
        "replicates": len(exact_deltas),
        "exact_rate_delta_candidate_minus_native_95pct_ci": bounds(exact_deltas),
        "cer_delta_candidate_minus_native_95pct_ci": bounds(cer_deltas),
        "interpretation": "paired uncertainty interval; positive exact delta favors candidate, negative CER delta favors candidate",
    }


def _load_kog2p(root: Path) -> tuple[Callable[[str], str], str]:
    script = root / "g2p.py"
    rulebook = root / "rulebook.txt"
    if not script.is_file() or not rulebook.is_file():
        raise FileNotFoundError(f"KoG2P checkout incomplete: expected {script} and {rulebook}")
    saved_argv = sys.argv[:]
    try:
        sys.argv = [str(script)]
        spec = importlib.util.spec_from_file_location("clippyfirst_external_kog2p", script)
        if spec is None or spec.loader is None:
            raise ImportError("could not load pinned KoG2P module")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
    finally:
        sys.argv = saved_argv
    rule_in, rule_out = module.readRules(module.ver_info[0], str(rulebook))
    def run(word: str) -> str:
        return module.graph2prono(word, rule_in, rule_out)
    return run, "KoG2P custom phone labels -> explicit project-side label-to-IPA adapter"


def _load_hangul_to_ipa(root: Path) -> tuple[Callable[[str], str], str]:
    if not (root / "src" / "worker.py").is_file():
        raise FileNotFoundError(f"hangul_to_ipa checkout incomplete: {root}")
    sys.path.insert(0, str(root))
    try:
        from src.worker import convert  # type: ignore[import-not-found]
    except Exception:
        sys.path.pop(0)
        raise
    def run(word: str) -> str:
        return convert(word, convention="ipa", sep="")
    return run, "upstream IPA output, default rules_to_apply=pastcnhovr"


def _load_espeak(words: list[str]) -> tuple[dict[str, str], str]:
    from phonemizer import phonemize as espeak_phonemize
    # Use eSpeak's own IPA output; do not post-process it through the project G2P.
    rendered = espeak_phonemize(
        words, language="ko", backend="espeak", strip=True,
        preserve_punctuation=False, with_stress=False, njobs=1,
    )
    if isinstance(rendered, str):
        rendered = [rendered]
    if len(rendered) != len(words):
        raise ValueError(f"eSpeak returned {len(rendered)} results for {len(words)} words")
    return dict(zip(words, rendered)), "phonemizer==3.3.0 / eSpeak NG Korean voice; direct IPA output"


def _load_phonemize(path: Path, corpus: Path, output: Path, eligible_words: list[str]) -> tuple[dict[str, str], str]:
    adapter = Path(__file__).with_name("benchmark_phonemize_adapter.cjs")
    env = os.environ.copy()
    env["PHONEMIZE_BASELINE_DIR"] = str(path)
    command = ["node", str(adapter), "--corpus", str(corpus), "--output", str(output)]
    result = subprocess.run(command, check=False, capture_output=True, text=True, env=env)
    if result.returncode:
        raise RuntimeError(f"phonemize adapter exited {result.returncode}: {result.stderr[-1500:]}")
    data = json.loads(output.read_text(encoding="utf-8"))
    predictions = data.get("predictions")
    if not isinstance(predictions, dict):
        raise ValueError("phonemize adapter output has no predictions object")
    eligible = set(eligible_words)
    return {
        word: entry["ipa"] for word, entry in predictions.items()
        if word in eligible and isinstance(entry, dict) and isinstance(entry.get("ipa"), str)
    }, "phonemize@2.0.1 all-language preset; anyAscii=true and stripStress=true; direct IPA output"


def _load_rows_and_words(rows: list[dict[str, Any]]) -> tuple[list[dict[str, str]], list[str]]:
    items: list[dict[str, str]] = []
    unique: list[str] = []
    seen: set[str] = set()
    occurrence_id = 0
    for row in rows:
        for token in row["tokens"]:
            word = token.get("canonical", "")
            gold = token.get("phoneme", "")
            if not isinstance(word, str) or not _HANGUL_TOKEN.fullmatch(word):
                continue
            if not isinstance(gold, str) or not _gold_variants(gold):
                continue
            items.append({"occurrence_id": str(occurrence_id), "row_id": str(row["id"]), "word": word, "gold": gold})
            occurrence_id += 1
            if word not in seen:
                unique.append(word)
                seen.add(word)
    return items, unique


def evaluate(rows: list[dict[str, Any]], args: argparse.Namespace) -> dict[str, Any]:
    from korean_ukrainian.pipeline import phoneticize_korean
    from korean_ukrainian.phonology import parse_syllables
    from korean_ukrainian.ipa import realize_syllables

    items, words = _load_rows_and_words(rows)
    predictions: dict[str, dict[str, Any]] = {}
    engine_meta: dict[str, dict[str, Any]] = {}

    def execute(name: str, source: str, fn: Callable[[str], str], adapter: str) -> None:
        output: dict[str, Any] = {}
        errors: list[dict[str, str]] = []
        for word in words:
            try:
                value = fn(word)
                if not isinstance(value, str) or not value.strip():
                    raise ValueError(f"empty or non-string output: {value!r}")
                output[word] = {"ipa": value}
            except Exception as exc:
                output[word] = {"error": f"{type(exc).__name__}: {exc}"}
                if len(errors) < 30:
                    errors.append({"word": word, "error": output[word]["error"]})
        predictions[name] = output
        engine_meta[name] = {
            "status": "PARTIAL" if errors else "AVAILABLE",
            "source": source, "adapter": adapter,
            "unique_words": len(words), "outputs": len(words) - len(errors),
            "engine_errors": len(errors), "error_examples": errors,
        }

    execute(
        "clippyfirst_native", "ClippyFirst native Python research engine",
        lambda word: _native_ipa(phoneticize_korean, word),
        "native public pipeline output; unresolved predictions are abstentions",
    )
    if not args.exclude_g2pk:
        from g2pk import G2p

        g2p = G2p()
        def g2pk_ipa(word: str) -> str:
            surface = g2p(word)
            if not isinstance(surface, str):
                raise TypeError(f"g2pk returned {type(surface).__name__}")
            surface = "".join(surface.split())
            if not _HANGUL_TOKEN.fullmatch(surface):
                raise ValueError(f"not a single Hangul surface form: {surface!r}")
            return realize_syllables(parse_syllables(surface), level="broad")["ipa"]
        execute("g2pk_0_9_4", "g2pk==0.9.4", g2pk_ipa,
                "g2pk surface Hangul -> project segment renderer; native rules not rerun")

    try:
        kog2p_fn, kog2p_adapter = _load_kog2p(args.kog2p_root)
        execute("KoG2P_2019", "scarletcho/KoG2P commit cbc69bbe1439862364d4ffd1552f59b930f655c7",
                lambda word: kog2p_phones_to_ipa(kog2p_fn(word)), kog2p_adapter)
    except Exception as exc:
        predictions["KoG2P_2019"] = {}
        engine_meta["KoG2P_2019"] = {
            "status": "BLOCKED_OR_ERROR", "source": "scarletcho/KoG2P commit cbc69bbe1439862364d4ffd1552f59b930f655c7",
            "adapter": "custom phone labels -> explicit IPA mapping",
            "engine_errors": len(words), "error_examples": [{"error": f"{type(exc).__name__}: {exc}"}],
        }

    try:
        hangul_fn, hangul_adapter = _load_hangul_to_ipa(args.hangul_to_ipa_root)
        execute("hangul_to_ipa_2026", "stannam/hangul_to_ipa commit 942abf132ea969a7e3476a1487c06710fb8db74b",
                hangul_fn, hangul_adapter)
    except Exception as exc:
        predictions["hangul_to_ipa_2026"] = {}
        engine_meta["hangul_to_ipa_2026"] = {
            "status": "BLOCKED_OR_ERROR", "source": "stannam/hangul_to_ipa commit 942abf132ea969a7e3476a1487c06710fb8db74b",
            "adapter": "direct upstream IPA output",
            "engine_errors": len(words), "error_examples": [{"error": f"{type(exc).__name__}: {exc}"}],
        }

    try:
        espeak_map, espeak_adapter = _load_espeak(words)
        predictions["espeak_ng_ko"] = {word: {"ipa": ipa} for word, ipa in espeak_map.items()}
        engine_meta["espeak_ng_ko"] = {
            "status": "AVAILABLE" if len(espeak_map) == len(words) else "PARTIAL",
            "source": "eSpeak NG via phonemizer==3.3.0",
            "adapter": espeak_adapter, "unique_words": len(words), "outputs": len(espeak_map),
            "engine_errors": len(words) - len(espeak_map), "error_examples": [],
        }
    except Exception as exc:
        predictions["espeak_ng_ko"] = {}
        engine_meta["espeak_ng_ko"] = {
            "status": "BLOCKED_OR_ERROR", "source": "eSpeak NG via phonemizer==3.3.0",
            "adapter": "direct eSpeak IPA output",
            "engine_errors": len(words), "error_examples": [{"error": f"{type(exc).__name__}: {exc}"}],
        }

    try:
        phonemize_map, phonemize_adapter = _load_phonemize(
            args.phonemize_root, args.corpus, args.phonemize_output, words,
        )
        predictions["phonemize_2_0_1"] = {word: {"ipa": ipa} for word, ipa in phonemize_map.items()}
        engine_meta["phonemize_2_0_1"] = {
            "status": "AVAILABLE" if len(phonemize_map) == len(words) else "PARTIAL",
            "source": "hans00/phonemize npm package 2.0.1",
            "adapter": phonemize_adapter, "unique_words": len(words), "outputs": len(phonemize_map),
            "engine_errors": len(words) - len(phonemize_map), "error_examples": [],
        }
    except Exception as exc:
        predictions["phonemize_2_0_1"] = {}
        engine_meta["phonemize_2_0_1"] = {
            "status": "BLOCKED_OR_ERROR", "source": "hans00/phonemize npm package 2.0.1",
            "adapter": "direct IPA output",
            "engine_errors": len(words), "error_examples": [{"error": f"{type(exc).__name__}: {exc}"}],
        }

    scored_by_engine: dict[str, list[dict[str, Any]]] = {name: [] for name in predictions}
    errors_by_engine: dict[str, int] = {name: 0 for name in predictions}
    unresolved_native = 0
    mismatch_details: list[dict[str, Any]] = []

    # Re-evaluate native separately to preserve its explicit abstention state.
    native_cache: dict[str, dict[str, Any]] = {}
    for word in words:
        try:
            result = phoneticize_korean(word)
            native_cache[word] = {
                "ipa": result.get("ipa", {}).get("ipa"),
                "unresolved": result.get("pronunciation_status") == "unresolved",
                "reason": result.get("ipa_status_reason"),
                "unresolved_contexts": result.get("unresolved_contexts", []),
            }
        except Exception as exc:
            native_cache[word] = {"error": f"{type(exc).__name__}: {exc}"}
    native_abstentions_unique = sum(bool(value.get("unresolved")) for value in native_cache.values())
    native_runtime_errors_unique = sum(bool(value.get("error")) for value in native_cache.values())
    engine_meta["clippyfirst_native"].update({
        "status": "PARTIAL" if native_abstentions_unique or native_runtime_errors_unique else "AVAILABLE",
        "outputs": len(words) - native_abstentions_unique - native_runtime_errors_unique,
        "engine_errors": native_runtime_errors_unique,
        "abstentions": native_abstentions_unique,
        "error_examples": [
            {"word": word, "error": value.get("error") or value.get("reason") or "unresolved"}
            for word, value in native_cache.items()
            if value.get("error") or value.get("unresolved")
        ][:30],
    })

    for item in items:
        word, gold = item["word"], item["gold"]
        row_id = item["row_id"]
        for name, engine_predictions in predictions.items():
            entry = engine_predictions.get(word)
            if name == "clippyfirst_native":
                native = native_cache.get(word, {})
                if native.get("unresolved"):
                    unresolved_native += 1
                    continue
                if native.get("error") or not native.get("ipa"):
                    errors_by_engine[name] += 1
                    continue
                raw_prediction = native["ipa"]
            else:
                if not entry or entry.get("error") or not entry.get("ipa"):
                    errors_by_engine[name] += 1
                    continue
                raw_prediction = entry["ipa"]
            try:
                scored = _score(raw_prediction, gold)
                scored.update({"occurrence_id": item["occurrence_id"], "row_id": row_id, "token": word, "gold": gold})
                scored_by_engine[name].append(scored)
            except Exception:
                errors_by_engine[name] += 1

    native_scored = scored_by_engine["clippyfirst_native"]
    engine_results: dict[str, Any] = {}
    for name, scored in scored_by_engine.items():
        attempted = len(items)
        metrics = _metrics(scored)
        result: dict[str, Any] = {
            **metrics,
            "attempted_tokens": attempted,
            "coverage": round(len(scored) / attempted, 6) if attempted else None,
            "abstentions_or_unresolved": unresolved_native if name == "clippyfirst_native" else 0,
            "engine_errors_on_token_loop": errors_by_engine[name],
            "unique_word_engine_status": engine_meta[name],
            "bootstrap_95pct_ci": _bootstrap_ci(scored),
        }
        if name != "clippyfirst_native":
            by_key = {x["occurrence_id"]: x for x in scored}
            native_by_key = {x["occurrence_id"]: x for x in native_scored}
            keys = sorted(set(by_key) & set(native_by_key))
            paired_candidate = [by_key[k] for k in keys]
            paired_native = [native_by_key[k] for k in keys]
            cm, nm = _metrics(paired_candidate), _metrics(paired_native)
            result["paired_with_native"] = {
                "paired_tokens": len(keys),
                "candidate": cm, "native": nm,
                "exact_rate_delta_candidate_minus_native": (
                    round(cm["exact_match_rate"] - nm["exact_match_rate"], 6)
                    if cm["exact_match_rate"] is not None and nm["exact_match_rate"] is not None else None
                ),
                "cer_delta_candidate_minus_native": (
                    round(cm["character_error_rate"] - nm["character_error_rate"], 6)
                    if cm["character_error_rate"] is not None and nm["character_error_rate"] is not None else None
                ),
                "candidate_bootstrap_95pct_ci": _bootstrap_ci(paired_candidate),
                "native_bootstrap_95pct_ci": _bootstrap_ci(paired_native),
                "paired_bootstrap_delta_95pct_ci": _paired_bootstrap_delta_ci(paired_candidate, paired_native),
            }
        engine_results[name] = result

    # Store representative errors without dumping every token or external corpus text.
    for item in items:
        word, gold, row_id = item["word"], item["gold"], item["row_id"]
        native = native_cache.get(word, {})
        row: dict[str, Any] = {"row_id": row_id, "token": word, "gold": gold}
        any_error = False
        for name, engine_predictions in predictions.items():
            if name == "clippyfirst_native":
                entry = native
            else:
                entry = engine_predictions.get(word, {})
            value = entry.get("ipa") if isinstance(entry, dict) else None
            if entry.get("error") or entry.get("unresolved") or not value:
                row[name] = {"status": "unresolved_or_error", "reason": entry.get("error") or entry.get("reason")}
                any_error = True
                continue
            scored = _score(value, gold)
            row[name] = {"ipa": value, "exact": scored["exact"], "distance": scored["distance"]}
            if not scored["exact"]:
                any_error = True
        if any_error and len(mismatch_details) < 250:
            mismatch_details.append(row)

    # Preserve every abstained token occurrence, not just a truncated sample.
    # Repeated words in separate rows count as separate occurrences.
    native_abstention_audit: list[dict[str, Any]] = []
    unresolved_context_counts: dict[str, int] = defaultdict(int)
    for item in items:
        native = native_cache.get(item["word"], {})
        if not native.get("unresolved"):
            continue
        contexts = native.get("unresolved_contexts", [])
        for context in contexts:
            label = str(context.get("rule_id") or "unknown_rule") + ":" + str(
                context.get("reason") or "unspecified_reason"
            )
            unresolved_context_counts[label] += 1
        occurrence: dict[str, Any] = {
            "occurrence_id": item["occurrence_id"],
            "row_id": item["row_id"],
            "token": item["word"],
            "gold": item["gold"],
            "native_status": "unresolved",
            "native_reason": native.get("reason"),
            "unresolved_contexts": contexts,
            "candidate_outputs": {},
        }
        for name, engine_predictions in predictions.items():
            if name == "clippyfirst_native":
                continue
            candidate = engine_predictions.get(item["word"], {})
            value = candidate.get("ipa") if isinstance(candidate, dict) else None
            if isinstance(value, str) and value:
                scored_candidate = _score(value, item["gold"])
                occurrence["candidate_outputs"][name] = {
                    "ipa": value,
                    "exact": scored_candidate["exact"],
                    "distance": scored_candidate["distance"],
                }
            else:
                occurrence["candidate_outputs"][name] = {
                    "status": "error_or_no_output",
                    "reason": candidate.get("error") if isinstance(candidate, dict) else None,
                }
        native_abstention_audit.append(occurrence)

    # Keep the complete native-vs-g2pk occurrence-level ledger in the artifact.
    # The capped multi-engine mismatch sample is useful for quick reading but
    # cannot support a full error count or explain aggregate score differences.
    native_g2pk_pairwise_audit: list[dict[str, Any]] = []
    pairwise_category_counts: dict[str, int] = defaultdict(int)
    g2pk_predictions = predictions.get("g2pk_0_9_4", {})
    for item in (items if not args.exclude_g2pk else []):
        word, gold = item["word"], item["gold"]
        native = native_cache.get(word, {})
        candidate = g2pk_predictions.get(word, {})
        native_score = None
        g2pk_score = None
        if not native.get("unresolved") and not native.get("error") and native.get("ipa"):
            native_score = _score(native["ipa"], gold)
        if isinstance(candidate, dict) and not candidate.get("error") and candidate.get("ipa"):
            g2pk_score = _score(candidate["ipa"], gold)

        if native.get("unresolved"):
            category = "native_abstained_g2pk_exact" if g2pk_score and g2pk_score["exact"] else "native_abstained_g2pk_not_exact"
        elif native.get("error") or not native.get("ipa"):
            category = "native_error_g2pk_exact" if g2pk_score and g2pk_score["exact"] else "native_error_g2pk_not_exact"
        elif not g2pk_score:
            category = "g2pk_error_native_exact" if native_score and native_score["exact"] else "g2pk_error_native_not_exact"
        elif native_score["exact"] and g2pk_score["exact"]:
            category = "both_exact"
        elif native_score["exact"]:
            category = "native_only_exact"
        elif g2pk_score["exact"]:
            category = "g2pk_only_exact"
        else:
            category = "both_not_exact"
        pairwise_category_counts[category] += 1

        native_entry: dict[str, Any] = {
            "status": "unresolved" if native.get("unresolved") else "error" if native.get("error") else "scored" if native_score else "no_output",
            "ipa": native.get("ipa"),
            "reason": native.get("reason") or native.get("error"),
            "exact": native_score["exact"] if native_score else None,
            "distance": native_score["distance"] if native_score else None,
        }
        if native.get("unresolved_contexts"):
            native_entry["unresolved_contexts"] = native["unresolved_contexts"]
        g2pk_entry: dict[str, Any] = {
            "status": "scored" if g2pk_score else "error_or_no_output",
            "ipa": candidate.get("ipa") if isinstance(candidate, dict) else None,
            "reason": candidate.get("error") if isinstance(candidate, dict) else None,
            "exact": g2pk_score["exact"] if g2pk_score else None,
            "distance": g2pk_score["distance"] if g2pk_score else None,
        }
        native_g2pk_pairwise_audit.append({
            "occurrence_id": item["occurrence_id"],
            "row_id": item["row_id"],
            "token": word,
            "gold": gold,
            "category": category,
            "native": native_entry,
            "g2pk_0_9_4": g2pk_entry,
        })

    return {
        "benchmark": args.benchmark_name,
        "benchmark_version": "multi-engine-ipa-diagnostic-v4",
        "dataset_source": args.dataset_source,
        "native_abstention_audit": {
            "occurrence_count": len(native_abstention_audit),
            "unique_words": len({item["token"] for item in native_abstention_audit}),
            "context_counts": dict(sorted(unresolved_context_counts.items())),
            "occurrences": native_abstention_audit,
            "interpretation": "diagnostic triage only; external predictions are not gold and must not be copied into production rules without source adjudication",
        },
        "purpose": "diagnostic G2P comparison only; this dataset is not a normative NIKL acceptance set and this benchmark does not score Ukrainian orthography",
        "dataset_rows": len(rows),
        "eligible_token_occurrences": len(items),
        "unique_hangul_words": len(words),
        "normalization": {
            "function": "benchmark_ugtphon_ko.normalize_ipa",
            "rules": "NFD canonicalization, g->ɡ, tie bars and selected narrow diacritics (including retraction U+0320) removed, spaces/periods removed; stress/length/aspiration/fortis/unreleased stops retained",
            "gold_variants": "best distance among comma-separated IPA alternatives",
        },
        "engine_order": list(engine_results),
        "engines": engine_results,
        "diagnostic_mismatch_sample": mismatch_details,
        "native_g2pk_pairwise_audit": {
            "status": "excluded_by_user_request" if args.exclude_g2pk else "completed",
            "occurrence_count": len(native_g2pk_pairwise_audit),
            "category_counts": dict(sorted(pairwise_category_counts.items())),
            "interpretation": "not run because the user requested exclusion" if args.exclude_g2pk else "complete occurrence-level diagnostic; corpus annotation is not normative gold",
            "occurrences": native_g2pk_pairwise_audit,
        },
        "upstream_pins": {
            **({} if args.exclude_g2pk else {"g2pk": "0.9.4"}),
            "KoG2P": "scarletcho/KoG2P commit cbc69bbe1439862364d4ffd1552f59b930f655c7; GPL-3.0; executed as external checkout, not vendored",
            "hangul_to_ipa": "stannam/hangul_to_ipa commit 942abf132ea969a7e3476a1487c06710fb8db74b; MIT; executed as external checkout, not vendored",
            "phonemize": "hans00/phonemize npm 2.0.1; MIT",
            "eSpeak": "eSpeak NG system package via phonemizer==3.3.0; exact runtime version recorded in CI logs",
        },
        "limitations": [
            ("UGTPHON contains noisy user-generated text, not a balanced official standard-pronunciation test set." if "UGTPHON" in args.benchmark_name else "SIGMORPHON is a lexical word-level test set, not a sentence-context or normative NIKL test set."),
            "IPA conventions differ between systems and reference annotations; exact match and CER are diagnostic, not absolute truth.",
            *([] if args.exclude_g2pk else ["g2pk output is converted through the project's segment renderer, which shares a representation layer with the native system and may bias comparison."]),
            "KoG2P uses a documented custom phone alphabet; the explicit adapter is lossy, and its score must be read with adapter limitations.",
            "hangul_to_ipa explicitly omits several morphology-sensitive processes (including n-insertion and liquid tensification); this is a scope limitation, not an unexpected runtime failure.",
            "phonemize's published Korean evaluation uses a small LLM-judged sample, not this benchmark's independent human-gold IPA.",
            "eSpeak is a TTS-oriented phonemizer baseline, not a claim of narrow-IPA or Korean standard-pronunciation authority.",
            "This benchmark measures Korean IPA output only. It does not compare Ukrainian adaptation quality.",
            "No candidate is considered universally best based on one dataset. Report coverage, abstention, CER, exact match and confidence intervals together.",
        ],
    }


def _native_ipa(phoneticize: Callable[[str], dict[str, Any]], word: str) -> str:
    result = phoneticize(word)
    if result.get("pronunciation_status") == "unresolved":
        raise ValueError("native pronunciation unresolved")
    ipa = result.get("ipa", {}).get("ipa")
    if not isinstance(ipa, str) or not ipa.strip():
        raise ValueError("native engine returned no IPA")
    return ipa


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", type=Path, default=os.environ.get("UGTPHON_KO_TEST_PATH"))
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--benchmark-name", default="UGTPHON Korean test split", help="human-readable dataset/split label")
    parser.add_argument("--dataset-source", default="naver-ai/UGTPHON@ef0d5a09c2ea1874c7206020f875cbd9cfea2f54:ko/test.json (Apache-2.0)", help="dataset provenance and license statement")
    parser.add_argument("--kog2p-root", type=Path, default=os.environ.get("KOG2P_ROOT", "/tmp/KoG2P"))
    parser.add_argument("--hangul-to-ipa-root", type=Path, default=os.environ.get("HANGUL_TO_IPA_ROOT", "/tmp/hangul_to_ipa"))
    parser.add_argument("--phonemize-root", type=Path, default=os.environ.get("PHONEMIZE_BASELINE_DIR", "/tmp/phonemize-baseline"))
    parser.add_argument("--phonemize-output", type=Path, default=Path("/tmp/phonemize-predictions.json"))
    parser.add_argument("--exclude-g2pk", action="store_true",
                        help="do not import, install, or execute g2pk; omit its score and pairwise audit")
    args = parser.parse_args()
    if args.corpus is None:
        parser.error("provide --corpus or set UGTPHON_KO_TEST_PATH")
    try:
        rows = load_corpus(args.corpus)
        report = evaluate(rows, args)
    except Exception as exc:
        print(f"multi-engine benchmark failed: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 2
    rendered = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(rendered, encoding="utf-8")
    print(rendered, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
