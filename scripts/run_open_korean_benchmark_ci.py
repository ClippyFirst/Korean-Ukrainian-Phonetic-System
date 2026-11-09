#!/usr/bin/env python3
"""Download, prepare, benchmark and summarize the open supplemental Korean tracks."""
from __future__ import annotations

import hashlib
import json
import os
import shutil
import subprocess
import sys
import tarfile
import time
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.prepare_korean_open_benchmarks import prepare
from scripts.summarize_korean_benchmark_reports import summarize
KSPAN_BUNDLE_URL = (
    "https://dataverse.no/api/access/dataset/:persistentId/versions/2.1"
    "?persistentId=doi:10.18710/TWM79F&format=original"
)
KSPAN_METADATA_URL = "https://dataverse.no/dataset.xhtml?persistentId=doi:10.18710/TWM79F"
KSPAN_FILE_URLS = {
    "kspan_base.csv": "https://dataverse.no/api/access/datafile/1010?format=original",
    "kspan_doc.pdf": "https://dataverse.no/api/access/datafile/1009",
}
KSPAN_EXPECTED_MD5 = {
    "kspan_base.csv": "a0753c4f2421eb071d76b730eb87cbeb",
    "kspan_doc.pdf": "2bf63cc0704a2fe3b4c40445192af77f",
}
NIKL_LICENSE_URL = "https://korean.go.kr/front/reportData/reportDataView.do?mn_id=207&report_seq=1&searchOrder=years"
NIKL_ZIP_URL = (
    "https://korean.go.kr/common/download.do?c_file_name=2c6f86ef-d5fe-489d-a545-9f6115c3d594_0.zip"
    "&file_path=reportData&o_file_name=%ED%98%84%EB%8C%80+%EA%B5%AD%EC%96%B4+%EC%82%AC%EC%9A%A9+%EB%B9%88%EB%8F%84+%EC%A1%B0%EC%82%AC+2.zip"
)
IPA_DICT_COMMIT = "972cd67dd5f96bc5660e28070cde26e3928abcd7"
IPA_DICT_URL = f"https://raw.githubusercontent.com/open-dict-data/ipa-dict/{IPA_DICT_COMMIT}/data/ko.txt"
IPA_DICT_README_URL = f"https://raw.githubusercontent.com/open-dict-data/ipa-dict/{IPA_DICT_COMMIT}/README.md"
SEOUL_URLS = (
    "https://openslr.elda.org/resources/113/label.tgz",
    "https://openslr.trmal.net/resources/113/label.tgz",
)
SEOUL_SHA256 = "63c3f8ffa6976307a732689d6c5be7b2db4ec20f14bf276faf98c886add0d24b"


def _download(url: str, destination: Path, timeout: int = 180) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    last_error: Exception | None = None
    for attempt in range(3):
        try:
            request = urllib.request.Request(
                url,
                headers={"User-Agent": "ClippyFirst-Korean-Benchmark/1.0"},
            )
            with urllib.request.urlopen(request, timeout=timeout) as response:
                data = response.read()
            if not data:
                raise ValueError(f"empty response from {url}")
            destination.write_bytes(data)
            return
        except Exception as exc:  # network failures are retried, never silently skipped
            last_error = exc
            if attempt < 2:
                time.sleep(2 * (attempt + 1))
    raise RuntimeError(f"download failed after 3 attempts: {url}: {last_error}") from last_error


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()

def _md5(path: Path) -> str:
    digest = hashlib.md5()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _extract_kspan_dataset_bundle(bundle_path: Path, destination: Path) -> tuple[Path, Path]:
    """Extract the two pinned K-SPAN v2.1 files from a versioned Dataverse bundle."""
    destination.mkdir(parents=True, exist_ok=True)
    extracted: dict[str, Path] = {}
    with zipfile.ZipFile(bundle_path) as archive:
        names = archive.namelist()
        for filename in ("kspan_base.csv", "kspan_doc.pdf"):
            matches = [
                name for name in names
                if Path(name).name == filename and not name.endswith("/")
            ]
            if len(matches) != 1:
                raise ValueError(
                    f"K-SPAN v2.1 bundle must contain exactly one {filename}; found {matches}"
                )
            target = destination / filename
            target.write_bytes(archive.read(matches[0]))
            extracted[filename] = target
    return extracted["kspan_base.csv"], extracted["kspan_doc.pdf"]


