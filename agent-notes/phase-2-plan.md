# Phase 2 Plan — Manual → Auto-Graded Migration

**Date:** 2026-04-27
**Scope:** Convert 36 manual exercises in `data/curriculum.ts` to auto-graded goal types.
**Prerequisite:** Phase 1 engine complete (text-equals, text-matches, multi-step, cursor-reach, mode-sequence all implemented in VimEditor.tsx).

---

## (A) How manual exercises currently work

### User flow
1. User sees exercise instructions + initialText in the editor
2. User edits the buffer freely (no validation)
3. User clicks **"mark done"** button in the status bar
4. `handleMarkComplete()` fires → calls `onComplete(null)` with **null score**
5. `LessonContent.handleComplete(null)` records completion but **skips the modal** (`if (score)` is false)
6. User sees "Completed" checkmark — no score, no feedback, no retry prompt

### Data structure
```ts
// Example: delete-lines (line 449)
exercise: {
  initialText: `name = "Alice"\n# DELETE THIS LINE\nage = 30\n# DELETE THIS ONE AS WELL\nactive = True`,
  instructions: 'Delete the two lines that say "DELETE" using dd.',
  hint: 'Move to "DELETE THIS LINE", press dd. Move to the next DELETE line, press dd.',
  goal: { type: 'manual' },   // ← click to complete, no verification
}
```

### Why this is a problem
- Students can click "mark done" without doing anything
- No keystroke tracking, no scoring, no completion modal
- 36 of 55 exercises (65%) work this way — the majority of the curriculum is unverified

---

## (B) What changes with auto-grading

### Goal types available (from Phase 1)

| Type | Completion trigger | Score? | Best for |
|---|---|---|---|
| `text-equals` | `buffer === expected` | Yes (keys + time) | Exact buffer outcomes (delete/paste/rename) |
| `text-matches` | `pattern.test(buffer)` | Yes | Flexible outcomes (user types replacement text) |
| `multi-step` | All steps pass in order | Yes (sum of step ideals) | Sequential operations (review exercises) |
| `cursor-reach` | Cursor hits target positions | Yes | Navigation/search exercises |
| `mode-sequence` | Mode transitions match pattern | Yes | Mode-switching exercises |

### Scoring formula (`VimEditor.tsx:37-44`)
```
efficiency = clamp(ideal / actual * 100, 50, 100)
speedScore = totalMs/targetMs: ≤1→100, ≤2→80, ≤3→60, else→50
score = round(efficiency * 0.6 + speedScore * 0.4)
```
Grade labels: 90+ Perfect, 75-89 Great, 60-74 Well done, <60 Keep practicing.

### Failure handling
- No explicit failure state — user keeps editing until the goal condition passes
- **Hints:** tiered reveal (click for next tier, star cap on later tiers)
- **Reset:** button remounts editor with fresh initialText (caps at 2-star max)
- **Retry:** completion modal has "Try Again" button (remounts via editorKey)

### Connection to completion modal
- Auto-graded goals call `onComplete(score)` with an `ExerciseScore` object
- `LessonContent` receives non-null score → shows `ExerciseCompleteModal` after 600ms
- Modal displays: Score, Efficiency, Speed, Time, Grade label, "Try Again" / "Next Lesson" buttons

---

## (C) The 36 manual exercises — categorized

### Tier 1: text-equals (18 exercises) — exact buffer match

These have deterministic outcomes. The expected text is fully derivable from instructions.

| # | Line | ID | Section | Operation | Difficulty |
|---|---|---|---|---|---|
| 1 | 257 | making-small-edits | basic-vim | r/x/i typo fixes | LOW |
| 2 | 406 | intro-to-operators | basic-operators | dw on one word | LOW |
| 3 | 425 | delete-words | basic-operators | dw + 3dw | LOW |
| 4 | 445 | change-words | basic-operators | cw × 2 (exact targets given) | LOW |
| 5 | 467 | delete-lines | basic-operators | dd × 2 | LOW |
| 6 | 488 | delete-multiple-lines | basic-operators | 3dd or d2j | LOW |
| 7 | 510 | copy-paste-lines | basic-operators | yy/p/P | MED |
| 8 | 784 | delete-inside-brackets | text-objects-brackets | di{ | LOW |
| 9 | 804 | delete-around-brackets | text-objects-brackets | da{ | LOW |
| 10 | 888 | delete-inside-quotes | text-objects-quotes | di" + di' | LOW |
| 11 | 907 | delete-around-quotes | text-objects-quotes | da" | LOW |
| 12 | 991 | delete-inside-word | text-objects-words | diw | LOW |
| 13 | 1008 | delete-around-word | text-objects-words | daw | LOW |
| 14 | 1028 | change-inside-word | text-objects-words | ciw (exact targets given) | LOW |
| 15 | 1049 | words-review | text-objects-words | ciw × 3 (exact names given) | MED |
| 16 | 1081 | delete-inside-paragraph | text-objects-paragraphs | dip | LOW |
| 17 | 1106 | delete-around-paragraph | text-objects-paragraphs | dap | LOW |
| 18 | 1357 | undo-redo | undo-redo | dd then u then Ctrl+r | LOW |

**Work per exercise:** compute `expected` string, set `idealKeystrokes`.

### Tier 2: text-matches (7 exercises) — regex match on buffer

These ask the user to type replacement content. The instructions suggest specific values but other valid inputs exist.

| # | Line | ID | Section | Operation | Why regex? |
|---|---|---|---|---|---|
| 19 | 824 | change-inside-brackets | text-objects-brackets | ci{ + type body | User types free-form replacement |
| 20 | 842 | change-around-brackets | text-objects-brackets | ca{ + type | User types free-form replacement |
| 21 | 925 | change-inside-quotes | text-objects-quotes | ci" × 2 | "change to your name" — open-ended |
| 22 | 943 | change-around-quotes | text-objects-quotes | ca" + type | Any replacement value |
| 23 | 1134 | change-inside-paragraph | text-objects-paragraphs | cip + type body | User types replacement paragraph |
| 24 | 1376 | undo-line-changes | undo-redo | edits then U | Final text = original (but U path, not u) |
| 25 | 761 | intro-to-text-objects | text-objects-brackets | read + position | No buffer change expected |

**Decision needed for #21 and #22:** Rewrite instructions to specify exact replacement text? Then they become text-equals and we avoid regex ambiguity. Recommend: yes — rewrite instructions to give specific targets.

**Decision needed for #19, #20, #23:** Same — give exact expected output in instructions, convert to text-equals. Simpler grading, clearer student goal.

**#24 (undo-line-changes):** Final text equals initialText. Use `text-equals` with `expected = initialText`.

**#25 (intro-to-text-objects):** This exercise asks the user to just "read and position cursor." No buffer change. Options: (a) keep manual, (b) convert to cursor-reach with a target inside `{}`. Recommend: cursor-reach.

**If we rewrite instructions to specify exact targets:** 5 of these move to text-equals, #24 is text-equals, #25 is cursor-reach. Tier 2 effectively dissolves — 0 exercises need text-matches.

### Tier 3: multi-step (4 exercises) — sequential operations

| # | Line | ID | Section | Operations | Steps |
|---|---|---|---|---|---|
| 26 | 862 | brackets-review | text-objects-brackets | di( + di[ + di{ | 3 |
| 27 | 965 | quotes-review | text-objects-quotes | ci" + ci' + ci" | 3 |
| 28 | 1160 | paragraphs-review | text-objects-paragraphs | dip + cip | 2 |
| 29 | 1192 | mega-review | mega-review | ci" + di[ + da{ + cip | 4 |

**Note:** All review exercises require operations in a specific order (top-to-bottom through the buffer). `multi-step` with ordered `textEquals` per step works.

**For #27 and #28:** The `cip`/`ci'` steps involve user-typed content. Same decision as Tier 2 — rewrite instructions to give exact replacement text, making each step a `textEquals` check.

