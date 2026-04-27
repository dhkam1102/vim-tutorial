# Code Length Change Impact Analysis

**Date:** 2026-04-27
**Question:** What breaks if we make exercise/demo initialText longer?

---

## 1. Prior work

**No code changes have been made** for code length extension. No commits, no WIP, no TODOs.

**Planned but not started:** The "Brewlog rewrite" in `agent-notes/exercise-audit-summary.md` proposes rewriting all 56 initialText fields to a fictional Flask API codebase, 10-20 lines each. Status: queued, blocked on Phase 2.

**Pedagogy plan** (`~/.claude/plans/imperative-snacking-lake.md`) Phase C/D mentions reconciling instruction text against new initialText — acknowledges that changing initialText requires updating instructions that reference specific symbols/lines.

---

## 2. Grading / goal evaluation logic

All grading lives in `components/VimEditor.tsx` inside the `modeDisplay` updateListener (lines 238-348).

### (a) Goal types and their judgment logic

| Goal type | Count | Completion trigger | Code location |
|---|---|---|---|
| **manual** | 37 | User clicks "mark done" button | VimEditor.tsx:509-514 |
| **mode-sequence** | 11 | Mode transitions match pattern N times | VimEditor.tsx:244-260 |
| **cursor-reach** | 10 | Cursor hits hardcoded [row, col] targets in sequence | VimEditor.tsx:263-302 |
| **text-equals** | 0 (type exists) | `buffer === goal.expected` | VimEditor.tsx:304-310 |
| **text-matches** | 0 (type exists) | `goal.pattern.test(buffer)` | VimEditor.tsx:312-318 |
| **multi-step** | 0 (type exists) | All steps pass in order (text + cursor + mode checks) | VimEditor.tsx:320-347 |

### (b) Does initialText length affect grading?

**manual (37 exercises):** No grading at all. Length change is completely safe.

**mode-sequence (11 exercises):** Checks mode transition history (`isSubsequence`) and optional `contentCheck` callback. No `contentCheck` is currently used by any exercise. Length change is safe — grading only cares about mode transitions, not text content or cursor position.

**cursor-reach (10 exercises):** Checks cursor position against hardcoded `target: [row, col]` coordinates. **72 total hardcoded target coordinates** across 10 exercises. If initialText changes (lines added/removed, line lengths change), every target coordinate must be recalculated. **This is the dangerous type.**

**text-equals (0 exercises):** Would compare final buffer to `goal.expected` string. The `expected` string would need to be recomputed if initialText changes. But no exercises use this yet.

**text-matches (0 exercises):** Regex test on buffer. Pattern would likely still match if text structure is preserved. Safer than text-equals.

**multi-step (0 exercises):** Can check text, cursor, and mode per step. Each step's `textEquals`/`cursor` would need updating. But no exercises use this yet.

### (c) idealKeystrokes and scoring

`computeScore()` at VimEditor.tsx:37-44:
```
efficiency = clamp(ideal / actual * 100, 50, 100)
speedScore = based on totalMs / (ideal * 800)
score = round(efficiency * 0.6 + speedScore * 0.4)
```

`idealKeystrokes` is hardcoded per exercise/target. If the code gets longer, the ideal path to reach a target might change (more `j` presses, different `w` counts). **Must be recalculated for cursor-reach exercises** if initialText changes. For mode-sequence, `idealKeystrokes` defaults to `reps * sequence.length` which is text-independent.

### (d) Demo grading

**Confirmed: demos have zero grading logic.** DemoPlayer.tsx has no references to `onComplete`, `score`, `goal`, or any evaluation. Demos are purely visual — each step has hardcoded `text`, `cursor`, and `description` for display.

**However:** Demo steps have **204 hardcoded cursor coordinates** and **200 hardcoded text strings**. If demo initialText changes, every step's `text` and `cursor` must be rewritten to reflect the new content at each point in the walkthrough.

---

## 3. Impact summary per type

| Type | Count | Impact | Label |
|---|---|---|---|
| **manual** | 37 | No grading, no coordinates. Only risk: instructions that reference specific line content by name. | **SAFE** |
| **mode-sequence** | 11 | Checks mode transitions only. No text/cursor dependency. `idealKeystrokes` defaults to `reps * sequence.length`. | **SAFE** |
| **cursor-reach** | 10 | 72 hardcoded `[row, col]` targets + `idealKeystrokes` per segment. All must be recalculated. | **DANGEROUS** |
| **text-equals** | 0 | `expected` string must match new final buffer. | (future: **MODERATE** — recompute expected) |
| **text-matches** | 0 | Regex may survive if structure preserved. | (future: **SAFE** if pattern is general) |
| **multi-step** | 0 | Per-step text/cursor checks need updating. | (future: **MODERATE**) |
| **demo steps** | all 55 | 204 cursor coords + 200 text strings, all hardcoded per step. Every step must be rewritten. | **DANGEROUS** |

### Practical guidance

**Free to change (no coordinate risk):**
- All 37 manual exercises — just update instructions if they reference specific text
- All 11 mode-sequence exercises — grading is text-independent

**Must recalculate coordinates:**
- 10 cursor-reach exercises — every `target: [row, col]` and `idealKeystrokes`
- All demo walkthroughs — every step's `text` and `cursor` fields

**Bottom line:** 48 of 58 exercises can have their initialText freely lengthened. The 10 cursor-reach exercises and all demo walkthroughs require per-field coordinate updates.
