# Curriculum Restructure Plan: 13 Topics → 11 Topics

**Date:** 2026-04-27

---

## (a) New 11-Topic Structure (43 lessons)

### TOPIC 1 — BASICS (6 lessons)
| # | Title | Keys | Notes |
|---|---|---|---|
| 1 | Intro to Modes | modes | Quick note: :w, :q for save/quit |
| 2 | Basic Movement | h, j, k, l | |
| 3 | Insert Mode | i, a (extend: I, A) | |
| 4 | Opening New Lines | o, O | |
| 5 | Making Small Edits | x, s, r | |

### TOPIC 2 — CORE EDITING (5 lessons)
| # | Title | Keys | Notes |
|---|---|---|---|
| 6 | Moving by Words | w, b, e | |
| 7 | Delete with Motions | d + motion (dw, db) | |
| 8 | Change with Motions | c + motion (cw, cb) | |
| 9 | Copy & Paste | y + motion, yy, p, P | |
| 10 | Repeat Last Edit | . | **NEW** |

### TOPIC 3 — LINE CONTROL (6 lessons)
| # | Title | Keys | Notes |
|---|---|---|---|
| 11 | Line Start/End | 0, $ | |
| 12 | Absolute Jumps | gg, G | |
| 13 | Delete Lines | dd | |
| 14 | Multiple Deletes | 3dd, d3j | |
| 15 | Join Lines | J | **NEW** |
| 16 | Indent Lines | >>, << | **NEW** |

### TOPIC 4 — PRECISE MOVEMENT (3 lessons)
| # | Title | Keys | Notes |
|---|---|---|---|
| 17 | Find Character | f, F | |
| 18 | Till Character | t, T | |
| 19 | Relative Line Jumps | {n}j, {n}k | |

### TOPIC 5 — TEXT OBJECTS (4 lessons)
| # | Title | Keys | Notes |
|---|---|---|---|
| 20 | Intro to Text Objects | i / a concept | **NEW** — Vim's core concept |
| 21 | Word Objects | diw, daw, ciw, caw | |
| 22 | Quote Objects | di", da", ci", ca" | |
| 23 | Paragraph Objects | dip, dap, cip, cap | |

### TOPIC 6 — SEARCH (4 lessons)
| # | Title | Keys | Notes |
|---|---|---|---|
| 24 | Search | /, ? | |
| 25 | Repeat Search | n, N | |
| 26 | Quick Word Search | *, # | |
| 27 | Search Review | | |

### TOPIC 7 — VISUAL MODE (5 lessons)
| # | Title | Keys | Notes |
|---|---|---|---|
| 28 | Intro to Visual Mode | v | |
| 29 | Visual Mode Operators | v + d/c/y | |
| 30 | Visual Line Mode | V | |
| 31 | Visual Line Operators | V + d/c/y | |
| 32 | Switch Selection Ends | o (visual & visual line) | |

### TOPIC 8 — ADVANCED NAVIGATION (2 lessons)
| # | Title | Keys | Notes |
|---|---|---|---|
| 33 | Paragraph Jumps | {, } | |
| 34 | Window Scrolls | Ctrl+u, Ctrl+d | |

### TOPIC 9 — UNDO & REDO (2 lessons)
| # | Title | Keys | Notes |
|---|---|---|---|
| 35 | Undo / Redo | u, Ctrl+r | |
| 36 | Undo Line Changes | U | |

### TOPIC 10 — MARKS & JUMPS (3 lessons)
| # | Title | Keys | Notes |
|---|---|---|---|
| 37 | Setting Marks | ma | |
| 38 | Using Marks | 'a, `a | **NEW** |
| 39 | Jump List | Ctrl+o, Ctrl+i | |

### TOPIC 11 — COMMAND MODE (3 lessons)
| # | Title | Keys | Notes |
|---|---|---|---|
| 40 | Saving & Quitting | :w, :q, :wq, :q! | **NEW** |
| 41 | Search & Replace | :s/old/new/g | **NEW** |
| 42 | Ranges | :%, :1,5 etc. | **NEW** (optional) |

---

## (b) Change Summary

### New lessons (6)
- Repeat Last Edit (.)
- Join Lines (J)
- Indent Lines (>>, <<)
- Intro to Text Objects (i/a concept)
- Using Marks ('a, `a)
- Command Mode (3 lessons: save/quit, search-replace, ranges)

### Merged lessons
- Insert Mode + Insert at Line Ends → Insert Mode (extended with I, A)

### Removed lessons
- Moving by WORDs (W, B, E) — simplify to lowercase only
- Words Review — absorbed into TEXT OBJECTS
- Quotes Review — absorbed into TEXT OBJECTS
- Paragraphs Review — absorbed into TEXT OBJECTS
- Text Objects Mega Review — absorbed or keep (TBD)
- Switch Visual Line Ends — merged into Switch Selection Ends

### Topic mapping (old → new)
| Old Topic | Old ID | New Topic |
|---|---|---|
| Modes | basic-vim | BASICS |
| Insertion | insert-like-a-pro | BASICS (absorbed) |
| Motions | essential-motions | CORE EDITING + PRECISE MOVEMENT |
| Deleting and Changing | basic-operators | CORE EDITING + LINE CONTROL |
| Line Navigation | advanced-vertical-movement | LINE CONTROL + ADV. NAVIGATION |
| Searching | search | SEARCH |
| Brackets | text-objects-brackets | TEXT OBJECTS |
| Quotes | text-objects-quotes | TEXT OBJECTS |
| Words | text-objects-words | TEXT OBJECTS |
| Paragraphs | text-objects-paragraphs | TEXT OBJECTS |
| Text Objects Review | text-objects-mega-review | TEXT OBJECTS (absorbed) |
| Selecting Text | visual-mode | VISUAL MODE |
| Undo & Redo | undo-redo | UNDO & REDO |
| Marks & Jumps | marks-and-jumps | MARKS & JUMPS |

---

## (c) Migration Strategy

### Impact of changing section IDs
Per analysis in `agent-notes/code-length-impact.md`:
- **URLs** — `/lessons/[sectionId]/[lessonId]` — bookmarks break
- **localStorage** — `${sectionId}::${lessonId}` keys — orphaned
- **Database** — `Progress.sectionId` column — rows orphaned

### Required migration work
1. Old-to-new sectionId mapping table
2. DB migration script (UPDATE Progress SET sectionId = 'new' WHERE sectionId = 'old')
3. localStorage migration in ProgressContext (on load, remap old keys)
4. Next.js redirects in next.config for old URLs

---

## (d) Phased Execution Plan

### Phase A — Reorder topics, keep IDs (safe start)
- Move lessons between existing sections to match new structure
- No ID changes, no URL/DB impact
- Rename section titles (already done for 5)

### Phase B — Write 6 new lessons
- Each needs: description, demo steps, exercise (initialText + goal)
- Priority: Repeat Last Edit (.), Command Mode basics

### Phase C — ID cleanup + migration
- Create old→new ID mapping
- Write DB migration script
- Add localStorage migration logic
- Add Next.js URL redirects
- Update all section IDs in curriculum.ts