### Tier 4: cursor-reach (6 exercises) — navigation/search

| # | Line | ID | Section | Operation | Challenge |
|---|---|---|---|---|---|
| 30 | 644 | window-scrolls | adv-vertical | Ctrl+d / Ctrl+u | Scroll position varies by viewport height |
| 31 | 672 | search | search | /pattern Enter | Must detect cursor on search result |
| 32 | 688 | repeat-search | search | /pattern, n, N | Multiple target positions |
| 33 | 711 | quick-word-search | search | * on word, n | Multiple target positions |
| 34 | 735 | search-review | search | / then * | Combined search commands |
| 35 | 1408 | setting-marks | marks-and-jumps | ma then 'a | Cursor ends at marked position |
| 36 | 1435 | jump-list | marks-and-jumps | G/gg/Ctrl+o/Ctrl+i | Complex navigation path |

**#30 (window-scrolls):** Scroll amount depends on editor viewport height (half-screen). Hard to predict exact cursor position. Recommend: keep manual or use mode-sequence with Ctrl+d/Ctrl+u detection.

**#31-34 (search):** Search `/pattern` is an interactive ex-command. CodeMirror Vim plugin handles it internally. The cursor lands on the match, but the exact line depends on the pattern. We can set cursor-reach targets at known match positions in the initialText.

