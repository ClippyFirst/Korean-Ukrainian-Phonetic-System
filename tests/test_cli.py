from pathlib import Path
import json

from korean_ukrainian.cli import run_batch


def test_txt_batch_to_jsonl(tmp_path: Path):
    src = tmp_path / "input.txt"
    out = tmp_path / "output.jsonl"
    src.write_text("한국어\n서울\n", encoding="utf-8")
    assert run_batch(src, out, "txt", "jsonl", "text", None, "transliterate") == 2
    rows = [json.loads(x) for x in out.read_text(encoding="utf-8").splitlines()]
    assert len(rows) == 2
    assert rows[0]["input"] == "한국어"


def test_csv_batch_to_csv(tmp_path: Path):
    src = tmp_path / "input.csv"
    out = tmp_path / "output.csv"
    src.write_text("id,text\n1,한국어\n2,서울\n", encoding="utf-8")
    assert run_batch(src, out, "csv", "csv", "text", None, "transliterate") == 2
    content = out.read_text(encoding="utf-8-sig")
    assert "ukrainian_orthography" in content
    assert "result_json" in content


def test_xlsx_batch_to_xlsx(tmp_path: Path):
    import openpyxl
    src = tmp_path / "input.xlsx"
    out = tmp_path / "output.xlsx"
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.append(["id", "text"])
    ws.append([1, "한국어"])
    wb.save(src)
    assert run_batch(src, out, "xlsx", "xlsx", "text", None, "transliterate") == 1
    result = openpyxl.load_workbook(out, data_only=True)
    assert result.active["B1"].value == "text"
    assert "ukrainian_orthography" in [c.value for c in result.active[1]]
