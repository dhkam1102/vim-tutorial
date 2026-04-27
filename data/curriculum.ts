export type DemoStep = {
  key?: string                          // key shown on screen, e.g. 'i', 'Esc', 'hjkl'
  mode: 'NORMAL' | 'INSERT' | 'VISUAL'
  text: string                          // full editor content at this step
  cursor: [number, number]              // [line, col] 0-indexed
  description: string                   // explanation shown below the editor
}

export type NavigationTarget = {
  target: [number, number]
  idealKeystrokes: number
  allowedKeys?: string[]
}

export type MultiStepStep = {
  textEquals?: string
  textMatches?: RegExp
  cursor?: [number, number]
  mode?: 'NORMAL' | 'INSERT' | 'VISUAL'
  idealKeystrokes?: number
  label?: string
}

export type ExerciseGoal =
  | {
      type: 'mode-sequence'
      sequence: ('NORMAL' | 'INSERT' | 'VISUAL' | 'VISUAL_LINE')[]
      reps: number
      idealKeystrokes?: number
      contentCheck?: (finalText: string, initialText: string) => boolean
    }
  | { type: 'cursor-reach'; targets: NavigationTarget[] }
  | { type: 'text-equals'; expected: string; idealKeystrokes: number; requireNormalOnExit?: boolean }
  | { type: 'text-matches'; pattern: RegExp; idealKeystrokes: number; requireNormalOnExit?: boolean }
  | { type: 'multi-step'; steps: MultiStepStep[] }
  | { type: 'manual' }

export type Lesson = {
  id: string
  title: string
  keys: string[]
  description: string
  demo?: DemoStep[]
  exercise: {
    initialText: string
    instructions: string
    hint?: string
    hints?: string[]
    goal?: ExerciseGoal
  }
}

export type Section = {
  id: string
  title: string
  lessons: Lesson[]
}