def _download_kspan_sources(workdir: Path) -> tuple[Path, Path]:
    """Fetch the pinned K-SPAN v2.1 files, falling back to individual file IDs.

    Dataverse's versioned bundle endpoint can be denied independently of its
    public per-file access endpoints. A fallback is safe only because both
    individual files are checked against the exact published v2.1 MD5 values.
    """
    workdir.mkdir(parents=True, exist_ok=True)
    bundle = workdir / "kspan-dataverse-v2.1.zip"
    try:
        _download(KSPAN_BUNDLE_URL, bundle)
    except RuntimeError as bundle_error:
        print(
            "K-SPAN versioned bundle endpoint unavailable; trying pinned public "
            f"file IDs 1010/1009: {bundle_error}",
            file=sys.stderr,
            flush=True,
        )
        paths = {
            filename: workdir / filename
            for filename in ("kspan_base.csv", "kspan_doc.pdf")
        }
        try:
            for filename, url in KSPAN_FILE_URLS.items():
                _download(url, paths[filename])
        except RuntimeError as file_error:
            raise RuntimeError(
                "K-SPAN v2.1 download failed through both the versioned bundle "
                f"and pinned individual file endpoints; bundle error: {bundle_error}; "
                f"individual-file error: {file_error}"
            ) from file_error
        sources = paths
    else:
        csv_path, doc_path = _extract_kspan_dataset_bundle(bundle, workdir)
        sources = {"kspan_base.csv": csv_path, "kspan_doc.pdf": doc_path}

    for filename, source_path in sources.items():
        actual_hash = _md5(source_path)
        expected_hash = KSPAN_EXPECTED_MD5[filename]
        if actual_hash != expected_hash:
            raise ValueError(
                f"K-SPAN {filename} MD5 mismatch for Dataverse v2.1 source: "
                f"expected {expected_hash}, got {actual_hash} "
                f"({source_path.stat().st_size} bytes; prefix={source_path.read_bytes()[:8].hex()})"
            )
    return sources["kspan_base.csv"], sources["kspan_doc.pdf"]


def _extract_seoul_archive(archive_path: Path, destination: Path) -> Path:
    destination.mkdir(parents=True, exist_ok=True)
    with tarfile.open(archive_path, "r:gz") as archive:
        archive.extractall(destination, filter="data")
    textgrid_zip = next(destination.rglob("label-TextGrid.zip"), None)
    if textgrid_zip is None:
        raise FileNotFoundError("SLR113 label archive did not contain label-TextGrid.zip")
    textgrid_root = destination / "textgrids"
    textgrid_root.mkdir(exist_ok=True)
    with zipfile.ZipFile(textgrid_zip) as archive:
        for name in archive.namelist():
            target = Path(name)
            if target.is_absolute() or ".." in target.parts:
                raise ValueError(f"unsafe path in Seoul TextGrid zip: {name}")
        archive.extractall(textgrid_root)
    return textgrid_root


def _run(command: list[str], env: dict[str, str], stdout_path: Path | None = None) -> None:
    print("+", " ".join(command), flush=True)
    if stdout_path is None:
        subprocess.run(command, cwd=ROOT, env=env, check=True)
    else:
        with stdout_path.open("w", encoding="utf-8") as stream:
            subprocess.run(command, cwd=ROOT, env=env, stdout=stream, stderr=subprocess.STDOUT, check=True)


