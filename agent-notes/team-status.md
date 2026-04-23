# Team Status — 2026-04-23 (updated)

## Plan progress

### @exercise-design Phase 1 engine — 7/9 complete
Plan: `~/.claude/plans/valiant-tumbling-torvalds.md`
- Sub-steps 1-3, 5-7, 9: **complete**
- Sub-step 4 (allowedKeys red flash): **partial** — blocking works, 250ms visual flash missing
- Sub-step 8 (status bar feedback): **partial** — shows "N keys vs ideal M" but missing stars display + 4s auto-clear

### @pedagogy Phase A — 5/5 complete
Plan: `~/.claude/plans/bright-drifting-fiddle.md`
- All 5 broken lessons fixed (opening-new-lines, making-small-edits, quotes-review, change-inside-word, paragraphs-review)

### @pedagogy Phase B — 0/15 not started
- 15 under-specified lesson description appends, no engine dependency
- Next to execute

### Phase 2 curriculum migration — not started
- 37 manual → auto-graded conversions, blocked on Phase 1 completion

---

## Open decisions

### §2.1 insert-at-line-ends
- initialText is Python (`print`), instruction says "console.log" (JS), demo shows `# log`
- @exercise-design proposed: keep Python, align instruction+hint to demo
- Status: awaiting @pedagogy accept/counter. Does NOT block Phase 1.

---

## Queued tasks (not started)

### Target highlight restyle
- Restyle cursor-reach target highlight. Blocked on Phase 1.
- Owner: @exercise-design + @visual-ui

### Brewlog exercise rewrite (USER CONFIRMED)
- Rewrite all 56 initialText fields → `brewlog` Flask API codebase, 10-20 lines each
- Owner: @exercise-design (initialText) + @pedagogy (instructions/hints)
- Blocked on Phase 1+2
