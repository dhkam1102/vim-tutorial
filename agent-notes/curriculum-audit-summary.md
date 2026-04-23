# Curriculum Audit Summary

**Scope:** `data/curriculum.ts` — lesson CONTENT fields only (title, description, instructions, hints). 55 lessons reviewed.

---

## Ratings: 35 ✓ good, 14 ~ needs work, 6 ✗ weak

### ✗ Weak (broken — instructions reference text not in initialText)

| Lesson | Issue | Fix |
|---|---|---|
| 2.1 insert-at-line-ends | Says "console.log" but text is Python `print` | §2.1 blocked — exercise-design counter-proposal pending |
| 2.2 opening-new-lines | Says "First line"/"Second line" but text is `x=1/z=3` | instructions → "press o, type y = 2" |
| 2.3 making-small-edits | Says fix "iz"/"testt" but text has "mesage"/"Hellp"/"primt" | instructions → enumerate actual typos |
| 8.5 quotes-review | References ci\` but no backtick string exists | instructions → drop backtick, use "Alice"/'Hello'/"New York" |
| 9.3 change-inside-word | Says "myVariable" but text has `my_variable` | instructions → match snake_case |
| 10.4 paragraphs-review | Says "Main section"/"Footer section" but text has `body()`/`footer()` | instructions → reference actual functions |

### ~ Needs work (correct but under-specified)

| Lesson | Fix |
|---|---|
| 1.3 moving-by-words | Clarify `e` behavior when already at word-end |
| 1.4 insert-mode | "EDIT"/"NAV" → "Insert mode"/"Normal mode" |
| 3.2 moving-to-line-ends | "const" → "x (first non-blank character)" |
| 4.2 delete-words | Add: dw from mid-word only deletes to end; use diw for whole word |
| 4.3 change-words | Add: cw behaves like ce (no trailing space) |
| 4.6 copy-paste-lines | Drop yw reference (no demo step for it) |
| 5.1 relative-line-jumps | Soften "With relative line numbers on" assumption |
| 6.3 quick-word-search | Add: * matches whole words only; g* for substring |
| 8.1 delete-inside-quotes | Add: multiple quote pairs → picks next pair to right |
| 9.1 delete-inside-word | Add: diW uses WORD definition (punctuation included) |
| 10.1 delete-inside-paragraph | "Second paragraph" → "process() function block" |
| 10.3 change-inside-paragraph | "Body paragraph" → "main()" |
| 13.2 undo-line-changes | Add: U itself is a change; u after U undoes it |
| 14.1 setting-marks | Add: lowercase local, uppercase global across files |
| 14.2 jump-list | Add: Ctrl+i and Tab share a keycode |

---

## Approved plan

**Plan file:** `/Users/briankam/.claude/plans/bright-drifting-fiddle.md`

- **Phase A (1 commit):** Fix 5 ✗ lessons (skip §2.1). Exact old→new strings in plan.
- **Phase B (1 commit):** Polish 15 ~ lessons. Exact edits in plan.
- **Phase C/D (future):** Multi-round scaffolding + reference reconciliation. Blocked on exercise-design Phase 2.
- **Scope:** CONTENT-ONLY in `data/curriculum.ts`. Not touching initialText, goals, idealKeystrokes, cursor coords.

**Status:** Plan approved, 0 edits made (agent died before implementing).

---

## Blockers

1. **§2.1** — exercise-design proposed: keep Python, align instruction to demo (`# log`). Pedagogy hasn't responded yet.
2. **Phase C/D** — blocked on exercise-design's Phase 2 new initialText values.

---

## Proposed rewrite strings (from full audit)

### Weak lessons (✗) — exact old → new

**2.1 insert-at-line-ends**
- instructions: `'Go to line 2 (the print line). Press A to append " # logged" at the end of that line, then Esc.'`
- hint: `'Press j to get to line 2, then A to jump to end-of-line and enter Insert mode.'`