def run(workdir: Path, sample_size: int = 1000, seed: int = 20261108) -> Path:
    workdir.mkdir(parents=True, exist_ok=True)
    seoul_root = workdir / "seoul-labels"
    open_root = workdir / "prepared"
    workdir.mkdir(parents=True, exist_ok=True)

    # Verify the source license statements before downloading/reusing the datasets.
    kspan_metadata = workdir / "kspan-dataverse.html"
    nikl_license = workdir / "nikl-license.html"
    ipa_readme = workdir / "ipa-dict-README.md"
    _download(KSPAN_METADATA_URL, kspan_metadata)
    if "CC0 1.0" not in kspan_metadata.read_text(encoding="utf-8", errors="replace"):
        raise ValueError("K-SPAN Dataverse metadata no longer declares CC0 1.0")
    _download(NIKL_LICENSE_URL, nikl_license)
    nikl_html = nikl_license.read_text(encoding="utf-8", errors="replace")
    if "제1유형" not in nikl_html or "출처표시" not in nikl_html:
        raise ValueError("NIKL MKUFS2 source page no longer confirms KOGL Type 1 attribution terms")
    _download(IPA_DICT_README_URL, ipa_readme)
    ipa_credits = ipa_readme.read_text(encoding="utf-8", errors="replace")
    if "Korean data provided by" not in ipa_credits or "CC BY-SA" not in ipa_credits:
        raise ValueError("pinned IPA-Dict README does not document Korean source attribution/license")

    nikl_zip = workdir / "nikl-frequency.zip"
    ipa_dict = workdir / "ipa-dict-ko.txt"
    # Prefer one immutable versioned bundle; if Dataverse denies that route,
    # fetch the exact published file IDs and enforce the same immutable MD5 pins.
    kspan_csv, kspan_doc = _download_kspan_sources(workdir)
    # Print the publisher-supplied encoding table before validating the corpus.
    # This is diagnostic evidence only; the adapter mapping remains hard-coded
    # and is never inferred from benchmark labels.
    from pypdf import PdfReader

    kspan_doc_text = "\n".join(page.extract_text() or "" for page in PdfReader(str(kspan_doc)).pages)
    if not kspan_doc_text.strip():
        raise ValueError("K-SPAN 2.1 documentation PDF contains no extractable text")
    print("BEGIN OFFICIAL K-SPAN 2.1 DOCUMENT TEXT", file=sys.stderr, flush=True)
    print(kspan_doc_text, file=sys.stderr, flush=True)
    print("END OFFICIAL K-SPAN 2.1 DOCUMENT TEXT", file=sys.stderr, flush=True)
    _download(NIKL_ZIP_URL, nikl_zip)
    _download(IPA_DICT_URL, ipa_dict)

    seoul_archive = workdir / "seoul-label.tgz"
    last_error: Exception | None = None
    for url in SEOUL_URLS:
        try:
            _download(url, seoul_archive)
            if _sha256(seoul_archive) != SEOUL_SHA256:
                raise ValueError(f"SLR113 mirror returned an unexpected archive hash: {url}")
            last_error = None
            break
        except Exception as exc:
            last_error = exc
    if last_error is not None:
        raise RuntimeError(f"all SLR113 label archive mirrors failed: {last_error}") from last_error
    textgrid_root = _extract_seoul_archive(seoul_archive, seoul_root)

    inventory = workdir / "seoul-corpus-inventory.json"
    seoul_word_pairs = workdir / "seoul-word-pairs.json"
    seoul_ipa_pairs = workdir / "seoul-ipa-word-pairs.json"
    inspect_log = workdir / "seoul-textgrid-inspection.json"
    _run([
        sys.executable, str(ROOT / "scripts/inspect_seoul_corpus_textgrids.py"),
        "--root", str(textgrid_root),
        "--output", str(inventory),
        "--pairs-output", str(seoul_word_pairs),
        "--ipa-pairs-output", str(seoul_ipa_pairs),
    ], os.environ.copy(), inspect_log)

    manifest = prepare(
        kspan_csv=kspan_csv,
        nikl_zip=nikl_zip,
        ipa_dict=ipa_dict,
        ugtphon_json=Path(os.environ["RUNNER_TEMP"]) / "ko-test.json",
        sigmorphon_json=Path(os.environ["RUNNER_TEMP"]) / "sigmorphon-kor-test.json",
        seoul_ipa_pairs=seoul_ipa_pairs,
        output_dir=open_root,
        sample_size=sample_size,
        seed=seed,
        expected_kspan_rows=63836,
    )
    manifest["kspan"]["documentation_sha256"] = _sha256(kspan_doc)
    manifest["source_checks"] = {
        "kspan_license": "CC0 1.0 verified from Dataverse dataset landing page",
        "nikl_license": "KOGL Type 1 attribution verified from official NIKL report page",
        "ipa_dict_license": "Korean source CC BY-SA 4.0 and source attribution verified from pinned README",
        "seoul_archive_sha256": SEOUL_SHA256,
    }
    (open_root / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (open_root / "source-sha256.txt").write_text(
        "\n".join(
            f"{_sha256(path)}  {path.name}"
            for path in (kspan_csv, kspan_doc, nikl_zip, ipa_dict, seoul_archive)
        ) + "\n",
        encoding="utf-8",
    )

    assert manifest["kspan"]["raw_rows"] == 63836
    assert manifest["kspan"]["key_worldbet_integrity_mismatches"] == 0
    assert manifest["kspan"]["unmatched_word_numbers"] == 0
    assert manifest["kspan"]["sampled_modern_word_types"] == sample_size
    assert manifest["kspan"]["sampled_conservative_word_types"] == sample_size
    assert manifest["ipa_dict"]["sampled_word_types"] == sample_size
    assert manifest["seoul"]["sampled_occurrences"] == sample_size

    env = os.environ.copy()
    for variable in ("KOG2P_ROOT", "KOG2PADVANCED_ROOT", "HANGUL_TO_IPA_ROOT", "PHONEMIZE_BASELINE_DIR"):
        if not env.get(variable):
            raise RuntimeError(f"required external engine path is not set: {variable}")

    tracks = (
        ("seoul-ipa", "Seoul Corpus SLR113 phonemic IPA sample",
         "OpenSLR SLR113; CC BY-NC 2.0; 1,000 weighted word occurrences; phonemic IPA, aggregate-only artifact"),
        ("kspan-modern", "K-SPAN 2.1 Modern surface-phonetic sample",
         "K-SPAN 2.1 kspan_base.csv; CC0 1.0; joined to NIKL MKUFS2 (KOGL Type 1); official keystroke-to-IPA mapping"),
        ("kspan-conservative", "K-SPAN 2.1 Conservative surface-phonetic sample",
         "K-SPAN 2.1 kspan_base.csv; CC0 1.0; joined to NIKL MKUFS2 (KOGL Type 1); official keystroke-to-IPA mapping"),
        ("ipa-dict-ko", "IPA-Dict Korean residual lexical sample",
         f"open-dict-data/ipa-dict@{IPA_DICT_COMMIT} data/ko.txt; Korean source CC BY-SA 4.0; Wiktionary lineage; exact overlap with UGTPHON, SIGMORPHON and K-SPAN excluded"),
    )
    multi_paths: list[str] = []
    for track, label, source in tracks:
        report = open_root / f"{track}-multi-engine-report.json"
        stdout = open_root / f"{track}-multi-engine-stdout.json"
        phonemize = open_root / f"{track}-phonemize-predictions.json"
        command = [
            sys.executable, str(ROOT / "scripts/benchmark_multi_engine_ko.py"),
            "--corpus", str(open_root / f"{track}.json"),
            "--output", str(report),
            "--benchmark-name", label,
            "--dataset-source", source,
            "--kog2p-root", env["KOG2P_ROOT"],
            "--kog2padvanced-root", env["KOG2PADVANCED_ROOT"],
            "--hangul-to-ipa-root", env["HANGUL_TO_IPA_ROOT"],
            "--phonemize-root", env["PHONEMIZE_BASELINE_DIR"],
            "--phonemize-output", str(phonemize),
            "--timing-repetitions", "1",
        ]
        _run(command, env, stdout)
        result = json.loads(report.read_text(encoding="utf-8"))
        if result["eligible_token_occurrences"] != sample_size or len(result["engine_order"]) != 10:
            raise AssertionError(f"{track}: expected {sample_size} tokens and 10 engines")
        if set(result["engine_order"]) != set(result["engines"]):
            raise AssertionError(f"{track}: engine result keys differ from engine_order")
        if result["engines"]["clippyfirst_native"]["scored_tokens"] <= 0:
            raise AssertionError(f"{track}: ClippyFirst Native produced no scored tokens")
        for name in result["engine_order"]:
            metrics = result["engines"][name]
            print("ENGINE", track, name, {
                "strict_exact": metrics.get("exact_match_rate"),
                "strict_cer": metrics.get("character_error_rate"),
                "broad_exact": metrics.get("broad_candidate", {}).get("exact_match_rate"),
                "broad_cer": metrics.get("broad_candidate", {}).get("character_error_rate"),
            }, flush=True)
        multi_paths.append(f"{track}={report}")

    browser_paths: list[str] = []
    browser_tracks = (
        ("kspan-modern", "K-SPAN 2.1 Modern surface-phonetic sample", "K-SPAN 2.1; CC0 1.0; NIKL MKUFS2 word-index join; modern surface-phonetic IPA"),
        ("kspan-conservative", "K-SPAN 2.1 Conservative surface-phonetic sample", "K-SPAN 2.1; CC0 1.0; NIKL MKUFS2 word-index join; conservative surface-phonetic IPA"),
        ("ipa-dict-ko", "IPA-Dict Korean residual lexical sample", "IPA-Dict Korean; CC BY-SA 4.0; Wiktionary lineage; orthographic overlap excluded"),
    )
    node = shutil.which("node")
    if not node:
        raise RuntimeError("Node.js is required for Browser three-mode benchmarks")
    for track, label, source in browser_tracks:
        mode_reports = {}
        for mode in ("strict", "soft", "super-soft"):
            report = open_root / f"{track}-browser-{mode}-report.json"
            _run([
                node, str(ROOT / "scripts/benchmark_kozak_kim_browser.mjs"),
                "--corpus", str(open_root / f"{track}.json"),
                "--split", "test",
                "--mode", mode,
                "--benchmark-name", label,
                "--dataset-source", source,
                "--output", str(report),
            ], env)
            result = json.loads(report.read_text(encoding="utf-8"))
            if result["eligible_tokens"] != sample_size or result["morphology_mode"] != mode:
                raise AssertionError(f"{track}/{mode}: unexpected eligible count or mode")
            if result["engine_errors"] != 0:
                raise AssertionError(f"{track}/{mode}: Browser engine errors: {result['engine_errors']}")
            mode_reports[mode] = result
            browser_paths.append(f"{track}-{mode}={report}")
        if mode_reports["soft"]["output_available_tokens"] < mode_reports["strict"]["output_available_tokens"]:
            raise AssertionError(f"{track}: Soft candidate availability regressed below Strict")
        if mode_reports["super-soft"]["output_available_tokens"] < mode_reports["soft"]["output_available_tokens"]:
            raise AssertionError(f"{track}: Super-soft candidate availability regressed below Soft")
        if mode_reports["super-soft"]["output_available_tokens"] != sample_size:
            raise AssertionError(f"{track}: Super-soft did not emit a typed candidate for every eligible word")
        for mode, result in mode_reports.items():
            print("BROWSER", track, mode, {
                "eligible": result["eligible_tokens"],
                "source_resolved_scored": result["scored_tokens"],
                "coverage": result["coverage_rate"],
                "candidate_available": result["output_available_tokens"],
                "exact": result["exact_match_rate"],
                "coverage_adjusted_exact": result["coverage_adjusted_exact_match_rate"],
                "cer": result["character_error_rate"],
                "heuristic": result["heuristic_tokens"],
                "typed_fallback": result["typed_fallback_tokens"],
            }, flush=True)

    summary_path = workdir.parent / "open-korean-benchmark-summary.json"
    summary = summarize(multi_paths, browser_paths, open_root / "manifest.json")
    summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "summary": str(summary_path),
        "manifest": str(open_root / "manifest.json"),
        "multi_engine_tracks": len(multi_paths),
        "browser_mode_reports": len(browser_paths),
        "sample_size": sample_size,
    }, ensure_ascii=False, indent=2), flush=True)
    return summary_path


def main() -> int:
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workdir", type=Path, required=True)
    parser.add_argument("--sample-size", type=int, default=1000)
    parser.add_argument("--seed", type=int, default=20261108)
    args = parser.parse_args()
    run(args.workdir, args.sample_size, args.seed)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