**#35-36 (marks/jumps):** These test navigation, not editing. cursor-reach with waypoints works, but the exercises ask students to use *specific commands* (ma, 'a, Ctrl+o) rather than just reaching a position. With `allowedKeys` this is enforceable.

---

## (D) Tricky cases

### Multiple valid Vim commands for the same result

| Exercise | Expected | Also works |
|---|---|---|
| delete-lines | `dd` | `V` then `d`, `0d$J` |
| delete-words | `dw` | `de`, `diw` + adjust |
| change-words | `cw` | `ciw`, `dwi` |
| delete-multiple-lines | `3dd` | `d2j`, `Vjjd` |
| copy-paste-lines | `yy` then `p` | `Vy` then `p` |

**Not a problem for text-equals grading.** We check the *result*, not the *method*. Any command sequence that produces the expected buffer is accepted. The `idealKeystrokes` count should be the shortest common path (e.g., `dd` = 2 keys). Students using longer paths still complete but score lower on efficiency.

### Partial completion

Multi-step handles this inherently — student sees `step 2/4` in the status bar. For text-equals there's no partial state: either the buffer matches or it doesn't.

**Risk:** A student fixes 2 of 3 typos in `making-small-edits` and gets stuck. The exercise won't complete until all 3 are fixed. Mitigated by tiered hints.

### Exercises that may need instruction rewrites

All Tier 2 exercises (change-inside-*, change-around-*) currently say "type new content" or "type your name." For auto-grading we need deterministic expected text.

**Recommendation:** Rewrite instructions to specify exact replacement values:
- "Press ci{ and type `"name": "Alice"`, then Esc"
- "Press ca" and type `42`, then Esc"

This turns all 7 Tier 2 exercises into text-equals, eliminating the need for text-matches entirely in Phase 2.

### Exercises that may need new engine features

| Case | Exercises affected | Feature needed | Status |
|---|---|---|---|
| Scroll-based completion | window-scrolls | Viewport position check | NOT BUILT |
| Interactive search | search × 4 | Ex-command detection or cursor-reach with flexible targets | cursor-reach WORKS if targets are hardcoded |

**window-scrolls** is the only exercise that may need to stay manual or require a new engine feature. All others are convertible with existing goal types.

---

## Proposed conversion order

### Batch 1: text-equals delete operations (8 exercises)
Lines: 467, 488, 784, 804, 888, 907, 991, 1008
Pure deletion — expected text is initialText with lines/words removed. Simplest possible conversion.

### Batch 2: text-equals edit operations (7 exercises)
Lines: 257, 406, 425, 445, 510, 1028, 1357
Typo fixes, word changes, copy-paste, undo-redo. Slightly more complex expected text.

### Batch 3: text-equals with instruction rewrites (8 exercises)
Lines: 824, 842, 925, 943, 1049, 1081, 1106, 1376
Requires rewriting instructions to specify exact replacement text first, then adding text-equals goals.

### Batch 4: multi-step review exercises (4 exercises)
Lines: 862, 965, 1160, 1192
Each needs 2-4 ordered steps with intermediate textEquals checks.

### Batch 5: cursor-reach navigation (7 exercises)
Lines: 672, 688, 711, 735, 761, 1408, 1435
Requires computing target cursor positions from initialText. Search exercises need careful target selection.

### Batch 6: deferred (1 exercise)
Line: 644 (window-scrolls) — keep manual until viewport-aware goal type exists.

**Total: 35 converted + 1 deferred = 36 manual exercises addressed.**

---

## Per-exercise work estimate

| Batch | Count | Work per exercise | Total effort |
|---|---|---|---|
| 1 (delete text-equals) | 8 | Compute expected string + idealKeystrokes | Small |
| 2 (edit text-equals) | 7 | Compute expected string + idealKeystrokes | Small |
| 3 (rewrite + text-equals) | 8 | Rewrite instructions + compute expected | Medium |
| 4 (multi-step) | 4 | Define step sequence + intermediate states | Medium-High |
| 5 (cursor-reach) | 7 | Compute target positions + allowedKeys | Medium |
| 6 (deferred) | 1 | None | - |

---

## Open decisions

1. **Tier 2 dissolution:** Rewrite instructions to give exact targets? (Recommended: yes — eliminates text-matches entirely)
2. **window-scrolls:** Keep manual, or build viewport-position goal type?
3. **Search exercises:** Hardcode cursor-reach targets, or implement pattern-based cursor targets?
4. **Batch size:** Ship all 35 in one commit, or batch-by-batch?
