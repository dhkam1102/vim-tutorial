# Team Status — 2026-04-27

## Completed work (2026-04-27, push 2)

### 11-topic curriculum restructure (Phase A)
- 14 → 11 sections, 55 → 50 lessons
- Sections: basics, core-editing, line-control, precise-movement, text-objects, search, visual-mode, advanced-navigation, undo-redo, marks-and-jumps, command-mode (empty)
- 5 lessons removed: moving-by-words duplicate, 3 review lessons, mega-review
- 27 lessons moved between sections
- 3 section IDs renamed: basic-operators → core-editing, advanced-vertical-movement → line-control, essential-motions → precise-movement
- localStorage v1 + v2 migration chain
- 31 specific URL redirects + 3 wildcard section redirects
- DB migration script (scripts/migrate-progress-db.sql)
- Server-side auto-migration on GET /api/progress
- Sidebar key display: 2 → 3 keys

## Completed work (2026-04-27, push 1)

- E7/A3 demo terminology fix
- Exercise instruction readability (30/55 reformatted)
- Sidebar visual hierarchy + account info → Preferences
- Hydration mismatch fix
- Mark incomplete button
- Topic title rename (5 topics)
- MODES lesson reorder
- Analysis & planning docs

---

## Prior completed work

### Phase 1 engine — 9/9 complete
### @pedagogy Phase A+B — complete
### Sub-step 4: allowedKeys visual flash
### Sub-step 8: Completion feedback (redesigned)
### Editor height preference

---

## Next session (Phase B)

Start message:
> 어제 vim tutorial 이어서. 11-topic restructure 완료, push함.
> 오늘은 Phase B 시작 — 신규 lesson 8개 작성 + TEXT OBJECTS 통합.
> agent-notes/curriculum-restructure-plan.md 참고.

Tasks:
- 8 new lessons: Repeat Last Edit (.), Join Lines (J), Indent Lines (>>, <<), Intro to Text Objects, Using Marks ('a, `a), Saving & Quitting (:w, :q), Search & Replace, Ranges
- TEXT OBJECTS 16 → 4 lesson consolidation
- switch-visual-line-ends → switch-selection-ends merge

## Deferred

- Lesson triage — user fills `agent-notes/lesson-review.txt` manually
- Phase 2 curriculum migration (37 manual → auto-graded)
- Codebase unification (Brewlog rewrite)
- 4+ key lesson review (basic-movement: h j k l, only l hidden)
- E2 insert-at-line-ends fix
- Personal best tracking
- Admin page stars cleanup

## Known issues

- /api/progress 500 (MySQL not running)
