# Team Status — 2026-04-27

## Completed work (2026-04-27 session)

### Demo terminology fix (E7) ✅
- 8 demo description strings: EDIT → Insert mode, NAV → Normal mode
- Lines affected: §2.1, §2.2, §2.3, §4.1, §4.3 demo steps

### Exercise instruction readability ✅
- 30 of 55 exercise instructions reformatted (25 already clear, left as-is)
- 20 numbered lists (sequential steps)
- 6 \n\n separations (independent parallel tasks)
- 4 bullet lists (unordered practice items)
- Wording untouched — structure/formatting only

### Sidebar visual hierarchy ✅
- Section headers brightened: --text-secondary → --text-muted
- Thin border-top divider added between section groups (non-first)
- Files: globals.css, Sidebar.tsx

### Phase 2 plan document ✅
- Written to `agent-notes/phase-2-plan.md`
- 36 manual exercises catalogued with recommended goal types
- Key finding: text-matches likely unnecessary if instructions are rewritten to specify exact targets

---

## Prior completed work

### Phase 1 engine — 9/9 complete ✅
Plan: `~/.claude/plans/valiant-tumbling-torvalds.md`

### @pedagogy Phase A+B — complete
- Phase A: 5/5 broken lessons fixed
- Phase B: 15/15 description appends applied
- Additional: 38 em-dashes removed, 5 Vim command accuracy fixes (E1,E3-E6)

### Sub-step 4: allowedKeys visual flash ✅
### Sub-step 8: Completion feedback (redesigned) ✅
### Editor height preference ✅

---

## Plan progress

### Phase 2 curriculum migration — NOT STARTED
- Plan doc ready: `agent-notes/phase-2-plan.md`
- Owner will do manual conversion exercise-by-exercise
- 36 manual exercises → ~35 auto-graded + 1 deferred (window-scrolls)

---

## Remaining work

### Next session
- Phase 2: manually convert exercises one-by-one (owner-driven)
- Reference: `agent-notes/phase-2-plan.md` for per-exercise recommendations

### Deferred
- E2 insert-at-line-ends: mismatched instructions/initialText (needs pedagogy + exercise-design)
- A3 allowedKeys enforcement for motion lessons (Phase 2 scope)
- Brewlog exercise rewrite (blocked on Phase 2)
- Target highlight restyle (blocked on Phase 2)
- Personal best tracking (Modal Step 2, localStorage)
- "You beat X%" relative comparison (needs data)

### Known issues
- /api/progress 500 (MySQL not running) — fix when DB is up
- Admin page still references stars (backend not touched)
