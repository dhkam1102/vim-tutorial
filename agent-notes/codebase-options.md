# Codebase Options for initialText Unification

**Date:** 2026-04-27

---

## Prior decisions

Only one prior mention exists across all agent-notes, git history, and code:

> **Brewlog rewrite:** All 56 initialText fields → single fictional Flask API codebase, 10-20 lines each, progressive complexity
> — `agent-notes/exercise-audit-summary.md:56`

Status: user-confirmed as a direction, queued after Phase 1+2. No detailed spec, no candidate comparison, no domain decision beyond "Flask API." No other candidates were discussed.

---

## Candidate options

### Option A: Flask API (Brewlog)

**Domain:** A beer/coffee logging REST API. Routes, models, validation, DB queries.

**Structure:**
```python
# routes.py, models.py, utils.py, config.py
@app.route("/brews", methods=["POST"])
def create_brew():
    data = request.get_json()
    name = data.get("name", "")
    ...
```

**Vim exercise fit:**
- Routes have brackets, quotes, function params → text objects
- Multiple similar route handlers → line navigation, search, copy-paste
- Config dicts → bracket/quote operations
- Validation logic → word changes, delete/change operations

**Pros:**
- Already confirmed direction by user
- Web API patterns are universally recognizable
- Rich in strings, dicts, function calls — covers all text object types
- Easy to scale: more routes = more lines

**Cons:**
- Flask-specific decorators (`@app.route`) may confuse non-Python users
- "Brewlog" is whimsical — some learners may not relate
- API patterns are repetitive — later exercises may feel samey

---

### Option B: Data processing pipeline

**Domain:** CSV/JSON ingestion, transformation, output. Think ETL scripts.

**Structure:**
```python
# pipeline.py
def load_data(filepath):
    with open(filepath) as f:
        reader = csv.DictReader(f)
        records = [row for row in reader]
    return records

def transform(records):
    for record in records:
        record["total"] = float(record["price"]) * int(record["quantity"])
    return records
```

**Vim exercise fit:**
- Nested loops/conditions → paragraph navigation, indentation
- String formatting → quote text objects
- Dict access (`record["key"]`) → bracket/quote operations
- Multiple small functions → line jumps, marks, copy-paste

**Pros:**
- Linear flow (load → transform → save) maps well to progressive difficulty
- No framework knowledge needed — pure Python stdlib
- Lots of string keys, list comprehensions, nested structures
- Natural paragraph breaks between functions

**Cons:**
- Less variety than a web API (no decorators, no HTTP concepts)
- Could feel dry/boring for learners

---

### Option C: CLI tool / argument parser

**Domain:** A command-line utility with argparse, file operations, output formatting.

**Structure:**
```python
# cli.py
import argparse
import json

def parse_args():
    parser = argparse.ArgumentParser(description="File analyzer")
    parser.add_argument("--input", required=True, help="Input file path")
    parser.add_argument("--format", choices=["json", "csv"], default="json")
    return parser.parse_args()

def analyze(filepath):
    with open(filepath) as f:
        data = json.load(f)
    results = {"total": len(data), "errors": 0}
    ...
```

**Vim exercise fit:**
- argparse calls have deeply nested parens + strings → text objects
- Config dicts → bracket operations
- Multiple functions with clear responsibilities → paragraph/line navigation
- `if/elif/else` chains → visual mode selection, delete blocks

**Pros:**
- Everyone has used CLI tools — relatable
- argparse lines are naturally long (great for horizontal motion practice: w, f, t, $)
- Mix of strings, dicts, lists, conditions in one file
- Easy to grow: add more subcommands = more code

**Cons:**
- argparse boilerplate isn't exciting to edit
- Less natural variety than a web API

---

### Option D: Game logic (Snake / Tic-tac-toe)

**Domain:** Simple game implementation. Board state, move validation, scoring.

**Structure:**
```python
# game.py
BOARD_SIZE = 10
EMPTY, SNAKE, FOOD = 0, 1, 2

def create_board(size):
    return [[EMPTY] * size for _ in range(size)]

def move_snake(board, snake, direction):
    head = snake[0]
    dx, dy = {"UP": (-1, 0), "DOWN": (1, 0), "LEFT": (0, -1), "RIGHT": (0, 1)}[direction]
    new_head = (head[0] + dx, head[1] + dy)
    ...
```

**Vim exercise fit:**
- Constants, tuples, dicts → word/quote/bracket text objects
- Board operations → paragraph blocks for dip/dap/cip
- Direction mappings → long dict lines for f/t/$/0 practice
- Game loop with conditions → visual mode, undo practice

**Pros:**
- Fun / engaging — learners might actually want to read the code
- Rich data structures (lists of tuples, nested dicts, enums)
- Game logic has clear state transitions — good for multi-step exercises
- Naturally visual (board = grid) — code is self-explanatory

**Cons:**
- Game code patterns aren't typical work code — less transferable
- Harder to scale linearly (game logic has interdependencies)
- Some exercises need isolated snippets; game code is more coupled

---

### Option E: Real OSS excerpts (requests, flask, click)

**Domain:** Actual code from popular Python libraries, lightly trimmed.

**Structure:**
```python
# Adapted from requests/models.py
class Response:
    def __init__(self):
        self.status_code = None
        self.headers = CaseInsensitiveDict()
        self.encoding = None
        self._content = False

    @property
    def text(self):
        encoding = self.encoding or self.apparent_encoding
        return str(self.content, encoding, errors="replace")
```

**Vim exercise fit:**
- Classes with methods → paragraph navigation, marks
- Decorator patterns → line operations
- Property access chains → word/WORD motions
- Docstrings → quote text objects, visual block selection

**Pros:**
- "Real code" credibility — learners edit code that actually exists
- High variety (classes, functions, decorators, comprehensions, error handling)
- Teaches reading real-world Python as a side effect
- Each library has different patterns — prevents repetition

**Cons:**
- Context-dependent — hard to understand without library knowledge
- License considerations (MIT/Apache is fine, but needs attribution)
- Harder to control difficulty progression — real code isn't pedagogically ordered
- Snippets may feel disconnected from each other

---

## Comparison matrix

| Criterion | A: Flask API | B: Data pipeline | C: CLI tool | D: Game logic | E: Real OSS |
|---|---|---|---|---|---|
| **Relatability** | High | Medium | High | High (fun) | Medium |
| **Text object variety** | High | Medium | High | High | Very high |
| **Scalability** | Easy (add routes) | Easy (add steps) | Easy (add commands) | Moderate | Hard |
| **Progressive difficulty** | Natural | Natural | Natural | Moderate | Hard |
| **Code independence** | Each route stands alone | Each function stands alone | Each command stands alone | Functions are coupled | Snippets are fragments |
| **Framework knowledge** | Flask basics | None | argparse | None | Library-specific |
| **Engagement** | Moderate | Low | Moderate | High | Moderate |

---

## My recommendation: Option A (Flask API) with one adjustment

Flask API is already user-confirmed, has the broadest text-object coverage, and each route handler is a self-contained 5-15 line snippet that works as an independent exercise. The one adjustment: **drop the "Brewlog" brand and use a generic task/todo API.** Reasons:

1. "Todo" is the universal starter project — zero domain explanation needed
2. CRUD routes (create/read/update/delete) map directly to Vim operator categories
3. Every learner has seen a todo API; nobody needs to understand beer brewing

If you want more engagement, Option D (game logic) is a strong second — the code is inherently interesting and the data structures are richer. But it's harder to slice into independent lesson-sized chunks.
