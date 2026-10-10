import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const audit = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-TRACEABILITY-AUDIT-2026-10-10.md', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);
const needsReview = rows.filter((row) => !/(?:§{1,2}\s*\d|제\s*\d+\s*항|표준\s*발음법|표준발음법)/u.test(row.rule_notes) && !/^(?:Baseline control|Corpus control)/u.test(row.rule_notes));

test('lexical traceability report lists every note without an explicit article reference', () => {
  assert.match(audit, new RegExp('Snapshot: `data/korean/lexical_pronunciations\\.csv` contains \\*\\*' + rows.length + '\\*\\* rows; \\*\\*' + needsReview.length + '\\*\\* rows'));
  for (const row of needsReview) {
    assert.ok(
      audit.split('\n').some((line) => line.startsWith('| ' + row.input + ' |')),
      row.input + ': traceability review queue must include every qualifying lexical row',
    );
  }
});

test('traceability report explicitly prohibits guessing article numbers', () => {
  assert.match(audit, /Do not assign a rule number from a guessed sound-process label/u);
  assert.match(audit, /article mapping pending/u);
  assert.match(audit, /review queue, not an instruction to append an arbitrary article number/u);
});
