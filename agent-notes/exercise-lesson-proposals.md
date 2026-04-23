# Per-lesson Goal Proposals

**Source:** Full audit of `data/curriculum.ts` (56 lessons).

## Summary by conversion type

### Lessons staying as-is
- #26 intro-to-text-objects (manual, read-only intro)
- #53 undo-line-changes (manual, hard to verify U vs multiple u)

### cursor-reach improvements (9 lessons)
- Block arrow keys on all 9
- Add allowedKeys for: moving-by-words (w/e/b), moving-by-WORDs (W/E/B), find-character (f/F/;/,), till-character (t/T/;/,)
- **2 idealKeystrokes bugs:** basic-movement `[2,0]→[4,0]` should be 3 not 2; moving-by-WORDs `[1,0]→[1,9]` should be 2 not 1

### mode-sequence improvements (10 lessons)
- Add contentCheck to all 10 (verify actual text change, not just mode toggle)
- Visual mode lessons (#48-51): distinguish v from V via `vimState.visualLine`

### manual → auto-graded conversions (37 lessons, 6 buckets)

| Bucket | Count | New goal type | Examples |
|---|---|---|---|
| Capstones/reviews | 8 | multi-step | mega-review, brackets-review, quotes-review, words-review, paragraphs-review |
| text-equals | ~12 | text-equals | delete-inside-brackets, delete-around-quotes, delete-inside-word, delete-inside-paragraph |
| text-matches | ~6 | text-matches + requireNormalOnExit | change-inside-brackets, change-inside-quotes, change-inside-paragraph |
| Search → cursor-reach | 4 | cursor-reach | search, repeat-search, quick-word-search, search-review |
| Keystroke detection | 3 | keystroke-sequence | undo-redo, setting-marks, jump-list |
| Multi-goal | 4 | multi-step | copy-paste-lines, change-words, delete-lines, delete-multiple-lines |

---

## Detailed per-lesson proposals

### §1 Modes
- **#1 intro-to-modes** (mode-seq): add contentCheck `text !== initialText`
- **#2 basic-movement** (cursor-reach): **bug** `[2,0]→[4,0]` idealKeystrokes=2 should be 3. Cut from 8 to 5 targets.
- **#3 moving-by-words** (cursor-reach): lock to w/e/b via allowedKeys
- **#4 insert-mode** (mode-seq): add contentCheck verifying actual text inserted

### §2 Insertion
- **#5 insert-at-line-ends** (mode-seq): drop to reps=1, contentCheck: line 2 ends with added content
- **#6 opening-new-lines** (mode-seq): drop to reps=1, contentCheck: line count increased + new line between existing
- **#7 making-small-edits** (manual→text-equals): expected `message = "Hello, World!"\nprint(message)`

### §3 Motions
- **#8 moving-by-WORDs** (cursor-reach): **bug** `[1,0]→[1,9]` idealKeystrokes=1 should be 2. Lock to W/E/B.
- **#9 moving-to-line-ends** (cursor-reach): tier hint
- **#10 find-character** (cursor-reach): lock to f/F/t/T/;/,
- **#11 till-character** (cursor-reach): same as #10

### §4 Deleting and Changing
- **#12 intro-to-operators** (manual→text-equals): line 1 becomes `delete word please`
- **#13 delete-words** (manual→text-equals): multi-goal candidate
- **#14 change-words** (manual→multi-goal): step 1 `message = "bar"`, step 2 `count = 100`
- **#15 delete-lines** (manual→text-equals)
- **#16 delete-multiple-lines** (manual→text-equals): star tier by command count (1 cmd=3★, 2=2★, 3+=1★)
- **#17 copy-paste-lines** (manual→multi-goal): yank, paste below, paste above

### §5 Line Navigation
- **#18-20** (cursor-reach): calibration correct, tier hints
- **#21 window-scrolls** (manual): auto-complete on first Ctrl+d/Ctrl+u

### §6 Searching
- **#22 search** (manual→cursor-reach): target [1,4]
- **#23 repeat-search** (manual→multi-target cursor-reach): forces `n` usage
- **#24 quick-word-search** (manual→multi-target cursor-reach)
- **#25 search-review** (manual→multi-goal cursor-reach)

### §7 Brackets
- **#26 intro-to-text-objects** (manual): keep as-is (read-only intro)
- **#27 delete-inside-brackets** (manual→text-equals): `config = {\n}`
- **#28 delete-around-brackets** (manual→text-equals): `settings = `
- **#29-30 change-inside/around-brackets** (manual→text-matches + NORMAL return)
- **#31 brackets-review** (manual→multi-goal): di( → di[ → di{

### §8 Quotes
- **#32-33 delete-inside/around-quotes** (manual→text-equals)
- **#34-35 change-inside/around-quotes** (manual→text-matches + NORMAL return)
- **#36 quotes-review** (manual→multi-goal): ci" on "Alice" → ci' on 'Hello'

### §9 Words
- **#37-38 delete-inside/around-word** (manual→text-equals)
- **#39 change-inside-word** (manual→multi-goal)
- **#40 words-review** (manual→multi-goal): 3 sequential ciw renames

### §10 Paragraphs
- **#41-42 delete-inside/around-paragraph** (manual→text-equals)
- **#43 change-inside-paragraph** (manual→text-matches + NORMAL return)
- **#44 paragraphs-review** (manual→multi-goal)

### §11 Mega Review
- **#45 mega-review** (manual→multi-goal): ci" → di[ → da{ → cip with assertions

### §12 Visual Mode
- **#46 intro-to-visual-mode** (mode-seq): OK as-is
- **#47 visual-mode-operators** (mode-seq): add contentCheck
- **#48 switch-selection-ends** (mode-seq): detect `o` keypress in VISUAL, drop to reps=1
- **#49-51**: distinguish `v` from `V` via `vimState.visualLine`

### §13 Undo & Redo
- **#52 undo-redo** (manual→keystroke-sequence): detect dd → u → Ctrl+r
- **#53 undo-line-changes** (manual): keep manual

### §14 Marks & Jumps
- **#54 setting-marks** (manual→keystroke-sequence): detect `ma` then `'a`
- **#55 jump-list** (manual→keystroke-sequence): detect Ctrl+o / Ctrl+i
