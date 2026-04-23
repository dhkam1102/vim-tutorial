# Exercise Audit Summary

**Scope:** `data/curriculum.ts` (56 lessons) + `components/VimEditor.tsx` (473 lines).
**Headline:** 9 cursor-reach, 10 mode-sequence, **37 manual (66%)**, 0 multi-goal. Manual dominance = students click "mark done" with zero verification.

---

## A. VimEditor.tsx engine issues (9 total, 4 HIGH)

| ID | Severity | Issue | Fix |
|---|---|---|---|
| A1 | HIGH | mode-sequence bypassable via `i Esc i Esc` — no text change verified | Add `contentCheck` predicate |
| A2 | HIGH | cursor-reach bypassable via arrow keys | Block arrow/Page/Home/End keys |
| A3 | MEDIUM | cursor-reach doesn't enforce taught command (l-mashing works) | Optional `allowedKeys` per NavigationTarget |
| A4 | MEDIUM | Star thresholds too lenient (2× ideal = still 3★) | Tighten to 0.85/0.60, weight 0.7 keys / 0.3 time |
| A5 | HIGH | Single flat hint string spoils answers | `hints?: string[]` with tiered reveal + star caps |
| A6 | LOW | Reset/hint star caps — working correctly | No fix needed |
| A7 | LOW | Target highlight decoration — working correctly | No fix needed |
| A8 | HIGH | Mode-sequence rep counter reinforces A1 | Fixed by A1 |
| A9 | LOW | No per-exercise time feedback in status bar | Show "N keys vs ideal M" on completion |

## B. Top 9 recommendations (ranked)

1. Add `text-equals` / `text-matches` / `multi-step` goal types (unlocks 37 manual lessons)
2. Block arrow keys in cursor-reach (A2)
3. Add `contentCheck` to mode-sequence (A1)
4. Tier hints: `hint: string` → `hints: string[]` (A5)
5. Tighten star thresholds to 0.85/0.60 (A4)
6. `allowedKeys` enforcement for motion lessons (A3)
7. Multi-goal conversions (priority: mega-review → copy-paste-lines → change-words)
8. Fix 2 idealKeystrokes miscounts
9. Distinguish v/V and detect visual-mode `o` press (#48-51)

---

## C. Pedagogy mismatch decisions

| Lesson | Decision |
|---|---|
| §2.1 insert-at-line-ends | Counter-propose: keep Python, align instruction to demo (`# log`). Pending. |
| §2.2 opening-new-lines | Accept pedagogy rewrite |
| §2.3 making-small-edits | Accept pedagogy rewrite; text-equals target: `message = "Hello, World!"\nprint(message)` |
| §8.5 quotes-review | Accept pedagogy rewrite (drop backtick ref) |
| §9.3 change-inside-word | Accept pedagogy rewrite (use snake_case names) |
| §10.1 delete-inside-paragraph | Accept pedagogy rewrite (reference process()) |
| §10.3 change-inside-paragraph | Accept pedagogy rewrite (reference main()) |
| §10.4 paragraphs-review | Accept pedagogy rewrite (reference body()/footer()) |

---

## Blockers

1. **§2.1** — counter-proposal sent: keep Python, align instruction to demo (`# log`). Awaiting pedagogy's accept/counter.

## Queued (user-confirmed, after Phase 1+2)
- **Brewlog rewrite:** All 56 initialText fields → single fictional Flask API codebase, 10-20 lines each, progressive complexity
- **Target highlight restyle:** typing-highlight style with different color
