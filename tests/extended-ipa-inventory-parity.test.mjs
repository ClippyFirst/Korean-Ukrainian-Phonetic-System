import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { phonemicIpaFromHangul } from '../src/app/phonemic_ipa.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('Python and browser phonemic adapters agree across the frozen modern Hangul inventory', () => {
  const python = spawnSync(process.env.PYTHON || 'python3', [
    path.join(root, 'scripts/export_korean_phonemic_inventory.py')
  ], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, PYTHONPATH: [path.join(root, 'src'), process.env.PYTHONPATH || ''].filter(Boolean).join(path.delimiter) },
    maxBuffer: 16 * 1024 * 1024
  });
  assert.equal(python.status, 0, python.stderr || 'Python inventory exporter failed');
  const expected = JSON.parse(python.stdout);
  assert.equal(expected.length, 11172);
  for (let index = 0; index < expected.length; index++) {
    const source = String.fromCodePoint(0xAC00 + index);
    const actual = phonemicIpaFromHangul(source);
    assert.equal(actual.ipa, expected[index], `phonemic IPA mismatch at U+${(0xAC00 + index).toString(16).toUpperCase()} ${source}`);
  }
});
