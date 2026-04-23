# Team Status — 2026-04-23 (end of day)

## Plan progress

### @exercise-design Phase 1 engine — 7/9 complete
Plan: `~/.claude/plans/valiant-tumbling-torvalds.md`
- Sub-steps 1-3, 5-7, 9: **complete**
- Sub-step 4 (allowedKeys visual flash): **not done** — blocking works, but DOM keydown handler not reached (CodeMirror/Vim intercepts first). Needs event-path redesign.
- Sub-step 8 (status bar feedback): **not started** — needs stars in label + 4s auto-clear

### @pedagogy Phase A+B — complete
- Phase A: 5/5 broken lessons fixed
- Phase B: 15/15 description appends applied
- Additional: 38 em-dashes removed, 5 Vim command accuracy fixes (E1,E3-E6)

### Phase 2 curriculum migration — not started
- 37 manual → auto-graded conversions, blocked on Phase 1 completion

---

## Deferred items
- **E2**: §2.1 `insert-at-line-ends` — instructions say "console.log", initialText is Python. Needs @pedagogy + @exercise-design coordination.
- **E7+A3**: Demo descriptions use "EDIT"/"NAV" instead of "Insert mode"/"Normal mode" (7 instances). Handle during demo update phase.

---

## Next session
1. Sub-step 4 redo: diagnose why CodeMirror Vim mode intercepts keydown before `EditorView.domEventHandlers`. Try Vim-level key interception or `EditorView.updateListener` approach instead.
2. Sub-step 8: status bar completion feedback (stars + auto-clear)
3. Phase 2 curriculum migration (37 lessons)
4. Demo updates (E7+A3 terminology + matching new exercises)

---

## Queued tasks (not started)
- **Target highlight restyle** — blocked on Phase 1. Owner: @exercise-design + @visual-ui
- **Brewlog exercise rewrite** (USER CONFIRMED) — blocked on Phase 1+2. Owner: @exercise-design + @pedagogy