export const curriculum: Section[] = [
  {
    id: 'basic-vim',
    title: 'Modes',
    lessons: [
      {
        id: 'intro-to-modes',
        title: 'Intro to Modes',
        keys: ['modes'],
        description:
          'Vim has three main modes.\n\n**Normal mode** is the default. Navigate and run commands here.\n**Insert mode** is for typing text.\n**Visual mode** is for selecting.\nYou switch between them with specific keys.',
        demo: [
          {
            mode: 'NORMAL',
            text: 'name = "Alice"\nage = 30\nactive = True',
            cursor: [0, 0],
            description: 'Normal mode. Block cursor. Navigate but cannot type.',
          },
          {
            key: 'i',
            mode: 'INSERT',
            text: 'name = "Alice"\nage = 30\nactive = True',
            cursor: [0, 0],
            description: 'Insert mode. Cursor is now a line: you can type.',
          },
          {
            key: 'type',
            mode: 'INSERT',
            text: '# user profile\nname = "Alice"\nage = 30\nactive = True',
            cursor: [0, 14],
            description: 'Text appears at the cursor as you type.',
          },
          {
            key: 'Esc',
            mode: 'NORMAL',
            text: '# user profile\nname = "Alice"\nage = 30\nactive = True',
            cursor: [0, 13],
            description: 'Back to Normal mode. Block cursor returns.',
          },
        ],
        exercise: {
          initialText: `# Welcome to Vim!
# This is Normal mode — you cannot type here yet.
# Press i to enter Insert mode, then type something.
# Press Esc to return to Normal mode.`,
          instructions: '1. Press i to enter Insert mode.\n2. Add a word anywhere.\n3. Press Esc to return to Normal mode.',
          hint: 'i enters Insert mode. Esc exits back to Normal mode.',
          goal: { type: 'mode-sequence', sequence: ['INSERT', 'NORMAL'], reps: 1 },
        },
      },
      {
        id: 'basic-movement',
        title: 'Basic Movement',
        keys: ['h', 'j', 'k', 'l'],
        description:
          'In Normal mode, **h j k l** move you left, down, up, right.\n\nThey sit right on the home row, so your hands never move.\nArrow keys work too, but hjkl is faster once it clicks.',
        demo: [
          { mode: 'NORMAL', text: 'name = "Alice"\nage = 30\ncity = "NYC"', cursor: [0, 0], description: 'Cursor at top left.' },
          { key: 'j', mode: 'NORMAL', text: 'name = "Alice"\nage = 30\ncity = "NYC"', cursor: [1, 0], description: 'j moves down one line.' },
          { key: 'l', mode: 'NORMAL', text: 'name = "Alice"\nage = 30\ncity = "NYC"', cursor: [1, 3], description: 'l moves right.' },
          { key: 'k', mode: 'NORMAL', text: 'name = "Alice"\nage = 30\ncity = "NYC"', cursor: [0, 3], description: 'k moves back up.' },
          { key: 'h', mode: 'NORMAL', text: 'name = "Alice"\nage = 30\ncity = "NYC"', cursor: [0, 0], description: 'h moves left.' },
        ],
        exercise: {
          initialText: `name = "Alice"
age = 30
city = "New York"
score = 95
active = True`,
          instructions: 'Navigate to "five" on the last line using j (down) and l (right). Do not use arrow keys.',
          hint: 'Press j to move down, l to move right.',
          goal: { type: 'cursor-reach', targets: [
            { target: [0, 7], idealKeystrokes: 7 },
            { target: [2, 7], idealKeystrokes: 2 },
            { target: [2, 0], idealKeystrokes: 7 },
            { target: [4, 0], idealKeystrokes: 2 },
            { target: [4, 7], idealKeystrokes: 7 },
            { target: [4, 9], idealKeystrokes: 2 },
            { target: [3, 9], idealKeystrokes: 1 },
            { target: [3, 0], idealKeystrokes: 9 },
          ] },
        },
      },
      {
        id: 'moving-by-words',
        title: 'Moving by Words',
        keys: ['w', 'e', 'b'],
        description:
          '**w**, **e**, and **b** move you through text word by word.\n\n**w** jumps to the start of the next word.\n**e** jumps to the end of the current word (…or the end of the next word if you\'re already at one).\n**b** jumps back one word.\nMuch faster than holding l to crawl through a line.',
        demo: [
          { mode: 'NORMAL', text: 'greeting = "Hello, World!"', cursor: [0, 0], description: 'Cursor on g of greeting.' },
          { key: 'w', mode: 'NORMAL', text: 'greeting = "Hello, World!"', cursor: [0, 9], description: 'w jumps to next word (=).' },
          { key: 'w', mode: 'NORMAL', text: 'greeting = "Hello, World!"', cursor: [0, 11], description: 'w again, jumps to "' },
          { key: 'e', mode: 'NORMAL', text: 'greeting = "Hello, World!"', cursor: [0, 16], description: 'e jumps to end of next word.' },
          { key: 'b', mode: 'NORMAL', text: 'greeting = "Hello, World!"', cursor: [0, 12], description: 'b jumps back one word.' },
        ],
        exercise: {
          initialText: `greeting = "Hello, World!"
count = 42
message = greeting + str(count)`,
          instructions: '1. Use w to jump forward word by word to reach "World".\n2. Use b to go back to "Hello".',
          hint: 'w moves forward one word at a time. b moves backward.',
          goal: { type: 'cursor-reach', targets: [
            { target: [0, 9], idealKeystrokes: 1 },
            { target: [0, 11], idealKeystrokes: 1 },
            { target: [0, 12], idealKeystrokes: 1 },
            { target: [0, 16], idealKeystrokes: 1 },
            { target: [0, 17], idealKeystrokes: 1 },
            { target: [0, 12], idealKeystrokes: 1 },
            { target: [0, 11], idealKeystrokes: 1 },
            { target: [0, 9], idealKeystrokes: 1 },
          ] },
        },
      },
      {
        id: 'insert-mode',
        title: 'Insert Mode',
        keys: ['i', 'a', 'esc'],
        description:
          '**i** and **a** both enter Insert mode, just from different positions.\n\n**i** inserts before the cursor.\n**a** inserts after the cursor.\n**Esc** always returns you to Normal mode.\nMost vim work follows the same loop: navigate in Normal, edit in Insert, Esc back.',
        demo: [
          { mode: 'NORMAL', text: 'name = ""\nrole = ""', cursor: [0, 7], description: 'Cursor inside the empty string.' },
          { key: 'i', mode: 'INSERT', text: 'name = ""\nrole = ""', cursor: [0, 7], description: 'i enters Insert mode before the cursor.' },
          { key: 'type', mode: 'INSERT', text: 'name = "Alice"\nrole = ""', cursor: [0, 12], description: 'Type the value.' },
          { key: 'Esc', mode: 'NORMAL', text: 'name = "Alice"\nrole = ""', cursor: [0, 11], description: 'Esc returns to Normal mode.' },
        ],
        exercise: {
          initialText: `print("Hello, !")
name = ""`,
          instructions: 'Use i or a to insert "World" after the comma on line 1, and your name on line 2.',
          hint: 'Move to the ! on line 1, press i, type "World", press Esc.',
          goal: { type: 'mode-sequence', sequence: ['INSERT', 'NORMAL'], reps: 2 },
        },
      },
    ],
  },
  {
    id: 'insert-like-a-pro',
    title: 'Insertion',
    lessons: [
      {
        id: 'insert-at-line-ends',
        title: 'Insert at Line Ends',
        keys: ['I', 'A', 'esc'],
        description:
          '**I** and **A** jump to specific positions on the line before entering Insert mode.\n\n**I** goes to the first non-blank character on the line.\n**A** goes to the end of the line.\nNo need to press Home or End manually.',
        demo: [
          { mode: 'NORMAL', text: 'def greet():\n    print("Hello")\n    return "done"', cursor: [1, 0], description: 'Cursor at start of line 2.' },
          { key: 'A', mode: 'INSERT', text: 'def greet():\n    print("Hello")\n    return "done"', cursor: [1, 18], description: 'A jumps to end of line, enters Insert mode.' },
          { key: 'type', mode: 'INSERT', text: 'def greet():\n    print("Hello")  # log\n    return "done"', cursor: [1, 24], description: 'Type at end of line.' },
          { key: 'Esc', mode: 'NORMAL', text: 'def greet():\n    print("Hello")  # log\n    return "done"', cursor: [1, 23], description: 'Back to Normal mode.' },
        ],
        exercise: {
          initialText: `def greet():
    print("Hello")
    return "done"`,
          instructions: 'Go to line 2. Use A to append a semicolon at the end of the console.log line.',
          hint: 'Move to line 2 with j, then press A and type ;',
          goal: { type: 'mode-sequence', sequence: ['INSERT', 'NORMAL'], reps: 2 },
        },
      },
      {
        id: 'opening-new-lines',
        title: 'Opening New Lines',
        keys: ['o', 'O'],
        description:
          '**o** and **O** open a new line and drop you straight into Insert mode.\n\n**o** opens a line below the current one.\n**O** opens a line above.\nNo need to go to the end of the line and press Enter.',
        demo: [
          { mode: 'NORMAL', text: 'x = 1\nz = 3', cursor: [0, 0], description: 'Two lines (line 2 is missing).' },
          { key: 'o', mode: 'INSERT', text: 'x = 1\n\nz = 3', cursor: [1, 0], description: 'o opens a new line below, enters Insert mode.' },
          { key: 'type', mode: 'INSERT', text: 'x = 1\ny = 2\nz = 3', cursor: [1, 5], description: 'Type the missing line.' },
          { key: 'Esc', mode: 'NORMAL', text: 'x = 1\ny = 2\nz = 3', cursor: [1, 4], description: 'Back to Normal mode.' },
        ],
        exercise: {
          initialText: `x = 1
z = 3`,
          instructions: '1. With your cursor on line 1 (x = 1), press o to open a new line below.\n2. Type y = 2.\n3. Press Esc.',
          hint: 'Press o on line 1, type y = 2, then Esc.',
          goal: { type: 'mode-sequence', sequence: ['INSERT', 'NORMAL'], reps: 3 },
        },
      },
      {
        id: 'making-small-edits',
        title: 'Making Small Edits',
        keys: ['s', 'x', 'r'],
        description:
          '**x**, **r**, and **s** handle quick single-character edits.\n\n**x** deletes the character under the cursor.\n**r** replaces it with the next key you press, staying in Normal mode.\n**s** deletes it and enters Insert mode.',
        demo: [
          { mode: 'NORMAL', text: 'primt("Hello")\nmesage = "World"', cursor: [0, 4], description: 'Cursor on the typo t in primt.' },
          { key: 'r', mode: 'NORMAL', text: 'primt("Hello")\nmesage = "World"', cursor: [0, 4], description: 'r waits for a replacement char.' },
          { key: 'n', mode: 'NORMAL', text: 'print("Hello")\nmesage = "World"', cursor: [0, 4], description: 'Typed n, fixed in place, still in Normal mode.' },
          { key: 'x', mode: 'NORMAL', text: 'print("Hello")\nmsage = "World"', cursor: [1, 1], description: 'x deletes the char under cursor.' },
        ],
        exercise: {
          initialText: `mesage = "Hellp, World!"
primt(mesage)`,
          instructions: 'Fix the typos:\n\n- "Hellp" → "Hello" (use r)\n- "mesage" → "message" (insert s with i or s)\n- "primt" → "print" (swap m for n with r)',
          hint: 'Move to p in "Hellp", press r then o. Between m and e in "mesage", press i then type s. On m in "primt", press r then n.',
          goal: { type: 'manual' },
        },
      },
    ],
  },
  {
    id: 'essential-motions',
    title: 'Motions',
    lessons: [
      {
        id: 'moving-by-words',
        title: 'Moving by WORDs',
        keys: ['W', 'E', 'B'],
        description:
          'Lowercase w/e/b stop at punctuation. Uppercase does not.\n\n**W**, **E**, **B** move by WORDs (only whitespace counts as a separator).\nUseful for jumping over things like `function.name()` as one unit.',
        demo: [
          { mode: 'NORMAL', text: 'url = "https://example.com"  # endpoint', cursor: [0, 7], description: 'Cursor on h of the URL.' },
          { key: 'w', mode: 'NORMAL', text: 'url = "https://example.com"  # endpoint', cursor: [0, 12], description: 'w stops at : (punctuation).' },
          { key: 'w', mode: 'NORMAL', text: 'url = "https://example.com"  # endpoint', cursor: [0, 15], description: 'w stops again at example.' },
          { key: 'W', mode: 'NORMAL', text: 'url = "https://example.com"  # endpoint', cursor: [0, 29], description: 'W skips the whole URL in one jump.' },
        ],
        exercise: {
          initialText: `url = "https://example.com/api/v1"
response = requests.get(url).json()`,
          instructions: 'Use W to jump over the full URL token "https://example.com/api/v1" in one move. Compare with w which stops at each punctuation.',
          hint: 'Position cursor at "https", press W to skip the whole WORD.',
          goal: { type: 'cursor-reach', targets: [
            { target: [0, 4], idealKeystrokes: 1 },
            { target: [0, 6], idealKeystrokes: 1 },
            { target: [1, 0], idealKeystrokes: 1 },
            { target: [1, 9], idealKeystrokes: 1 },
            { target: [1, 11], idealKeystrokes: 1 },
            { target: [1, 9], idealKeystrokes: 1 },
            { target: [1, 0], idealKeystrokes: 1 },
            { target: [0, 6], idealKeystrokes: 1 },
          ] },
        },
      },
      {
        id: 'moving-to-line-ends',
        title: 'Moving to Line Ends',
        keys: ['0', '_', '$'],
        description:
          'Three keys get you to different positions on the current line.\n\n**0** jumps to column 0, the very start of the line.\n**_** jumps to the first non-blank character.\n**$** jumps to the end of the line.',
        demo: [
          { mode: 'NORMAL', text: '    x = 10\n    y = 20', cursor: [0, 4], description: 'Cursor on x (first non-blank).' },
          { key: '$', mode: 'NORMAL', text: '    x = 10\n    y = 20', cursor: [0, 9], description: '$ jumps to end of line.' },
          { key: '0', mode: 'NORMAL', text: '    x = 10\n    y = 20', cursor: [0, 0], description: '0 jumps to column 0 (before the spaces).' },
          { key: '_', mode: 'NORMAL', text: '    x = 10\n    y = 20', cursor: [0, 4], description: '_ jumps to first non-blank char.' },
        ],
        exercise: {
          initialText: `    x = 10
    y = 20
    z = x + y`,
          instructions: 'On line 1:\n\n1. Press $ to go to the end.\n2. Press 0 to go to column 0.\n3. Press _ to jump back to x (the first non-blank character).',
          hint: '$ = end of line, 0 = column 0, _ = first non-blank char',
          goal: { type: 'cursor-reach', targets: [
            { target: [0, 9], idealKeystrokes: 1 },
            { target: [0, 4], idealKeystrokes: 1 },
            { target: [0, 0], idealKeystrokes: 1 },
            { target: [1, 9], idealKeystrokes: 2 },
            { target: [1, 4], idealKeystrokes: 1 },
            { target: [1, 0], idealKeystrokes: 1 },
            { target: [2, 12], idealKeystrokes: 2 },
            { target: [2, 4], idealKeystrokes: 1 },
          ] },
        },
      },
      {
        id: 'find-character',
        title: 'Find Character',
        keys: ['f', 'F', ';'],
        description:
          '**f** jumps to a character on the current line.\n\n**f{char}** moves forward to the next occurrence of that character.\n**F{char}** moves backward to the character, landing on it.\n**;** repeats the last search in the same direction.',
        demo: [
          { mode: 'NORMAL', text: 'def calc(price, tax, discount):', cursor: [0, 0], description: 'Cursor at start of line.' },
          { key: 'f,', mode: 'NORMAL', text: 'def calc(price, tax, discount):', cursor: [0, 14], description: 'f, jumps to the first comma.' },
          { key: ';', mode: 'NORMAL', text: 'def calc(price, tax, discount):', cursor: [0, 19], description: '; repeats, jumps to next comma.' },
          { key: 'F,', mode: 'NORMAL', text: 'def calc(price, tax, discount):', cursor: [0, 14], description: 'F, searches backward.' },
        ],
        exercise: {
          initialText: `def calculate_total(price, tax, discount):
    return price + tax - discount`,
          instructions: '1. On line 1, press f( to jump to the opening parenthesis.\n2. Press ; to jump to the next comma.',
          hint: 'f( jumps to (, then ; repeats to find the next match.',
          goal: { type: 'cursor-reach', targets: [
            { target: [0, 4], idealKeystrokes: 1 },
            { target: [0, 7], idealKeystrokes: 1 },
            { target: [0, 23], idealKeystrokes: 1 },
            { target: [0, 35], idealKeystrokes: 1 },
            { target: [0, 23], idealKeystrokes: 1 },
            { target: [0, 7], idealKeystrokes: 1 },
            { target: [0, 4], idealKeystrokes: 1 },
            { target: [0, 25], idealKeystrokes: 1 },
          ] },
        },
      },
      {
        id: 'till-character',
        title: 'Till Character',
        keys: ['t', 'T', ';'],
        description:
          '**t** is like **f**, but stops one character short.\n\n**t{char}** moves the cursor just before the target character.\n**T{char}** does the same thing backward, stopping one character to the right of the target.\nOften more useful than f when you want to land right before something.',
        demo: [
          { mode: 'NORMAL', text: 'result = do_something(value, callback)', cursor: [0, 0], description: 'Cursor at start.' },
          { key: 'f)', mode: 'NORMAL', text: 'result = do_something(value, callback)', cursor: [0, 37], description: 'f) lands ON the ).' },
          { key: 'b', mode: 'NORMAL', text: 'result = do_something(value, callback)', cursor: [0, 29], description: 'b back to callback.' },
          { key: 't)', mode: 'NORMAL', text: 'result = do_something(value, callback)', cursor: [0, 36], description: 't) stops one char BEFORE ).' },
        ],
        exercise: {
          initialText: `result = do_something(value, callback)`,
          instructions: 'Use t) to move just before the closing parenthesis. Notice the cursor stops one character before ) unlike f).',
          hint: 't) stops before the ), f) stops on the ).',
          goal: { type: 'cursor-reach', targets: [
            { target: [0, 20], idealKeystrokes: 1 },
            { target: [0, 26], idealKeystrokes: 1 },
            { target: [0, 36], idealKeystrokes: 1 },
            { target: [0, 28], idealKeystrokes: 1 },
            { target: [0, 22], idealKeystrokes: 1 },
            { target: [0, 26], idealKeystrokes: 1 },
            { target: [0, 36], idealKeystrokes: 1 },
            { target: [0, 8], idealKeystrokes: 1 },
          ] },
        },
      },
    ],
  },
  {
    id: 'basic-operators',
    title: 'Deleting and Changing',
    lessons: [
      {
        id: 'intro-to-operators',
        title: 'Intro to Operators',
        keys: ['operators'],
        description:
          'Operators combine with motions to act on text.\n\n**d** deletes, **c** changes, **y** yanks (copies).\nThe pattern is always: operator + motion.\n`dw` deletes a word, `d$` deletes to end of line. That\'s the grammar of Vim.',
        demo: [
          { mode: 'NORMAL', text: 'delete this word now\nchange this value\nyank this line', cursor: [0, 7], description: 'Cursor on "this".' },
          { key: 'dw', mode: 'NORMAL', text: 'delete word now\nchange this value\nyank this line', cursor: [0, 7], description: 'd + w = delete word.' },
          { key: 'cw', mode: 'INSERT', text: 'delete word now\nchange  value\nyank this line', cursor: [1, 7], description: 'c + w = change word (enters Insert mode).' },
          { key: 'yy', mode: 'NORMAL', text: 'delete word now\nchange  value\nyank this line', cursor: [2, 0], description: 'yy = yank (copy) the whole line.' },
        ],
        exercise: {
          initialText: `delete this entire word please
change this word too
yank this line`,
          instructions: 'Read this lesson. The next lessons will practice each operator. For now, try dw on "entire" to delete it.',
          hint: 'Move to "entire", press dw to delete the word.',
          goal: { type: 'manual' },
        },
      },
      {
        id: 'delete-words',
        title: 'Delete Words',
        keys: ['d', 'w'],
        description:
          '**dw** and friends delete by motion.\n\n**dw** deletes from the cursor to the start of the next word (including trailing whitespace).\n**de** deletes to the end of the current word.\n**dW** deletes the whole WORD.\nPrefix with a count: **3dw** deletes 3 words at once.\n\nTip: **dw** from mid-word only deletes to the end of that word. Use **diw** when you want the whole word no matter where the cursor sits.',
        demo: [
          { mode: 'NORMAL', text: 'name = extra_value\nage = 30', cursor: [0, 7], description: 'Cursor on extra_value.' },
          { key: 'dw', mode: 'NORMAL', text: 'name = value\nage = 30', cursor: [0, 7], description: 'dw deletes to start of next word.' },
          { key: 'de', mode: 'NORMAL', text: 'name = \nage = 30', cursor: [0, 7], description: 'de deletes to end of word.' },
        ],
        exercise: {
          initialText: `Remove the extra extra word from this line.
Also delete these three unnecessary filler words here.`,
          instructions: 'On line 1, delete the duplicate "extra" using dw.\n\nOn line 2, delete "unnecessary filler words" (try 3dw or d3w).',
          hint: 'Position on first "extra", press dw. Then find "unnecessary", press 3dw.',
          goal: { type: 'manual' },
        },
      },
      {
        id: 'change-words',
        title: 'Change Words',
        keys: ['c', 'w'],
        description:
          '**cw** is like **dw** but drops you into Insert mode after.\n\n**cw** deletes the word and enters Insert mode so you can type a replacement.\n**ce** changes to the end of the word.\n**cW** changes the whole WORD.\n\nQuirk: **cw** behaves like **ce**: it stops at the end of the word, not at the start of the next one, so it doesn\'t eat the trailing space.',
        demo: [
          { mode: 'NORMAL', text: 'foo = "bar"\nbaz = 100', cursor: [0, 0], description: 'Cursor on foo.' },
          { key: 'cw', mode: 'INSERT', text: ' = "bar"\nbaz = 100', cursor: [0, 0], description: 'cw deletes word, enters Insert mode.' },
          { key: 'type', mode: 'INSERT', text: 'message = "bar"\nbaz = 100', cursor: [0, 7], description: 'Type the replacement.' },
          { key: 'Esc', mode: 'NORMAL', text: 'message = "bar"\nbaz = 100', cursor: [0, 6], description: 'Done. Back to Normal mode.' },
        ],
        exercise: {
          initialText: `foo = "bar"
baz = 100`,
          instructions: 'Change "foo" to "message" using cw.\n\nChange "baz" to "count" using cw.',
          hint: 'Move to "foo", press cw, type "message", Esc. Repeat for "baz".',
          goal: { type: 'manual' },
        },
      },
      {
        id: 'delete-lines',
        title: 'Delete Lines',
        keys: ['d', 'd', 'D'],
        description:
          '**dd** deletes the entire current line.\n\n**D** deletes from the cursor to the end of the line.\nDeleted lines go into a register and can be pasted back with **p**.',
        demo: [
          { mode: 'NORMAL', text: 'name = "Alice"\n# DELETE THIS LINE\nage = 30', cursor: [1, 0], description: 'Cursor on the line to delete.' },
          { key: 'dd', mode: 'NORMAL', text: 'name = "Alice"\nage = 30', cursor: [1, 0], description: 'dd deletes the entire line.' },
          { key: 'D', mode: 'NORMAL', text: 'name = "Alice"\nage =', cursor: [1, 4], description: 'D deletes from cursor to end of line.' },
        ],
        exercise: {
          initialText: `name = "Alice"
# DELETE THIS LINE
age = 30
# DELETE THIS ONE AS WELL
active = True`,
          instructions: 'Delete the two lines that say "DELETE" using dd. The other lines should remain.',
          hint: 'Move to "DELETE THIS LINE", press dd. Move to the next DELETE line, press dd.',
          goal: { type: 'manual' },
        },
      },
      {
        id: 'delete-multiple-lines',
        title: 'Delete Multiple Lines',
        keys: ['d', 'j', 'k'],
        description:
          'You can delete multiple lines at once with a count or motion.\n\n**dj** deletes the current line and the one below.\n**dk** deletes the current line and the one above.\n**3dd** deletes 3 lines. **d2j** deletes the current line and 2 below.',
        demo: [
          { mode: 'NORMAL', text: 'x = 1\ny = 2\nz = 3\nw = 4\ntotal = x', cursor: [1, 0], description: 'Cursor on line 2 (y = 2).' },
          { key: 'd2j', mode: 'NORMAL', text: 'x = 1\ntotal = x', cursor: [1, 0], description: 'd2j deletes current + 2 lines below.' },
        ],
        exercise: {
          initialText: `x = 1          # keep
y = 2          # delete
z = 3          # delete
w = 4          # delete
total = x + w  # keep`,
          instructions: 'Delete lines 2, 3, and 4 in one command. Position on line 2 and use d2j (or 3dd).',
          hint: 'Move to "Line 2", press d2j to delete it and 2 lines below.',
          goal: { type: 'manual' },
        },
      },
      {
        id: 'copy-paste-lines',
        title: 'Copy/Paste Lines',
        keys: ['y', 'p', 'P'],
        description:
          '**yy** copies the current line. **p** and **P** paste it.\n\n**yy** yanks the full line.\n**p** pastes below the current line.\n**P** pastes above.',
        demo: [
          { mode: 'NORMAL', text: 'PI = 3.14159\n# paste below', cursor: [0, 0], description: 'Cursor on line to copy.' },
          { key: 'yy', mode: 'NORMAL', text: 'PI = 3.14159\n# paste below', cursor: [0, 0], description: 'yy yanks the line into register.' },
          { key: 'j', mode: 'NORMAL', text: 'PI = 3.14159\n# paste below', cursor: [1, 0], description: 'Move to target line.' },
          { key: 'p', mode: 'NORMAL', text: 'PI = 3.14159\n# paste below\nPI = 3.14159', cursor: [2, 0], description: 'p pastes below.' },
        ],
        exercise: {
          initialText: `PI = 3.14159
# paste the PI line below here

# paste it above this comment`,
          instructions: '1. Yank the PI line with yy.\n2. Paste it below the first comment with p.\n3. Paste it above the second comment with P.',
          hint: 'Move to the PI line, press yy, move to comment line, press p for below or P for above.',
          goal: { type: 'manual' },
        },
      },
    ],
  },
  {
    id: 'advanced-vertical-movement',
    title: 'Line Navigation',
    lessons: [
      {
        id: 'relative-line-jumps',
        title: 'Relative Line Jumps',
        keys: ['{n}', 'j', 'k'],
        description:
          'Prefix j or k with a number to jump multiple lines at once.\n\n**5j** moves down 5 lines, **3k** moves up 3 lines.\nIf your editor shows relative line numbers (a common Vim setting), you can see exactly how far each line is at a glance.',
        demo: [
          { mode: 'NORMAL', text: 'name = "Alice"\nage = 30\ncity = "NYC"\nscore = 95\nactive = True\nlang = "Python"', cursor: [0, 0], description: 'Cursor on line 1.' },
          { key: '4j', mode: 'NORMAL', text: 'name = "Alice"\nage = 30\ncity = "NYC"\nscore = 95\nactive = True\nlang = "Python"', cursor: [4, 0], description: '4j jumps 4 lines down.' },
          { key: '2k', mode: 'NORMAL', text: 'name = "Alice"\nage = 30\ncity = "NYC"\nscore = 95\nactive = True\nlang = "Python"', cursor: [2, 0], description: '2k jumps 2 lines up.' },
        ],
        exercise: {
          initialText: `name = "Alice"
age = 30
score = 95
active = True
city = "NYC"
country = "USA"
language = "Python"
version = 3
debug = False
verbose = True`,
          instructions: '1. From line 1, jump to line 7 with 6j.\n2. Then jump back to line 3 with 4k.',
          hint: '6j jumps 6 lines down, 4k jumps 4 lines up.',
          goal: { type: 'cursor-reach', targets: [
            { target: [6, 0], idealKeystrokes: 2 },
            { target: [3, 0], idealKeystrokes: 2 },
            { target: [8, 0], idealKeystrokes: 2 },
            { target: [5, 0], idealKeystrokes: 2 },
            { target: [9, 0], idealKeystrokes: 2 },
            { target: [4, 0], idealKeystrokes: 2 },
            { target: [7, 0], idealKeystrokes: 2 },
            { target: [2, 0], idealKeystrokes: 2 },
          ] },
        },
      },
      {
        id: 'absolute-line-jumps',
        title: 'Absolute Line Jumps',
        keys: ['g', 'g', 'G'],
        description:
          '**gg** and **G** jump to the top and bottom of the file.\n\n**gg** goes to line 1.\n**G** goes to the last line.\n**{n}G** jumps directly to line n.',
        demo: [
          { mode: 'NORMAL', text: 'import os\nimport sys\n\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()', cursor: [3, 0], description: 'Cursor somewhere in the middle.' },
          { key: 'gg', mode: 'NORMAL', text: 'import os\nimport sys\n\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()', cursor: [0, 0], description: 'gg jumps to line 1.' },
          { key: 'G', mode: 'NORMAL', text: 'import os\nimport sys\n\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()', cursor: [7, 0], description: 'G jumps to last line.' },
          { key: '4G', mode: 'NORMAL', text: 'import os\nimport sys\n\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()', cursor: [3, 0], description: '4G jumps to line 4.' },
        ],
        exercise: {
          initialText: `import os          # top of file
import sys
import json
from pathlib import Path
from typing import List
import requests
import logging
from datetime import datetime
import argparse
import subprocess  # bottom of file`,
          instructions: '1. Press G to jump to the last line.\n2. Press gg to return to the top.\n3. Press 5G to jump to line 5.',
          hint: 'G = last line, gg = first line, 5G = line 5.',
          goal: { type: 'cursor-reach', targets: [
            { target: [9, 0], idealKeystrokes: 1 },
            { target: [0, 0], idealKeystrokes: 2 },
            { target: [4, 0], idealKeystrokes: 2 },
            { target: [9, 0], idealKeystrokes: 1 },
            { target: [2, 0], idealKeystrokes: 2 },
            { target: [0, 0], idealKeystrokes: 2 },
            { target: [6, 0], idealKeystrokes: 2 },
            { target: [9, 0], idealKeystrokes: 1 },
          ] },
        },
      },
      {
        id: 'paragraph-jumps',
        title: 'Paragraph Jumps',
        keys: ['}', '{'],
        description:
          '**}** and **{** jump between blank lines.\n\n**}** moves to the next blank line.\n**{** moves to the previous blank line.\nUseful for quickly jumping between code blocks or sections.',
        demo: [
          { mode: 'NORMAL', text: 'def setup():\n    config = load()\n\ndef main():\n    run()\n\ndef teardown():\n    cleanup()', cursor: [0, 0], description: 'Cursor at top of first function.' },
          { key: '}', mode: 'NORMAL', text: 'def setup():\n    config = load()\n\ndef main():\n    run()\n\ndef teardown():\n    cleanup()', cursor: [2, 0], description: '} jumps to next blank line.' },
          { key: '}', mode: 'NORMAL', text: 'def setup():\n    config = load()\n\ndef main():\n    run()\n\ndef teardown():\n    cleanup()', cursor: [5, 0], description: '} again, next blank line.' },
          { key: '{', mode: 'NORMAL', text: 'def setup():\n    config = load()\n\ndef main():\n    run()\n\ndef teardown():\n    cleanup()', cursor: [2, 0], description: '{ jumps back up.' },
        ],
        exercise: {
          initialText: `def setup():
    config = load_config()
    return config

def process(data):
    result = transform(data)
    return result

def teardown():
    cleanup()`,
          instructions: 'Press } to jump between paragraphs (blank lines).\n\nPress { to go back up.',
          hint: '} moves to next blank line, { moves to previous blank line.',
          goal: { type: 'cursor-reach', targets: [
            { target: [3, 0], idealKeystrokes: 1 },
            { target: [7, 0], idealKeystrokes: 1 },
            { target: [3, 0], idealKeystrokes: 1 },
            { target: [0, 0], idealKeystrokes: 1 },
            { target: [3, 0], idealKeystrokes: 1 },
            { target: [7, 0], idealKeystrokes: 1 },
            { target: [3, 0], idealKeystrokes: 1 },
            { target: [0, 0], idealKeystrokes: 1 },
          ] },
        },
      },
      {
        id: 'window-scrolls',
        title: 'Window Scrolls',
        keys: ['Ctrl+u', 'Ctrl+d'],
        description:
          '**Ctrl+d** and **Ctrl+u** scroll the viewport half a screen at a time.\n\n**Ctrl+d** scrolls down.\n**Ctrl+u** scrolls up.\nThe cursor moves with it. Much faster than holding j or k on long files.',
        demo: [
          { mode: 'NORMAL', text: 'x_1 = 7\nx_2 = 14\nx_3 = 21\nx_4 = 28\n# ... 40 lines total', cursor: [0, 0], description: '40-line file. Cursor at top.' },
          { key: 'Ctrl+d', mode: 'NORMAL', text: 'x_20 = 140\nx_21 = 147\nx_22 = 154\nx_23 = 161\n# ... continues', cursor: [0, 0], description: 'Ctrl+d scrolls half a screen down.' },
          { key: 'Ctrl+u', mode: 'NORMAL', text: 'x_1 = 7\nx_2 = 14\nx_3 = 21\nx_4 = 28\n# ... 40 lines total', cursor: [0, 0], description: 'Ctrl+u scrolls back up.' },
        ],
        exercise: {
          initialText: Array.from({ length: 40 }, (_, i) => `x_${i + 1} = ${(i + 1) * 7}  # variable ${i + 1}`).join('\n'),
          instructions: 'Press Ctrl+d to scroll down half a page. Press Ctrl+u to scroll back up.',
          hint: 'Hold Ctrl and press d to scroll down, u to scroll up.',
          goal: { type: 'manual' },
        },
      },
    ],
  },
  {
    id: 'search',
    title: 'Searching',
    lessons: [
      {
        id: 'search',
        title: 'Search',
        keys: ['/', '?'],
        description:
          '**/** searches forward, **?** searches backward.\n\n**/pattern** jumps to the next match below the cursor.\n**?pattern** jumps to the next match above.\nPress Enter to confirm and land on the first result.',
        demo: [
          { mode: 'NORMAL', text: 'def greet(name):\n    message = "Hello"\n    print(message)\n    return message', cursor: [0, 0], description: 'Cursor at top.' },
          { key: '/message', mode: 'NORMAL', text: 'def greet(name):\n    message = "Hello"\n    print(message)\n    return message', cursor: [1, 4], description: '/message jumps to first match.' },
          { key: 'n', mode: 'NORMAL', text: 'def greet(name):\n    message = "Hello"\n    print(message)\n    return message', cursor: [2, 10], description: 'n jumps to next match.' },
          { key: 'n', mode: 'NORMAL', text: 'def greet(name):\n    message = "Hello"\n    print(message)\n    return message', cursor: [3, 11], description: 'n again, next match.' },
        ],
        exercise: {
          initialText: `def greet(name):
    message = "Hello, " + name
    print(message)
    return message`,
          instructions: 'Press / then type "message" and press Enter to search for it. Watch the cursor jump to the first match.',
          hint: 'Type /message then Enter.',
          goal: { type: 'manual' },
        },
      },
      {
        id: 'repeat-search',
        title: 'Repeat Search',
        keys: ['n', 'N'],
        description:
          'After a search, **n** and **N** cycle through every match.\n\n**n** repeats the search in the same direction (forward after /, backward after ?).\n**N** repeats in the opposite direction.\nUse them to step through all occurrences in the file.',
        exercise: {
          initialText: `count = 1
total = count + count
print(count, total)
return count`,
          instructions: '1. Search for "count" with /count Enter.\n2. Press n to jump to each occurrence.\n3. Press N to go backward.',
          hint: 'After /count Enter, press n repeatedly to cycle through matches.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'count = 1\ntotal = count + count\nprint(count, total)\nreturn count', cursor: [0, 0], description: 'count appears 4 times in this file.' },
          { key: '/count', mode: 'NORMAL', text: 'count = 1\ntotal = count + count\nprint(count, total)\nreturn count', cursor: [0, 0], description: '/count Enter: first match highlighted.' },
          { key: 'n', mode: 'NORMAL', text: 'count = 1\ntotal = count + count\nprint(count, total)\nreturn count', cursor: [1, 8], description: 'n jumps to next match.' },
          { key: 'n', mode: 'NORMAL', text: 'count = 1\ntotal = count + count\nprint(count, total)\nreturn count', cursor: [1, 16], description: 'n again, third occurrence.' },
          { key: 'N', mode: 'NORMAL', text: 'count = 1\ntotal = count + count\nprint(count, total)\nreturn count', cursor: [1, 8], description: 'N goes backward to previous match.' },
        ],
      },
      {
        id: 'quick-word-search',
        title: 'Quick Word Search',
        keys: ['*', '#'],
        description:
          '**\\*** and **#** search for the word under the cursor without typing anything.\n\n**\\*** searches forward for the current word.\n**#** searches backward.\nJust position your cursor on the word and press.\n\nNote: **\\*** matches whole words only (searching on `user` won\'t find `users`). Use **g\\*** if you want a substring match.',
        exercise: {
          initialText: `user = get_user(id)
if user:
    update_user(user)
    print(user.name)`,
          instructions: '1. Place your cursor on the word "user" and press * to find all occurrences.\n2. Press n to jump between them.',
          hint: 'Move to "user", press *, then n to cycle through.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'user = get_user(id)\nif user:\n    update_user(user)\n    print(user.name)', cursor: [0, 0], description: 'Cursor is on "user".' },
          { key: '*', mode: 'NORMAL', text: 'user = get_user(id)\nif user:\n    update_user(user)\n    print(user.name)', cursor: [1, 3], description: '* jumps to next occurrence of "user".' },
          { key: 'n', mode: 'NORMAL', text: 'user = get_user(id)\nif user:\n    update_user(user)\n    print(user.name)', cursor: [2, 15], description: 'n continues to next match.' },
          { key: '#', mode: 'NORMAL', text: 'user = get_user(id)\nif user:\n    update_user(user)\n    print(user.name)', cursor: [1, 3], description: '# goes backward.' },
        ],
      },
      {
        id: 'search-review',
        title: 'Search Review',
        keys: ['Review'],
        description:
          'A quick recap of all search commands.\n\n**/pattern** searches forward, **?pattern** searches backward.\n**n** goes to the next match, **N** goes to the previous.\n**\\*** searches the word under cursor forward, **#** backward.',
        exercise: {
          initialText: `def process_data(data):
    result = transform(data)
    error = validate(result)
    if error:
        handle_error(error)
    return result`,
          instructions: '1. Search for "error", jump through all matches with n.\n2. Use * on "result" to quickly find all its occurrences.',
          hint: '/error Enter, then n to cycle. Move to "result", press *.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'def process_data(data):\n    result = transform(data)\n    error = validate(result)\n    if error:\n        handle_error(error)\n    return result', cursor: [0, 0], description: 'Starting at the top.' },
          { key: '/error', mode: 'NORMAL', text: 'def process_data(data):\n    result = transform(data)\n    error = validate(result)\n    if error:\n        handle_error(error)\n    return result', cursor: [2, 4], description: '/error finds first match.' },
          { key: 'n', mode: 'NORMAL', text: 'def process_data(data):\n    result = transform(data)\n    error = validate(result)\n    if error:\n        handle_error(error)\n    return result', cursor: [3, 7], description: 'n to next match.' },
          { key: '*', mode: 'NORMAL', text: 'def process_data(data):\n    result = transform(data)\n    error = validate(result)\n    if error:\n        handle_error(error)\n    return result', cursor: [1, 4], description: '* on "result" finds all occurrences.' },
        ],
      },
    ],
  },
  {
    id: 'text-objects-brackets',
    title: 'Brackets',
    lessons: [
      {
        id: 'intro-to-text-objects',
        title: 'Intro to Text Objects',
        keys: ['text objects'],
        description:
          'Text objects let you select structured chunks of text.\n\nThey work with operators: **d**, **c**, **y** + text object.\n**i** means "inside" (without the delimiters).\n**a** means "around" (including the delimiters).',
        exercise: {
          initialText: `config = {"name": "Alice", "age": 30}
print(config)`,
          instructions: 'Read this introduction. In the next lessons you\'ll practice di{, da{, ci{, ca{. For now, try positioning inside the { } on line 1.',
          hint: 'Move your cursor anywhere inside the { } on line 1.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'config = {"name": "Alice", "age": 30}', cursor: [0, 10], description: 'Cursor inside the { } block.' },
          { key: 'di{', mode: 'NORMAL', text: 'config = {}', cursor: [0, 9], description: 'di{ deletes inside, braces stay.' },
          { key: 'u', mode: 'NORMAL', text: 'config = {"name": "Alice", "age": 30}', cursor: [0, 10], description: 'u undoes. Try da{ instead.' },
          { key: 'da{', mode: 'NORMAL', text: 'config = ', cursor: [0, 8], description: 'da{ removes braces and everything inside.' },
        ],
      },
      {
        id: 'delete-inside-brackets',
        title: 'Delete Inside Brackets',
        keys: ['d', 'i', '{'],
        description:
          '**di{** deletes everything inside curly braces, leaving the braces intact.\n\nAlso works with: **di(**, **di[**, **di<**.\nYour cursor just needs to be anywhere inside the block.',
        exercise: {
          initialText: `config = {
    "theme": "dark",
    "language": "en",
    "debug": True,
}`,
          instructions: 'Place your cursor anywhere inside the function body and press di{ to delete everything between the braces.',
          hint: 'Move inside the {}, press di{ to delete contents but keep the braces.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'config = {\n    "theme": "dark",\n    "language": "en",\n    "debug": True,\n}', cursor: [1, 4], description: 'Cursor anywhere inside { }.' },
          { key: 'di{', mode: 'NORMAL', text: 'config = {\n}', cursor: [0, 9], description: 'di{ deletes contents, braces remain.' },
        ],
      },
      {
        id: 'delete-around-brackets',
        title: 'Delete Around Brackets',
        keys: ['d', 'a', '{'],
        description:
          '**da{** deletes everything including the braces.\n\nUnlike **di{**, the delimiters are removed too.\n**da(** and **da[** work the same way for their bracket types.',
        exercise: {
          initialText: `settings = {
    "host": "localhost",
    "port": 8080,
}`,
          instructions: 'Place cursor inside the {} block and press da{ to delete the braces and their contents.',
          hint: 'Move inside {}, press da{: it removes { ... } entirely.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'settings = {\n    "host": "localhost",\n    "port": 8080,\n}', cursor: [1, 4], description: 'Cursor anywhere inside { }.' },
          { key: 'da{', mode: 'NORMAL', text: 'settings = ', cursor: [0, 10], description: 'da{ removes braces and all content.' },
        ],
      },
      {
        id: 'change-inside-brackets',
        title: 'Change Inside Brackets',
        keys: ['c', 'i', '{'],
        description:
          '**ci{** clears everything inside the braces and enters Insert mode.\n\nPerfect for replacing the body of a function.\nYour cursor can be anywhere inside the block.',
        exercise: {
          initialText: `user = {
    "name": "old name",
    "role": "guest",
}`,
          instructions: 'Position inside the function body and press ci{ to clear it and enter Insert mode. Type a new body.',
          hint: 'Move inside {}, press ci{, type new content, press Esc.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'user = {\n    "name": "old name",\n    "role": "guest",\n}', cursor: [1, 4], description: 'Cursor inside { }.' },
          { key: 'ci{', mode: 'INSERT', text: 'user = {\n}', cursor: [0, 9], description: 'ci{ clears inside and enters Insert.' },
          { key: 'Esc', mode: 'NORMAL', text: 'user = {\n    "name": "Alice",\n    "role": "admin",\n}', cursor: [1, 0], description: 'Typed new content, Esc to finish.' },
        ],
      },
      {
        id: 'change-around-brackets',
        title: 'Change Around Brackets',
        keys: ['c', 'a', '{'],
        description:
          '**ca{** removes the braces and their contents, then enters Insert mode.\n\nUseful when you want to replace a bracketed expression entirely, delimiters and all.',
        exercise: {
          initialText: `result = calculate({"x": 1, "y": 2})`,
          instructions: 'Place cursor inside { x: 1, y: 2 } and press ca{ to delete the braces and content, then type { x: 5, y: 10 }.',
          hint: 'Move inside {}, press ca{, type new object literal, Esc.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'result = calculate({"x": 1, "y": 2})', cursor: [0, 20], description: 'Cursor inside { }.' },
          { key: 'ca{', mode: 'INSERT', text: 'result = calculate()', cursor: [0, 19], description: 'ca{ removes { } and content, Insert mode.' },
          { key: 'Esc', mode: 'NORMAL', text: 'result = calculate({"x": 5, "y": 10})', cursor: [0, 19], description: 'Typed new object, pressed Esc.' },
        ],
      },
      {
        id: 'brackets-review',
        title: 'Brackets Review',
        keys: ['Review'],
        description:
          'A recap of all bracket text objects.\n\n**di{** deletes inside, **da{** deletes around.\n**ci{** changes inside, **ca{** changes around.\nAll of these work with any bracket pair: `()`, `[]`, `{}`, `<>`.',
        exercise: {
          initialText: `def process(input):
    data = transform([1, 2, 3])
    return {"result": data, "status": "ok"}`,
          instructions: 'Try:\n\n- di( on the function params\n- di[ on the array\n- di{ on the return object\n\nSee the difference between each.',
          hint: 'Move inside (), press di(. Move inside [], press di[. Move inside {}, press di{.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'def process(input):\n    data = transform([1, 2, 3])\n    return {"result": data}', cursor: [0, 12], description: 'Cursor inside ( ) params.' },
          { key: 'di(', mode: 'NORMAL', text: 'def process():\n    data = transform([1, 2, 3])\n    return {"result": data}', cursor: [0, 12], description: 'di( deletes inside the parentheses.' },
          { key: 'u', mode: 'NORMAL', text: 'def process(input):\n    data = transform([1, 2, 3])\n    return {"result": data}', cursor: [1, 20], description: 'Undo. Now di[ on the array.' },
          { key: 'di[', mode: 'NORMAL', text: 'def process(input):\n    data = transform([])\n    return {"result": data}', cursor: [1, 20], description: 'di[ empties the list: brackets stay.' },
        ],
      },
    ],
  },
  {
    id: 'text-objects-quotes',
    title: 'Quotes',
    lessons: [
      {
        id: 'delete-inside-quotes',
        title: 'Delete Inside Quotes',
        keys: ['d', 'i', '"'],
        description:
          '**di"** deletes everything inside double quotes.\n\n**di\'** works for single quotes, **di\`** for backticks.\nThe cursor just needs to be anywhere on the same line as the quotes.\n\nWhen there are multiple quote pairs on the line, vim picks the next pair to the right of (or containing) the cursor.',
        exercise: {
          initialText: `greeting = "Hello, World!"
name = 'Alice'`,
          instructions: 'Place cursor anywhere on line 1 and press di" to delete the string contents (keep the quotes).\n\nThen di\' on line 2.',
          hint: 'di" removes content between " ". di\' removes content between \' \'.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'greeting = "Hello, World!"\nname = \'Alice\'', cursor: [0, 12], description: 'Cursor anywhere on line 1.' },
          { key: 'di"', mode: 'NORMAL', text: 'greeting = ""\nname = \'Alice\'', cursor: [0, 12], description: 'di" deletes inside quotes, keeps " ".' },
          { key: "di'", mode: 'NORMAL', text: 'greeting = ""\nname = \'\'', cursor: [1, 7], description: "di' deletes inside single quotes." },
        ],
      },
      {
        id: 'delete-around-quotes',
        title: 'Delete Around Quotes',
        keys: ['d', 'a', '"'],
        description:
          '**da"** deletes the content and the quote characters themselves.\n\nUse this when you want to remove the entire string literal, quotes and all.',
        exercise: {
          initialText: `print("debug message")
url = "https://example.com"`,
          instructions: 'Press da" on line 1 to delete the entire "debug message" string including quotes.',
          hint: 'Move to line 1, press da" to remove "debug message" (with quotes).',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'print("debug message")\nurl = "https://example.com"', cursor: [0, 7], description: 'Cursor inside "debug message".' },
          { key: 'da"', mode: 'NORMAL', text: 'print()\nurl = "https://example.com"', cursor: [0, 6], description: 'da" removes the whole string with quotes.' },
        ],
      },
      {
        id: 'change-inside-quotes',
        title: 'Change Inside Quotes',
        keys: ['c', 'i', '"'],
        description:
          '**ci"** is one of the most used vim commands.\n\nIt clears the string contents and drops you into Insert mode inside the quotes.\nReady to type a new value without touching anything around it.',
        exercise: {
          initialText: `title = "Old Title"
author = "Unknown"`,
          instructions: 'Use ci" on line 1 to change "Old Title" to "New Title".\n\nUse ci" on line 2 to change "Unknown" to your name.',
          hint: 'Move to line 1, press ci", type new string, Esc.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'title = "Old Title"\nauthor = "Unknown"', cursor: [0, 9], description: 'Cursor inside "Old Title".' },
          { key: 'ci"', mode: 'INSERT', text: 'title = ""\nauthor = "Unknown"', cursor: [0, 9], description: 'ci" clears the string, enters Insert.' },
          { key: 'Esc', mode: 'NORMAL', text: 'title = "New Title"\nauthor = "Unknown"', cursor: [0, 9], description: 'Typed "New Title", pressed Esc.' },
        ],
      },
      {
        id: 'change-around-quotes',
        title: 'Change Around Quotes',
        keys: ['c', 'a', '"'],
        description:
          '**ca"** removes the entire string including the quotes, then enters Insert mode.\n\nUse this when you want to replace the whole string literal, or swap it for a different quote type.',
        exercise: {
          initialText: `value = "replace me entirely"`,
          instructions: 'Press ca" to delete the whole "replace me entirely" (with quotes) and type a new value like 42 (no quotes needed).',
          hint: 'Press ca", type 42 or any replacement, press Esc.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'value = "replace me entirely"', cursor: [0, 9], description: 'Cursor inside the string.' },
          { key: 'ca"', mode: 'INSERT', text: 'value = ', cursor: [0, 8], description: 'ca" removes the string and quotes, Insert mode.' },
          { key: 'Esc', mode: 'NORMAL', text: 'value = 42', cursor: [0, 8], description: 'Typed 42 (no quotes needed), Esc.' },
        ],
      },
      {
        id: 'quotes-review',
        title: 'Quotes Review',
        keys: ['Review'],
        description:
          'A recap of all quote text objects.\n\n**di"** deletes inside, **da"** deletes around.\n**ci"** changes inside, **ca"** changes around.\nAll of these work with `"`, `\'`, and `` ` ``.',
        exercise: {
          initialText: `data = {
    "name": "Alice",
    "greeting": 'Hello',
    "city": "New York",
}`,
          instructions: 'Practice:\n\n- ci" on the "Alice" string\n- ci\' on the \'Hello\' string\n- ci" again on "New York"\n\nChange each value.',
          hint: 'Move into each string, press ci followed by the matching quote character, type a new value, Esc.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'data = {\n    "name": "Alice",\n    "greeting": \'Hello\',\n}', cursor: [1, 12], description: 'Cursor on "Alice" (double quotes).' },
          { key: 'ci"', mode: 'INSERT', text: 'data = {\n    "name": "",\n    "greeting": \'Hello\',\n}', cursor: [1, 12], description: 'ci" clears inside double quotes.' },
          { key: 'Esc', mode: 'NORMAL', text: 'data = {\n    "name": "Bob",\n    "greeting": \'Hello\',\n}', cursor: [1, 12], description: 'Typed "Bob", Esc. Now ci\' on greeting.' },
          { key: "ci'", mode: 'INSERT', text: 'data = {\n    "name": "Bob",\n    "greeting": \'\',\n}', cursor: [2, 16], description: "ci' clears inside single quotes." },
        ],
      },
    ],
  },
  {
    id: 'text-objects-words',
    title: 'Words',
    lessons: [
      {
        id: 'delete-inside-word',
        title: 'Delete Inside Word',
        keys: ['d', 'i', 'w'],
        description:
          '**diw** deletes the word under the cursor.\n\nThe surrounding whitespace stays intact.\nYour cursor can be anywhere in the word.\n\n**diW** uses the WORD definition from §3 (punctuation is part of the word).',
        exercise: {
          initialText: `Remove the badword from this sentence.
This has an unwanted word in it.`,
          instructions: 'Move your cursor anywhere on "badword" and press diw to delete just that word.',
          hint: 'Move anywhere on "badword", press diw.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'Remove the badword from this sentence.', cursor: [0, 11], description: 'Cursor anywhere on "badword".' },
          { key: 'diw', mode: 'NORMAL', text: 'Remove the  from this sentence.', cursor: [0, 11], description: 'diw deletes the word: spaces stay.' },
        ],
      },
      {
        id: 'delete-around-word',
        title: 'Delete Around Word',
        keys: ['d', 'a', 'w'],
        description:
          '**daw** deletes the word and one surrounding space.\n\nUnlike **diw**, it cleans up the spacing too.\nThis is usually what you want when removing a word from a sentence.',
        exercise: {
          initialText: `Remove the extra badword from this sentence cleanly.`,
          instructions: 'Place cursor on "badword" and press daw. Notice it also removes the trailing space, unlike diw.',
          hint: 'daw removes word + surrounding space for clean deletion.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'Remove the extra badword from this sentence cleanly.', cursor: [0, 17], description: 'Cursor on "badword".' },
          { key: 'diw', mode: 'NORMAL', text: 'Remove the extra  from this sentence cleanly.', cursor: [0, 17], description: 'diw: word gone but space stays.' },
          { key: 'u', mode: 'NORMAL', text: 'Remove the extra badword from this sentence cleanly.', cursor: [0, 17], description: 'Undo. Try daw instead.' },
          { key: 'daw', mode: 'NORMAL', text: 'Remove the extra from this sentence cleanly.', cursor: [0, 16], description: 'daw: word and trailing space both gone.' },
        ],
      },
      {
        id: 'change-inside-word',
        title: 'Change Inside Word',
        keys: ['c', 'i', 'w'],
        description:
          '**ciw** deletes the word under the cursor and enters Insert mode.\n\nOne of the most used vim commands.\nMove anywhere on a word, press ciw, and type the replacement.',
        exercise: {
          initialText: `my_variable = get_value()
another_thing = 100`,
          instructions: 'Use ciw to rename "my_variable" to "count" and "another_thing" to "total".',
          hint: 'Move anywhere on "my_variable", press ciw, type "count", Esc. Repeat for the other line.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'my_variable = get_value()\nanother_thing = 100', cursor: [0, 2], description: 'Cursor anywhere on "my_variable".' },
          { key: 'ciw', mode: 'INSERT', text: ' = get_value()\nanother_thing = 100', cursor: [0, 0], description: 'ciw deletes the word, enters Insert.' },
          { key: 'Esc', mode: 'NORMAL', text: 'count = get_value()\nanother_thing = 100', cursor: [0, 4], description: 'Typed "count", pressed Esc.' },
        ],
      },
      {
        id: 'words-review',
        title: 'Words Review',
        keys: ['Review'],
        description:
          'A recap of word text objects.\n\n**diw** deletes the word without touching whitespace.\n**daw** deletes the word and its surrounding space.\n**ciw** changes the word (probably the one you\'ll use most).',
        exercise: {
          initialText: `def calculate_total(price, quantity, discount):
    subtotal = price * quantity
    savings = subtotal * discount
    return subtotal - savings`,
          instructions: 'Use ciw to rename:\n\n- "price" → "cost"\n- "quantity" → "amount"\n- "discount" → "reduction"\n\nTry to do it efficiently.',
          hint: 'Move to each word, press ciw, type the new name, Esc.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'def calculate_total(price, quantity, discount):\n    subtotal = price * quantity', cursor: [0, 20], description: 'Cursor on "price" in params.' },
          { key: 'ciw', mode: 'INSERT', text: 'def calculate_total(, quantity, discount):\n    subtotal = price * quantity', cursor: [0, 20], description: 'ciw clears "price", Insert mode.' },
          { key: 'Esc', mode: 'NORMAL', text: 'def calculate_total(cost, quantity, discount):\n    subtotal = price * quantity', cursor: [0, 23], description: 'Typed "cost", Esc. Repeat for each word.' },
        ],
      },
    ],
  },
  {
    id: 'text-objects-paragraphs',
    title: 'Paragraphs',
    lessons: [
      {
        id: 'delete-inside-paragraph',
        title: 'Delete Inside Paragraph',
        keys: ['d', 'i', 'p'],
        description:
          '**dip** deletes the current paragraph.\n\nA paragraph is a contiguous block of non-blank lines.\nThe surrounding blank lines are left intact.',
        exercise: {
          initialText: `def setup():
    config = load_config()

def process():
    result = run()
    return result

def teardown():
    cleanup()`,
          instructions: 'Place cursor anywhere inside the process() function block and press dip. Notice the blank lines above and below stay.',
          hint: 'Move into process(), press dip.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'def setup():\n    config = load_config()\n\ndef process():\n    result = run()\n    return result\n\ndef teardown():\n    cleanup()', cursor: [3, 0], description: 'Cursor in the process() paragraph.' },
          { key: 'dip', mode: 'NORMAL', text: 'def setup():\n    config = load_config()\n\n\ndef teardown():\n    cleanup()', cursor: [3, 0], description: 'dip deletes paragraph: blank lines stay.' },
        ],
      },
      {
        id: 'delete-around-paragraph',
        title: 'Delete Around Paragraph',
        keys: ['d', 'a', 'p'],
        description:
          '**dap** deletes the paragraph and the adjacent blank line.\n\nLeaves cleaner spacing than **dip** when you want to remove a block entirely.',
        exercise: {
          initialText: `def load():
    return read_file()

def process():
    data = fetch()
    return transform(data)

def save():
    write_file()`,
          instructions: 'Place cursor in the second paragraph and press dap. Notice it also removes the blank line.',
          hint: 'dap removes the paragraph and adjacent blank line.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'def load():\n    return read_file()\n\ndef process():\n    data = fetch()\n    return transform(data)\n\ndef save():\n    write_file()', cursor: [3, 0], description: 'Cursor in the process() paragraph.' },
          { key: 'dip', mode: 'NORMAL', text: 'def load():\n    return read_file()\n\n\ndef save():\n    write_file()', cursor: [3, 0], description: 'dip removes lines: blank line stays.' },
          { key: 'u', mode: 'NORMAL', text: 'def load():\n    return read_file()\n\ndef process():\n    data = fetch()\n    return transform(data)\n\ndef save():\n    write_file()', cursor: [3, 0], description: 'Undo. Try dap instead.' },
          { key: 'dap', mode: 'NORMAL', text: 'def load():\n    return read_file()\n\ndef save():\n    write_file()', cursor: [3, 0], description: 'dap removes paragraph and blank line.' },
        ],
      },
      {
        id: 'change-inside-paragraph',
        title: 'Change Inside Paragraph',
        keys: ['c', 'i', 'p'],
        description:
          '**cip** deletes the current paragraph and enters Insert mode.\n\nUseful for rewriting an entire block of code or text in place.',
        exercise: {
          initialText: `def init():
    setup()

def main():
    data = load()
    result = process(data)
    return result

def finish():
    done()`,
          instructions: 'Place cursor anywhere inside main() and press cip. Type a replacement body, then Esc.',
          hint: 'Move into main(), press cip, type new text, Esc.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'def init():\n    setup()\n\ndef main():\n    data = load()\n    result = process(data)\n    return result\n\ndef finish():\n    done()', cursor: [4, 0], description: 'Cursor in the main() paragraph.' },
          { key: 'cip', mode: 'INSERT', text: 'def init():\n    setup()\n\n\ndef finish():\n    done()', cursor: [3, 0], description: 'cip clears the paragraph, Insert mode.' },
          { key: 'Esc', mode: 'NORMAL', text: 'def init():\n    setup()\n\ndef main():\n    return process()\n\ndef finish():\n    done()', cursor: [4, 0], description: 'Typed new body, Esc.' },
        ],
      },
      {
        id: 'paragraphs-review',
        title: 'Paragraphs Review',
        keys: ['Review'],
        description:
          'A recap of paragraph text objects.\n\n**dip** deletes inside the paragraph, blank lines stay.\n**dap** deletes around it, blank line included.\n**cip** clears it and drops you into Insert mode.',
        exercise: {
          initialText: `def header():
    return render_header()

def body():
    items = get_items()
    return render_items(items)

def footer():
    return render_footer()`,
          instructions: 'Use dip to delete the body() block, and cip to replace the footer() block with new text.',
          hint: 'Move into body(), press dip. Move into footer(), press cip, type new text, Esc.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'def header():\n    return render_header()\n\ndef body():\n    items = get_items()\n    return render_items(items)\n\ndef footer():\n    return render_footer()', cursor: [3, 0], description: 'Cursor in body() paragraph.' },
          { key: 'dip', mode: 'NORMAL', text: 'def header():\n    return render_header()\n\n\ndef footer():\n    return render_footer()', cursor: [3, 0], description: 'dip removes the body() block.' },
          { key: 'u', mode: 'NORMAL', text: 'def header():\n    return render_header()\n\ndef body():\n    items = get_items()\n    return render_items(items)\n\ndef footer():\n    return render_footer()', cursor: [7, 0], description: 'Undo. Now cip on footer.' },
          { key: 'cip', mode: 'INSERT', text: 'def header():\n    return render_header()\n\ndef body():\n    items = get_items()\n    return render_items(items)\n\n', cursor: [7, 0], description: 'cip clears footer(), enters Insert.' },
        ],
      },
    ],
  },
  {
    id: 'text-objects-mega-review',
    title: 'Text Objects Review',
    lessons: [
      {
        id: 'mega-review',
        title: 'Text Objects Mega Review',
        keys: ['Mega Review'],
        description:
          'The pattern is always: operator + i/a + object.\n\nOperators: **d** (delete), **c** (change), **y** (yank).\nObjects: **w** (word), **" \' `** (quotes), **( ) { } [ ]** (brackets), **p** (paragraph).\nOnce you know the pattern, you know them all.',
        exercise: {
          initialText: `def process_user(user_data):
    name = "John Doe"
    tags = ["admin", "editor", "viewer"]
    config = {"theme": "dark", "lang": "en"}

    if user_data:
        print("Processing:", name)
        return {"name": name, "tags": tags, "config": config}`,
          instructions: 'Practice a variety of text objects:\n\n1. ci" on "John Doe"\n2. di[ on the tags array contents\n3. da{ on the config object\n4. cip on the if block',
          hint: 'ci" = change string, di[ = delete inside [], da{ = delete around {}, cip = change paragraph.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'def process_user(user_data):\n    name = "John Doe"\n    tags = ["admin", "editor"]\n    config = {"theme": "dark"}', cursor: [1, 11], description: 'Cursor inside "John Doe".' },
          { key: 'ci"', mode: 'INSERT', text: 'def process_user(user_data):\n    name = ""\n    tags = ["admin", "editor"]\n    config = {"theme": "dark"}', cursor: [1, 11], description: 'ci" clears the string.' },
          { key: 'Esc', mode: 'NORMAL', text: 'def process_user(user_data):\n    name = "Jane"\n    tags = ["admin", "editor"]\n    config = {"theme": "dark"}', cursor: [2, 11], description: 'Typed "Jane". Now di[ on tags.' },
          { key: 'di[', mode: 'NORMAL', text: 'def process_user(user_data):\n    name = "Jane"\n    tags = []\n    config = {"theme": "dark"}', cursor: [2, 11], description: 'di[ empties the list.' },
        ],
      },
    ],
  },
  {
    id: 'visual-mode',
    title: 'Selecting Text',
    lessons: [
      {
        id: 'intro-to-visual-mode',
        title: 'Intro to Visual Mode',
        keys: ['v', 'esc'],
        description:
          '**v** enters Visual mode for character-by-character selection.\n\nMove the cursor to expand the selection.\nPress **Esc** to exit without doing anything.\nVisual mode lets you see exactly what you\'re about to act on.',
        exercise: {
          initialText: `Select this word carefully.
Then try selecting a whole phrase.`,
          instructions: '1. Press v to enter Visual mode.\n2. Extend the selection:\n- l to extend rightward\n- w to select word by word\n3. Press Esc to cancel.',
          hint: 'v enters visual mode, move cursor to expand selection, Esc to cancel.',
          goal: { type: 'mode-sequence', sequence: ['VISUAL', 'NORMAL'], reps: 1 },
        },
        demo: [
          { mode: 'NORMAL', text: 'Select this word carefully.\nThen try selecting a whole phrase.', cursor: [0, 0], description: 'Normal mode, cursor on "S".' },
          { key: 'v', mode: 'VISUAL', text: 'Select this word carefully.\nThen try selecting a whole phrase.', cursor: [0, 0], description: 'v enters Visual mode.' },
          { key: 'w', mode: 'VISUAL', text: 'Select this word carefully.\nThen try selecting a whole phrase.', cursor: [0, 6], description: 'w extends selection by one word.' },
          { key: 'w', mode: 'VISUAL', text: 'Select this word carefully.\nThen try selecting a whole phrase.', cursor: [0, 11], description: 'w again. Selection grows.' },
          { key: 'Esc', mode: 'NORMAL', text: 'Select this word carefully.\nThen try selecting a whole phrase.', cursor: [0, 10], description: 'Esc cancels selection, back to Normal.' },
        ],
      },
      {
        id: 'visual-mode-operators',
        title: 'Visual Mode Operators',
        keys: ['d', 'c', 'y'],
        description:
          'After making a selection, apply an operator to act on it.\n\n**d** deletes the selection.\n**c** deletes it and enters Insert mode.\n**y** yanks it for pasting.\nThen use **p** to paste.',
        exercise: {
          initialText: `Delete this middle portion of the line.
Copy this phrase and paste it below.`,
          instructions: 'On line 1: press v, select "middle portion", press d to delete.\n\nOn line 2: select "this phrase", press y, then p to paste.',
          hint: 'v → select → d (delete) or y (yank) → p (paste)',
          goal: { type: 'mode-sequence', sequence: ['VISUAL', 'NORMAL'], reps: 2 },
        },
        demo: [
          { mode: 'NORMAL', text: 'Delete this middle portion of the line.\nCopy this phrase and paste it below.', cursor: [0, 7], description: 'Cursor on "this".' },
          { key: 'v', mode: 'VISUAL', text: 'Delete this middle portion of the line.\nCopy this phrase and paste it below.', cursor: [0, 7], description: 'v enters Visual mode.' },
          { key: 'e e', mode: 'VISUAL', text: 'Delete this middle portion of the line.\nCopy this phrase and paste it below.', cursor: [0, 22], description: 'e e extends selection to "portion".' },
          { key: 'd', mode: 'NORMAL', text: 'Delete  of the line.\nCopy this phrase and paste it below.', cursor: [0, 7], description: 'd deletes the selected text.' },
        ],
      },
      {
        id: 'switch-selection-ends',
        title: 'Switch Selection Ends',
        keys: ['v', 'o'],
        description:
          '**o** switches which end of the visual selection is active.\n\nLets you extend or shrink from the other side without restarting.\nJust press **o** while in Visual mode.',
        exercise: {
          initialText: `Select from here all the way to the end of this line.`,
          instructions: 'Press v, select some text, then press o to switch which end is active. Extend from the other side.',
          hint: 'v → select → o to toggle active end of selection.',
          goal: { type: 'mode-sequence', sequence: ['VISUAL', 'NORMAL'], reps: 3 },
        },
        demo: [
          { mode: 'NORMAL', text: 'Select from here all the way to the end of this line.', cursor: [0, 7], description: 'Cursor on "from".' },
          { key: 'v', mode: 'VISUAL', text: 'Select from here all the way to the end of this line.', cursor: [0, 7], description: 'v enters Visual mode.' },
          { key: 'w w w', mode: 'VISUAL', text: 'Select from here all the way to the end of this line.', cursor: [0, 21], description: 'Selection spans several words.' },
          { key: 'o', mode: 'VISUAL', text: 'Select from here all the way to the end of this line.', cursor: [0, 7], description: 'o switches active end to the left.' },
          { key: 'b b', mode: 'VISUAL', text: 'Select from here all the way to the end of this line.', cursor: [0, 0], description: 'b b extends backward from new end.' },
        ],
      },
      {
        id: 'visual-line-mode',
        title: 'Visual Line Mode',
        keys: ['V', 'esc'],
        description:
          '**V** selects entire lines at once.\n\nMove up or down with j/k to expand the selection.\nMuch easier than character selection when you\'re working with full lines.',
        exercise: {
          initialText: `Line A - keep
Line B - select this
Line C - select this
Line D - select this
Line E - keep`,
          instructions: '1. Press V to enter Visual Line mode on line B.\n2. Press 2j to extend to line D.\n3. Press d to delete all three lines.',
          hint: 'V enters line visual mode, 2j extends 2 lines down, d deletes.',
          goal: { type: 'mode-sequence', sequence: ['VISUAL', 'NORMAL'], reps: 2 },
        },
        demo: [
          { mode: 'NORMAL', text: 'Line A - keep\nLine B - select this\nLine C - select this\nLine D - select this\nLine E - keep', cursor: [1, 0], description: 'Cursor on Line B.' },
          { key: 'V', mode: 'VISUAL', text: 'Line A - keep\nLine B - select this\nLine C - select this\nLine D - select this\nLine E - keep', cursor: [1, 0], description: 'V selects the entire line.' },
          { key: '2j', mode: 'VISUAL', text: 'Line A - keep\nLine B - select this\nLine C - select this\nLine D - select this\nLine E - keep', cursor: [3, 0], description: '2j extends selection down 2 lines.' },
          { key: 'd', mode: 'NORMAL', text: 'Line A - keep\nLine E - keep', cursor: [1, 0], description: 'd deletes all 3 selected lines.' },
        ],
      },
      {
        id: 'switch-visual-line-ends',
        title: 'Switch Visual Line Ends',
        keys: ['V', 'o'],
        description:
          '**o** works in Visual Line mode too.\n\nIt switches which end of the line selection is active.\nLets you adjust the range from either side.',
        exercise: {
          initialText: `Top line
Middle line A
Middle line B
Middle line C
Bottom line`,
          instructions: '1. Press V on "Middle line B".\n2. Extend up with k.\n3. Press o, then extend down with j.\n\nNotice how o switches which end moves.',
          hint: 'V → extend → o to switch active end.',
          goal: { type: 'mode-sequence', sequence: ['VISUAL', 'NORMAL'], reps: 3 },
        },
        demo: [
          { mode: 'NORMAL', text: 'Top line\nMiddle line A\nMiddle line B\nMiddle line C\nBottom line', cursor: [2, 0], description: 'Cursor on Middle line B.' },
          { key: 'V', mode: 'VISUAL', text: 'Top line\nMiddle line A\nMiddle line B\nMiddle line C\nBottom line', cursor: [2, 0], description: 'V enters Visual Line mode.' },
          { key: 'k', mode: 'VISUAL', text: 'Top line\nMiddle line A\nMiddle line B\nMiddle line C\nBottom line', cursor: [1, 0], description: 'k extends selection upward.' },
          { key: 'o', mode: 'VISUAL', text: 'Top line\nMiddle line A\nMiddle line B\nMiddle line C\nBottom line', cursor: [2, 0], description: 'o switches active end to bottom.' },
          { key: 'j', mode: 'VISUAL', text: 'Top line\nMiddle line A\nMiddle line B\nMiddle line C\nBottom line', cursor: [3, 0], description: 'j extends down from new active end.' },
        ],
      },
      {
        id: 'visual-line-operators',
        title: 'Visual Line Operators',
        keys: ['V', 'd', 'y'],
        description:
          'After a Visual Line selection, apply an operator to the whole lines.\n\n**d** deletes the selected lines.\n**y** yanks them.\n**p** pastes below, **P** pastes above.\nThis is the cleanest way to move blocks of code around.',
        exercise: {
          initialText: `def first():
    return 1

def second():
    return 2`,
          instructions: '1. Use V + j to select the "first" function (3 lines).\n2. Yank with y.\n3. Paste it below the "second" function with p.',
          hint: 'V on "function first", 2j to extend, y to yank, move below second function, p to paste.',
          goal: { type: 'mode-sequence', sequence: ['VISUAL', 'NORMAL'], reps: 2 },
        },
        demo: [
          { mode: 'NORMAL', text: 'def first():\n    return 1\n\ndef second():\n    return 2', cursor: [0, 0], description: 'Cursor on first() function.' },
          { key: 'V', mode: 'VISUAL', text: 'def first():\n    return 1\n\ndef second():\n    return 2', cursor: [0, 0], description: 'V selects line 1.' },
          { key: '2j', mode: 'VISUAL', text: 'def first():\n    return 1\n\ndef second():\n    return 2', cursor: [2, 0], description: '2j extends to include blank line.' },
          { key: 'y', mode: 'NORMAL', text: 'def first():\n    return 1\n\ndef second():\n    return 2', cursor: [0, 0], description: 'y yanks the 3 lines.' },
          { key: 'G p', mode: 'NORMAL', text: 'def first():\n    return 1\n\ndef second():\n    return 2\ndef first():\n    return 1\n', cursor: [5, 0], description: 'G then p pastes below second().' },
        ],
      },
    ],
  },
  {
    id: 'undo-redo',
    title: 'Undo & Redo',
    lessons: [
      {
        id: 'undo-redo',
        title: 'Undo / Redo',
        keys: ['u', 'Ctrl+r'],
        description:
          '**u** undoes your last change. **Ctrl+r** redoes it.\n\nPress **u** multiple times to keep going back.\nVim\'s undo history is deep. You can usually go all the way back to when you opened the file.',
        exercise: {
          initialText: `name = "Alice"
age = 999
city = "NYC"`,
          instructions: '1. Delete line 2 with dd.\n2. Press u to undo it back.\n3. Press Ctrl+r to redo the deletion.',
          hint: 'dd deletes, u undoes, Ctrl+r redoes.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'name = "Alice"\nage = 999\ncity = "NYC"', cursor: [1, 0], description: 'Cursor on line 2.' },
          { key: 'dd', mode: 'NORMAL', text: 'name = "Alice"\ncity = "NYC"', cursor: [1, 0], description: 'dd deletes the line.' },
          { key: 'u', mode: 'NORMAL', text: 'name = "Alice"\nage = 999\ncity = "NYC"', cursor: [1, 0], description: 'u undoes the deletion.' },
          { key: 'Ctrl+r', mode: 'NORMAL', text: 'name = "Alice"\ncity = "NYC"', cursor: [1, 0], description: 'Ctrl+r redoes it.' },
        ],
      },
      {
        id: 'undo-line-changes',
        title: 'Undo Line Changes',
        keys: ['U'],
        description:
          '**U** undoes all changes to the current line at once.\n\nUnlike **u**, it doesn\'t step through one change at a time.\nIt restores the entire line to how it was when you moved to it.\n\nNote: **U** itself counts as a change, so pressing **u** right after **U** will undo the line-restore.',
        exercise: {
          initialText: `result = calculate_total(price, tax, discount)`,
          instructions: '1. Make a few edits on the line (use r, x, or i).\n2. Press U to undo all changes to that line at once.',
          hint: 'Edit the line a few times, then press U to restore the whole line.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: 'result = calculate_total(price, tax, discount)', cursor: [0, 0], description: 'Original line.' },
          { key: 'r a', mode: 'NORMAL', text: 'aesult = calculate_total(price, tax, discount)', cursor: [0, 0], description: 'r a replaces first char.' },
          { key: 'x', mode: 'NORMAL', text: 'esult = calculate_total(price, tax, discount)', cursor: [0, 0], description: 'x deletes the next char.' },
          { key: 'U', mode: 'NORMAL', text: 'result = calculate_total(price, tax, discount)', cursor: [0, 0], description: 'U restores the entire line at once.' },
        ],
      },
    ],
  },
  {
    id: 'marks-and-jumps',
    title: 'Marks & Jumps',
    lessons: [
      {
        id: 'setting-marks',
        title: 'Setting Marks',
        keys: ['m', 'a', "'a"],
        description:
          '**ma** sets a mark named "a" at the current cursor position.\n\n**\'a** jumps back to the line of that mark.\n**\`a** jumps to the exact cursor position.\nYou can use any letter a–z for local marks.\n\nLowercase a–z marks are local to the current file; uppercase A–Z are global and jump across files.',
        exercise: {
          initialText: `# Mark this line as 'a'
name = "Alice"

# Navigate away...
age = 30
city = "NYC"

# Jump back to the mark`,
          instructions: '1. Press ma on line 1 to set mark a.\n2. Navigate down a few lines.\n3. Press \'a to jump back to the marked line.',
          hint: 'ma sets the mark, \'a jumps back to it.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: "# Mark this line as 'a'\nname = \"Alice\"\n\n# Navigate away...\nage = 30\ncity = \"NYC\"", cursor: [0, 0], description: 'Cursor on line 1.' },
          { key: 'ma', mode: 'NORMAL', text: "# Mark this line as 'a'\nname = \"Alice\"\n\n# Navigate away...\nage = 30\ncity = \"NYC\"", cursor: [0, 0], description: 'ma sets mark a at this position.' },
          { key: 'G', mode: 'NORMAL', text: "# Mark this line as 'a'\nname = \"Alice\"\n\n# Navigate away...\nage = 30\ncity = \"NYC\"", cursor: [5, 0], description: 'G jumps to the bottom.' },
          { key: "'a", mode: 'NORMAL', text: "# Mark this line as 'a'\nname = \"Alice\"\n\n# Navigate away...\nage = 30\ncity = \"NYC\"", cursor: [0, 0], description: "'a jumps back to the marked line." },
        ],
      },
      {
        id: 'jump-list',
        title: 'Jump List',
        keys: ['Ctrl+o', 'Ctrl+i'],
        description:
          'Vim records large jumps in a jump list.\n\n**Ctrl+o** goes back to older positions.\n**Ctrl+i** goes forward.\nAnytime you jump with gg, G, /, or a mark, it gets recorded here.\n\n**Ctrl+i** and Tab share a keycode in most terminals (pressing Tab has the same effect as Ctrl+i).',
        exercise: {
          initialText: `# Start here at the top
import os

# Middle of the file
def process():
    pass

# End of the file
result = process()`,
          instructions: '1. Press G to jump to the bottom.\n2. Press gg to go to the top.\n3. Search /Middle.\n4. Press Ctrl+o to go back through your jump history.',
          hint: 'Make several jumps (G, gg, /search), then Ctrl+o to walk back through them.',
          goal: { type: 'manual' },
        },
        demo: [
          { mode: 'NORMAL', text: '# Start here at the top\nimport os\n\n# Middle of the file\ndef process():\n    pass\n\n# End of the file\nresult = process()', cursor: [0, 0], description: 'At the top of the file.' },
          { key: 'G', mode: 'NORMAL', text: '# Start here at the top\nimport os\n\n# Middle of the file\ndef process():\n    pass\n\n# End of the file\nresult = process()', cursor: [8, 0], description: 'G jumps to bottom. Recorded in jump list.' },
          { key: 'gg', mode: 'NORMAL', text: '# Start here at the top\nimport os\n\n# Middle of the file\ndef process():\n    pass\n\n# End of the file\nresult = process()', cursor: [0, 0], description: 'gg jumps to top. Also recorded.' },
          { key: 'Ctrl+o', mode: 'NORMAL', text: '# Start here at the top\nimport os\n\n# Middle of the file\ndef process():\n    pass\n\n# End of the file\nresult = process()', cursor: [8, 0], description: 'Ctrl+o goes back to bottom.' },
          { key: 'Ctrl+i', mode: 'NORMAL', text: '# Start here at the top\nimport os\n\n# Middle of the file\ndef process():\n    pass\n\n# End of the file\nresult = process()', cursor: [0, 0], description: 'Ctrl+i goes forward again.' },
        ],
      },
    ],
  },
]

export function getAllLessons(): { section: Section; lesson: Lesson }[] {
  return curriculum.flatMap((section) =>
    section.lessons.map((lesson) => ({ section, lesson }))
  )
}

export function findLesson(sectionId: string, lessonId: string) {
  const section = curriculum.find((s) => s.id === sectionId)
  if (!section) return null
  const lesson = section.lessons.find((l) => l.id === lessonId)
  if (!lesson) return null
  return { section, lesson }
}