**2.2 opening-new-lines**
- instructions: `'With your cursor on line 1 (x = 1), press o to open a new line below and type y = 2. Press Esc.'`
- hint: `'Press o on line 1, type y = 2, then Esc.'`

**2.3 making-small-edits**
- instructions: `'Fix the typos on these lines: "Hellp" → "Hello" (use r), "mesage" → "message" (insert an s with i or s). Use r to replace one character, and i/s to insert the missing one.'`
- hint: `'Move to p in "Hellp", press r then o. Move between m and e in "mesage", press i then type s.'`

**8.5 quotes-review** (drop backtick reference)
- instructions: `'Practice ci" on the "name" value and ci\' on the "greeting" value. Change each string.'`
- hint: `'Move into each string, press ci followed by the matching quote character, type a new value, Esc.'`

**9.3 change-inside-word**
- instructions: `'Use ciw to rename "my_variable" to "count" and "another_thing" to "total".'`
- hint: `'Move anywhere on "my_variable", press ciw, type "count", Esc. Repeat for the other line.'`

**10.4 paragraphs-review**
- instructions: `'Use dip to delete the body() block, and cip to replace the footer() block with new text.'`
- hint: `'Move into body(), press dip. Move into footer(), press cip, type new text, Esc.'`

### Needs-work lessons (~) — proposed additions

| Lesson | Addition |
|---|---|
| 1.3 moving-by-words | Append to e description: "(or the end of the next word if you're already at one)" |
| 1.4 insert-mode | Replace "EDIT"/"NAV" with "Insert mode"/"Normal mode" in demo descriptions |
| 3.2 moving-to-line-ends | instructions: `'press $ to go to end, 0 to column 0, _ to jump to x (first non-blank)'` |
| 4.2 delete-words | Append: "dw from mid-word only deletes to end — use diw for whole word" |
| 4.3 change-words | Append: "cw behaves like ce — stops at word end, doesn't eat trailing space" |
| 4.6 copy-paste-lines | Drop yw reference (no demo step for it) |
| 5.1 relative-line-jumps | Soften: "If your editor shows relative line numbers..." |
| 6.3 quick-word-search | Append: "* matches whole words only; g* for substring" |
| 8.1 delete-inside-quotes | Append: "multiple quote pairs → picks next pair to the right" |
| 9.1 delete-inside-word | Append: "diW uses WORD definition (punctuation included)" |
| 10.1 delete-inside-paragraph | instructions: reference `process()` function, not "Second paragraph" |
| 10.3 change-inside-paragraph | instructions: reference `main()`, not "Body paragraph" |
| 13.2 undo-line-changes | Append: "U itself is a change; u after U undoes the line-restore" |
| 14.1 setting-marks | Append: "lowercase a-z local; uppercase A-Z global across files" |
| 14.2 jump-list | Append: "Ctrl+i and Tab share a keycode in most terminals" |

---

## Coordination with exercise-design

8 lessons have initialText↔instructions mismatches spanning both scopes:

| Lesson | Decision |
|---|---|
| §2.1 insert-at-line-ends | exercise-design counter-proposed: keep Python, align to demo. Pending. |
| §2.2 opening-new-lines | Accept pedagogy rewrite (instructions match `x = 1 / z = 3`) |
| §2.3 making-small-edits | Accept pedagogy rewrite (instructions match actual typos) |
| §3.2 moving-to-line-ends | Accept pedagogy rewrite (drop "const" reference) |
| §8.5 quotes-review | Accept pedagogy rewrite (drop backtick reference) |
| §9.3 change-inside-word | Accept pedagogy rewrite (use snake_case names) |
| §10.1 delete-inside-paragraph | Accept pedagogy rewrite (reference process()) |
| §10.3 change-inside-paragraph | Accept pedagogy rewrite (reference main()) |
| §10.4 paragraphs-review | Accept pedagogy rewrite (reference body()/footer()) |
