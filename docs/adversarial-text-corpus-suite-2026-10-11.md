# Adversarial Korean text corpora

Added 15 separate plain-text corpora under `tests/fixtures/adversarial-corpora/`. Together they cover coda liaison, complex codas, palatalization boundaries, nasal/liquid assimilation, fortition, aspiration, ㄴ insertion, inflection, compounds, numbers/names/loanwords, long mixed prose, negative controls, rule ordering, punctuation/spacing, and evidence-sensitive proper names.

The corpus files are raw test inputs, not pronunciation gold standards. The collection intentionally separates raw input from expected outputs so that a guessed output cannot become its own oracle. The new suite smoke-tests every file through the current engine and checks that each corpus is substantial, distinct, and inspectable through issues and trace.

## Plain-text index

See [00-README.txt](../tests/fixtures/adversarial-corpora/00-README.txt) for a file-by-file guide and recommended testing workflow.

## Run

```sh
node --test tests/adversarial-text-corpus-suite.test.mjs
```

This validates fixture integrity and runtime processing; it does not assert that every form is already resolved or normatively verified. The next phase should produce a separate review ledger with exact span, expected Korean surface form, rule article, source, evidence level, and regression status.
