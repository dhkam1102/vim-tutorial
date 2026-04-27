# Team Status — 2026-04-27

## Completed work (2026-04-27 session)

### Demo terminology fix (E7) ✅
- 8 demo description strings: EDIT → Insert mode, NAV → Normal mode

### Exercise instruction readability ✅
- 30 of 55 exercise instructions reformatted (numbered lists, bullets, \n\n)
- CSS: whitespace-pre-line on instruction element
- Label: "Exercise:" → "Exercise" with line break separation

### Sidebar visual hierarchy ✅
- Section headers brightened: --text-secondary → --text-muted
- Border-top divider between section groups

### Sidebar account info → Preferences ✅
- Email + Sign out moved into Preferences panel
- UserWidget.tsx now unused (can delete)

### Hydration mismatch fix ✅
- border-t conditional on Sidebar section groups

### Mark incomplete button ✅
- Per-lesson "mark incomplete" in toolbar with visual feedback

### Topic title rename (5 topics) ✅
- Modes → Basics
- Deleting and Changing → Core Editing
- Line Navigation → Line Control
- Searching → Search
- Selecting Text → Visual Mode

### MODES lesson reorder ✅
- New order: Intro to Modes → Insert Mode → Basic Movement → Moving by Words

### Analysis & planning docs ✅
- `agent-notes/code-length-impact.md` — initialText length change impact
- `agent-notes/codebase-options.md` — 5 codebase candidates for unification
- `agent-notes/lesson-triage.md` — 55-lesson triage table
- `agent-notes/lesson-review.txt` — per-lesson review checklist (blank)
- `agent-notes/curriculum-restructure-plan.md` — 11-topic restructure plan

---

## Prior completed work

### Phase 1 engine — 9/9 complete ✅
### @pedagogy Phase A+B — complete
### Sub-step 4: allowedKeys visual flash ✅
### Sub-step 8: Completion feedback (redesigned) ✅
### Editor height preference ✅

---

## Next session

Start message:
> Title rename + restructure plan까지 끝내고 푸시함.
> 오늘은 11-topic restructure 시작 예정.
> agent-notes/curriculum-restructure-plan.md 읽고 Phase A부터.

Tasks:
- 11-topic restructure Phase A — reorder topics, keep IDs
- 6 new lessons (Phase B)
- Codebase unification (ref: `agent-notes/codebase-options.md`)

## Deferred

- Lesson triage — user fills `agent-notes/lesson-review.txt` manually
- Phase 2 curriculum migration (37 manual → auto-graded)
- Brewlog rewrite (with codebase unification)
- Personal best tracking
- E2 insert-at-line-ends fix
- Admin page stars cleanup

## Known issues

- /api/progress 500 (MySQL not running)
