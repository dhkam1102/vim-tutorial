# Team Status — 2026-04-23

## Approved plans (not yet implemented)

- **@pedagogy** Phase A+B: `~/.claude/plans/bright-drifting-fiddle.md`
- **@exercise-design** Phase 1 engine: `~/.claude/plans/valiant-tumbling-torvalds.md`
- Specs: `agent-notes/curriculum-audit-summary.md`, `agent-notes/exercise-audit-summary.md`

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
