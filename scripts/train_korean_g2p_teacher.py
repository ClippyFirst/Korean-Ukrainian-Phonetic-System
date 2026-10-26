#!/usr/bin/env python3
"""Train a small research-only Korean G2P teacher from scratch on pinned train/dev data.

The model is a hypothesis generator for deterministic-rule research, not a runtime
dependency. It uses only SIGMORPHON train for gradient updates and dev for model
selection; it never opens a test partition or downloads pretrained weights.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import random
import unicodedata
from collections import Counter
from pathlib import Path

PAD = "<pad>"
UNK = "<unk>"
BOS = "<bos>"
EOS = "<eos>"
DATASET_ID = "sigmorphon-2021-task1-medium-korean"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def edit_distance(left: list | str, right: list | str) -> int:
    if len(left) < len(right):
        left, right = right, left
    previous = list(range(len(right) + 1))
    for i, a in enumerate(left, 1):
        current = [i]
        for j, b in enumerate(right, 1):
            current.append(min(current[-1] + 1, previous[j] + 1, previous[j - 1] + (a != b)))
        previous = current
    return previous[-1]


def load_examples(path: Path, expected_split: str) -> list[dict]:
    rows: list[dict] = []
    ids: set[str] = set()
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"{path}:{line_number}: invalid JSONL") from exc
        if not isinstance(row, dict):
            raise ValueError(f"{path}:{line_number}: expected object")
        if row.get("dataset_id") != DATASET_ID or row.get("split") != expected_split:
            raise ValueError(f"{path}:{line_number}: unexpected dataset or split")
        if row.get("target_representation") != "tokenized_ipa_from_sigmorphon_tsv":
            raise ValueError(f"{path}:{line_number}: unexpected target representation")
        case_id = row.get("case_id")
        source = row.get("source_text")
        target = row.get("target_raw")
        if not isinstance(case_id, str) or not case_id or case_id in ids:
            raise ValueError(f"{path}:{line_number}: missing or duplicate case_id")
        if not isinstance(source, str) or not source.strip():
            raise ValueError(f"{path}:{line_number}: missing source_text")
        if not isinstance(target, str) or not target.strip():
            raise ValueError(f"{path}:{line_number}: missing target_raw")
        ids.add(case_id)
        source_nfc = unicodedata.normalize("NFC", source.strip())
        rows.append({
            "case_id": case_id,
            "source_text": source_nfc,
            "source_chars": list(source_nfc),
            "target_raw": target,
            "target_tokens": target.split(),
            "split": expected_split,
        })
    if not rows:
        raise ValueError(f"{path}: no examples")
    return rows


def score_predictions(references: list[list[str]], predictions: list[list[str]]) -> dict:
    if len(references) != len(predictions):
        raise ValueError("reference/prediction count mismatch")
    exact = 0
    token_errors = 0
    reference_token_count = 0
    char_errors = 0
    reference_char_count = 0
    for reference, prediction in zip(references, predictions):
        exact += reference == prediction
        token_errors += edit_distance(reference, prediction)
        reference_token_count += len(reference)
        ref_chars = "".join(reference)
        pred_chars = "".join(prediction)
        char_errors += edit_distance(ref_chars, pred_chars)
        reference_char_count += len(ref_chars)
    n = len(references)
    if not n:
        raise ValueError("cannot score an empty evaluation set")
    return {
        "example_count": n,
        "exact_matches": exact,
        "exact_match_rate": exact / n,
        "token_edit_distance": token_errors,
        "reference_token_count": reference_token_count,
        "token_error_rate": token_errors / max(reference_token_count, 1),
        "compact_character_edit_distance": char_errors,
        "reference_compact_character_count": reference_char_count,
        "compact_character_error_rate": char_errors / max(reference_char_count, 1),
        "metric_note": "dev-only; target tokens are source tokenized IPA; compact character metric removes token separators but does not normalize IPA symbols",
    }


def verify_corpus_manifest(input_dir: Path, train_path: Path, dev_path: Path) -> dict:
    manifest_path = input_dir / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if manifest.get("dataset_id") != DATASET_ID:
        raise ValueError("unexpected corpus manifest dataset_id")
    for split, path in (("train", train_path), ("dev", dev_path)):
        data = path.read_bytes()
        meta = manifest.get("splits", {}).get(split, {})
        if sha256(data) != meta.get("output_file_sha256"):
            raise ValueError(f"{split}: JSONL hash does not match corpus manifest")
    return manifest


def build_vocab(examples: list[dict], *, target: bool) -> dict[str, int]:
    counts: Counter[str] = Counter()
    for example in examples:
        counts.update(example["target_tokens"] if target else example["source_chars"])
    specials = [PAD, UNK, BOS, EOS] if target else [PAD, UNK, EOS]
    tokens = sorted(counts, key=lambda token: (-counts[token], token))
    vocab = {token: index for index, token in enumerate(specials)}
    for token in tokens:
        if token not in vocab:
            vocab[token] = len(vocab)
    return vocab


def encode_source(example: dict, vocab: dict[str, int]) -> list[int]:
    return [vocab.get(char, vocab[UNK]) for char in example["source_chars"]] + [vocab[EOS]]


def encode_target(example: dict, vocab: dict[str, int]) -> list[int]:
    return [vocab[BOS]] + [vocab.get(token, vocab[UNK]) for token in example["target_tokens"]] + [vocab[EOS]]


def _torch_components():
    try:
        import torch
        from torch import nn
        from torch.nn.utils.rnn import pack_padded_sequence, pad_packed_sequence
    except ImportError as exc:
        raise RuntimeError("training requires PyTorch; install a CPU build for this research-only workflow") from exc

    class AttentiveGRU(nn.Module):
        def __init__(self, source_vocab_size: int, target_vocab_size: int, pad_id: int,
                     embedding_dim: int = 96, hidden_dim: int = 128):
            super().__init__()
            self.pad_id = pad_id
            self.hidden_dim = hidden_dim
            self.source_embedding = nn.Embedding(source_vocab_size, embedding_dim, padding_idx=pad_id)
            self.target_embedding = nn.Embedding(target_vocab_size, embedding_dim, padding_idx=pad_id)
            self.encoder = nn.GRU(embedding_dim, hidden_dim, batch_first=True, bidirectional=True)
            self.bridge = nn.Linear(hidden_dim * 2, hidden_dim)
            self.decoder = nn.GRU(embedding_dim, hidden_dim, batch_first=True)
            self.key_projection = nn.Linear(hidden_dim * 2, hidden_dim, bias=False)
            self.output_projection = nn.Linear(hidden_dim * 3, target_vocab_size)

        def encode(self, source, source_lengths):
            embedded = self.source_embedding(source)
            packed = pack_padded_sequence(embedded, source_lengths.cpu(), batch_first=True, enforce_sorted=False)
            packed_outputs, hidden = self.encoder(packed)
            outputs, _ = pad_packed_sequence(packed_outputs, batch_first=True, total_length=source.size(1))
            initial = torch.tanh(self.bridge(torch.cat((hidden[-2], hidden[-1]), dim=-1))).unsqueeze(0)
            keys = self.key_projection(outputs)
            padding_mask = source.eq(self.pad_id)
            return outputs, keys, initial, padding_mask

        def decode(self, target_input, encoder_outputs, encoder_keys, hidden, source_padding_mask):
            embedded = self.target_embedding(target_input)
            decoded, hidden = self.decoder(embedded, hidden)
            scores = torch.bmm(decoded, encoder_keys.transpose(1, 2)) / math.sqrt(self.hidden_dim)
            scores = scores.masked_fill(source_padding_mask.unsqueeze(1), -1e9)
            attention = torch.softmax(scores, dim=-1)
            context = torch.bmm(attention, encoder_outputs)
            logits = self.output_projection(torch.cat((decoded, context), dim=-1))
            return logits, hidden

        def forward(self, source, source_lengths, target_input):
            enc_out, enc_keys, hidden, source_mask = self.encode(source, source_lengths)
            logits, _ = self.decode(target_input, enc_out, enc_keys, hidden, source_mask)
            return logits

        @torch.no_grad()
        def greedy_decode(self, source, source_lengths, bos_id: int, eos_id: int, max_steps: int):
            self.eval()
            enc_out, enc_keys, hidden, source_mask = self.encode(source, source_lengths)
            batch_size = source.size(0)
            current = torch.full((batch_size, 1), bos_id, dtype=torch.long, device=source.device)
            finished = torch.zeros(batch_size, dtype=torch.bool, device=source.device)
            generated = []
            for _ in range(max_steps):
                logits, hidden = self.decode(current, enc_out, enc_keys, hidden, source_mask)
                next_token = logits[:, -1, :].argmax(dim=-1)
                next_token = torch.where(finished, torch.full_like(next_token, eos_id), next_token)
                generated.append(next_token)
                finished |= next_token.eq(eos_id)
                current = next_token.unsqueeze(1)
                if bool(finished.all()):
                    break
            if not generated:
                return [[] for _ in range(batch_size)]
            sequences = torch.stack(generated, dim=1).tolist()
            results = []
            for sequence in sequences:
                clean = []
                for token in sequence:
                    if token == eos_id:
                        break
                    clean.append(token)
                results.append(clean)
            return results

    return torch, nn, AttentiveGRU


def train(input_dir: Path, output_dir: Path, *, epochs: int, batch_size: int,
          seed: int, patience: int, max_decode_length: int) -> dict:
    train_path, dev_path = input_dir / "train.jsonl", input_dir / "dev.jsonl"
    source_manifest = verify_corpus_manifest(input_dir, train_path, dev_path)
    train_examples = load_examples(train_path, "train")
    dev_examples = load_examples(dev_path, "dev")
    train_forms = {row["source_text"] for row in train_examples}
    dev_forms = {row["source_text"] for row in dev_examples}
    if train_forms & dev_forms:
        raise ValueError(f"train/dev source-form leakage: {len(train_forms & dev_forms)} forms")
    torch, nn, Model = _torch_components()
    random.seed(seed)
    torch.manual_seed(seed)
    torch.use_deterministic_algorithms(True)
    torch.set_num_threads(2)
    device = torch.device("cpu")

    source_vocab = build_vocab(train_examples, target=False)
    target_vocab = build_vocab(train_examples, target=True)
    src_pad, tgt_pad = source_vocab[PAD], target_vocab[PAD]
    encoded_train = [(encode_source(row, source_vocab), encode_target(row, target_vocab)) for row in train_examples]
    encoded_dev = [(encode_source(row, source_vocab), encode_target(row, target_vocab)) for row in dev_examples]
    model = Model(len(source_vocab), len(target_vocab), tgt_pad).to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=0.001, weight_decay=1e-5)
    loss_fn = nn.CrossEntropyLoss(ignore_index=tgt_pad)

    def batches(encoded, indices):
        for start in range(0, len(indices), batch_size):
            chosen = [encoded[i] for i in indices[start:start + batch_size]]
            src_seqs = [item[0] for item in chosen]
            tgt_seqs = [item[1] for item in chosen]
            src_lengths = torch.tensor([len(seq) for seq in src_seqs], dtype=torch.long)
            src = torch.full((len(chosen), max(map(len, src_seqs))), src_pad, dtype=torch.long)
            tgt = torch.full((len(chosen), max(map(len, tgt_seqs))), tgt_pad, dtype=torch.long)
            for i, seq in enumerate(src_seqs):
                src[i, :len(seq)] = torch.tensor(seq)
            for i, seq in enumerate(tgt_seqs):
                tgt[i, :len(seq)] = torch.tensor(seq)
            yield src.to(device), src_lengths.to(device), tgt.to(device), chosen

    def predict_dev():
        model.eval()
        predictions = []
        with torch.no_grad():
            indices = list(range(len(encoded_dev)))
            for src, src_lengths, _, chosen in batches(encoded_dev, indices):
                max_steps = min(max_decode_length, max(12, max(len(tgt) for _, tgt in chosen) + 8))
                ids = model.greedy_decode(src, src_lengths, target_vocab[BOS], target_vocab[EOS], max_steps)
                for sequence in ids:
                    tokens = [next_token for next_token in sequence]
                    predictions.append([target_token_by_id.get(token, UNK) for token in tokens])
        return predictions

    target_token_by_id = {value: key for key, value in target_vocab.items()}
    best_state = None
    best_dev_token_error = float("inf")
    best_metrics = None
    best_epoch = 0
    stale_epochs = 0
    history = []
    train_indices = list(range(len(encoded_train)))
    for epoch in range(1, epochs + 1):
        model.train()
        random.Random(seed + epoch).shuffle(train_indices)
        total_loss, total_tokens = 0.0, 0
        for src, src_lengths, tgt, _ in batches(encoded_train, train_indices):
            optimizer.zero_grad(set_to_none=True)
            logits = model(src, src_lengths, tgt[:, :-1])
            gold = tgt[:, 1:]
            loss = loss_fn(logits.reshape(-1, logits.size(-1)), gold.reshape(-1))
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            count = int(gold.ne(tgt_pad).sum().item())
            total_loss += float(loss.item()) * count
            total_tokens += count

        predictions = predict_dev()
        references = [row["target_tokens"] for row in dev_examples]
        metrics = score_predictions(references, predictions)
        record = {"epoch": epoch, "train_token_loss": total_loss / max(total_tokens, 1), **metrics}
        history.append(record)
        print(json.dumps(record, ensure_ascii=False), flush=True)
        if metrics["token_error_rate"] < best_dev_token_error:
            best_dev_token_error = metrics["token_error_rate"]
            best_metrics = metrics
            best_epoch = epoch
            best_state = {key: value.detach().cpu().clone() for key, value in model.state_dict().items()}
            stale_epochs = 0
        else:
            stale_epochs += 1
            if stale_epochs >= patience:
                break

    if best_state is None or best_metrics is None:
        raise RuntimeError("training did not produce a checkpoint")
    output_dir.mkdir(parents=True, exist_ok=True)
    model_path = output_dir / "scratch_teacher.pt"
    torch.save({
        "model_state_dict": best_state,
        "source_vocab": source_vocab,
        "target_vocab": target_vocab,
        "config": {
            "architecture": "bidirectional GRU encoder + dot-attention GRU decoder",
            "embedding_dim": 96,
            "hidden_dim": 128,
            "seed": seed,
            "best_epoch": best_epoch,
            "epochs_requested": epochs,
            "training_data_revision": source_manifest["dataset_revision"],
            "pretrained_weights_used": False,
        },
    }, model_path)

    model.load_state_dict(best_state)
    final_predictions = predict_dev()
    prediction_path = output_dir / "dev-predictions.jsonl"
    with prediction_path.open("w", encoding="utf-8", newline="\n") as handle:
        for row, predicted in zip(dev_examples, final_predictions):
            handle.write(json.dumps({
                "case_id": row["case_id"],
                "split": "dev",
                "source_text": row["source_text"],
                "reference_target_raw": row["target_raw"],
                "reference_target_tokens": row["target_tokens"],
                "predicted_target_tokens": predicted,
                "predicted_target_raw": " ".join(predicted),
                "model_role": "research-only teacher; no runtime use",
            }, ensure_ascii=False, sort_keys=True) + "\n")
    report = {
        "schema_version": "1.0",
        "model_role": "research-only scratch teacher for deterministic-rule hypothesis generation",
        "dataset_id": DATASET_ID,
        "dataset_revision": source_manifest["dataset_revision"],
        "training_source_sha256": source_manifest["splits"]["train"]["output_file_sha256"],
        "development_source_sha256": source_manifest["splits"]["dev"]["output_file_sha256"],
        "training_rows": len(train_examples),
        "development_rows": len(dev_examples),
        "test_rows_loaded": 0,
        "test_data_used_for_training_or_selection": False,
        "pretrained_weights_used": False,
        "best_epoch": best_epoch,
        "training_history": history,
        "best_dev_metrics": best_metrics,
        "checkpoint_sha256": sha256(model_path.read_bytes()),
        "dev_predictions_sha256": sha256(prediction_path.read_bytes()),
        "limitations": [
            "target is SIGMORPHON tokenized roughly-phonemic IPA, not verified ClippyFirst broad IPA",
            "dev metrics are diagnostic and do not establish normative Korean pronunciation accuracy",
            "model is not imported into the product runtime",
        ],
    }
    (output_dir / "training-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return report


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-dir", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--epochs", type=int, default=12)
    parser.add_argument("--batch-size", type=int, default=64)
    parser.add_argument("--seed", type=int, default=20261026)
    parser.add_argument("--patience", type=int, default=3)
    parser.add_argument("--max-decode-length", type=int, default=64)
    args = parser.parse_args(argv)
    if args.epochs < 1 or args.batch_size < 1 or args.patience < 1 or args.max_decode_length < 1:
        parser.error("epochs, batch size, patience, and decode length must be positive")
    try:
        report = train(args.input_dir, args.output_dir, epochs=args.epochs,
                       batch_size=args.batch_size, seed=args.seed, patience=args.patience,
                       max_decode_length=args.max_decode_length)
    except (OSError, ValueError, KeyError, RuntimeError) as exc:
        parser.error(str(exc))
    print(json.dumps({
        "best_epoch": report["best_epoch"],
        "best_dev_metrics": report["best_dev_metrics"],
        "checkpoint_sha256": report["checkpoint_sha256"],
        "test_data_used_for_training_or_selection": False,
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
