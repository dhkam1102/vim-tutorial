# VimTutor – Claude Context

## What This Project Is
An interactive vim tutorial website inspired by VimHero. Users learn vim commands through explanations and real in-browser practice — they type actual vim keystrokes into an embedded editor, not multiple choice or simulations.

---

## Tech Stack
| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Vim Editor | CodeMirror 6 + `@replit/codemirror-vim` |
| Font | Geist Mono (via `next/font/google`) |
| Hosting | — (not yet deployed) |
| Repo | `github.com/dhkam1102/vim-tutorial` |
| Local path | `/Users/briankam/github_project/vim-tutorial` |

---

## Project Structure
```
vim-tutorial/
├── app/
│   ├── layout.tsx              # Root layout — sidebar + main content
│   ├── page.tsx                # Home page — curriculum overview
│   └── lessons/[section]/[lesson]/page.tsx  # Dynamic lesson page
├── components/
│   ├── Sidebar.tsx             # Left nav with all sections/lessons + key badges
│   ├── LessonContent.tsx       # Lesson title, description, key badges, editor
│   ├── VimEditor.tsx           # CodeMirror 6 vim editor + mode indicator + hint/reset
│   └── KeyBadge.tsx            # Styled keyboard key chip
├── data/
│   └── curriculum.ts           # All lesson data (sections, lessons, exercises)
├── lib/
│   └── lessonUtils.ts          # getAdjacentLessons, getFirstLesson helpers
└── claude_context.md           # This file
```

---

## Curriculum (14 Sections, 50+ Lessons)
1. **Basic Vim** — modes, hjkl, w/e/b, insert mode
2. **Insert Like a Pro** — I/A, o/O, s/x/r
3. **Essential Motions** — W/E/B, 0/_/$, f/F/;, t/T/;
4. **Basic Operators** — operators intro, dw, cw, dd/D, dj/dk, yy/p/P
5. **Advanced Vertical Movement** — {n}j/k, gg/G, {/}, Ctrl+u/d
6. **Search** — /?, n/N, */# 
7. **Text Objects – Bracket Pairs** — di{, da{, ci{, ca{
8. **Text Objects – Quotes** — di", da", ci", ca"
9. **Text Objects – Words** — diw, daw, ciw
10. **Text Objects – Paragraphs** — dip, dap, cip
11. **Text Objects – Mega Review**
12. **Visual Mode** — v, V, d/c/y, o (switch ends)
13. **Undo & Redo** — u, Ctrl+r, U
14. **Marks & Jumps** — ma/'a, Ctrl+o/Ctrl+i

---

## What Has Been Done
- [x] Archived old GitHub repos: `gitprac`, `flask_prac`, `portfolio-tutorial`, `cs121_project2`, `ICS46`, `CS-121`
- [x] Scaffolded Next.js 16 project with TypeScript + Tailwind
- [x] Installed CodeMirror 6 + `@replit/codemirror-vim` + `@codemirror/theme-one-dark`
- [x] Built full curriculum data (`data/curriculum.ts`) — all 14 sections with lesson text and exercises
- [x] `VimEditor` component — real vim keybindings, live mode indicator (NORMAL/INSERT/VISUAL), hint toggle, reset button
- [x] `Sidebar` component — all sections + lessons, key badges, active lesson highlight
- [x] `LessonContent` component — section label, title, key badges, description with bold formatting, editor, prev/next nav
- [x] `KeyBadge` component — styled key chips (regular keys vs label badges)
- [x] Home page — curriculum overview with section cards and lesson links
- [x] Dynamic lesson route `/lessons/[section]/[lesson]`
- [x] Clean production build (no errors)
- [x] Pushed to GitHub: `dhkam1102/vim-tutorial`

---

## Next Steps
- [ ] **Deploy** — set up Vercel deployment connected to the GitHub repo
- [ ] **Progress tracking** — track which lessons the user has completed (localStorage)
- [ ] **Completion indicators** — checkmarks on sidebar for completed lessons
- [ ] **Exercise validation** — detect when the user's editor content matches the expected outcome and show a success state
- [ ] **Mobile sidebar** — collapsible sidebar / hamburger menu for small screens
- [ ] **Search** — search across lessons/commands
- [ ] **Landing page polish** — hero section, feature highlights before the curriculum list
