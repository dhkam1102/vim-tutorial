export type Lesson = {
  id: string
  title: string
  keys: string[]
  description: string
  exercise: {
    initialText: string
    instructions: string
    hint?: string
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
    title: 'Basic Vim',
    lessons: [
      {
        id: 'intro-to-modes',
        title: 'Intro to Modes',
        keys: ['modes'],
        description:
          'Vim is a modal editor — it has different modes for different tasks. **Normal mode** is the default; you navigate and run commands here. **Insert mode** lets you type text. **Visual mode** lets you select text. You switch between them using specific keys.',
        exercise: {
          initialText: `Welcome to Vim!
This is Normal mode — you cannot type here yet.
Press i to enter Insert mode, then type something.
Press Esc to return to Normal mode.`,
          instructions: 'Press i to enter Insert mode, add a word anywhere, then press Esc to return to Normal mode.',
          hint: 'i enters Insert mode. Esc exits back to Normal mode.',
        },
      },
      {
        id: 'basic-movement',
        title: 'Basic Movement',
        keys: ['h', 'j', 'k', 'l'],
        description:
          'In Normal mode, use **h j k l** to move your cursor — left, down, up, right. These keep your fingers on the home row. Arrow keys work too, but learning hjkl makes you faster.',
        exercise: {
          initialText: `Line one
Line two
Line three
Line four
Line five`,
          instructions: 'Navigate to "five" on the last line using j (down) and l (right). Do not use arrow keys.',
          hint: 'Press j to move down, l to move right.',
        },
      },
      {
        id: 'moving-by-words',
        title: 'Moving by Words',
        keys: ['w', 'e', 'b'],
        description:
          '**w** jumps to the start of the next word. **e** jumps to the end of the current/next word. **b** jumps back to the start of the previous word. These are much faster than pressing l repeatedly.',
        exercise: {
          initialText: `const greeting = "Hello, World!"
const count = 42
let message = greeting + count`,
          instructions: 'Starting at the beginning, use w to jump forward word by word to reach "World". Then use b to go back to "Hello".',
          hint: 'w moves forward one word at a time. b moves backward.',
        },
      },
      {
        id: 'insert-mode',
        title: 'Insert Mode',
        keys: ['i', 'a', 'esc'],
        description:
          '**i** enters Insert mode *before* the cursor. **a** enters Insert mode *after* the cursor (append). **Esc** always returns you to Normal mode. Most vim work is: navigate in Normal mode → make a change in Insert mode → Esc back.',
        exercise: {
          initialText: `Hello, !
My name is .`,
          instructions: 'Use i or a to insert "World" after the comma on line 1, and your name on line 2.',
          hint: 'Move to the ! on line 1, press i, type "World", press Esc.',
        },
      },
    ],
  },
  {
    id: 'insert-like-a-pro',
    title: 'Insert Like a Pro',
    lessons: [
      {
        id: 'insert-at-line-ends',
        title: 'Insert at Line Ends',
        keys: ['I', 'A', 'esc'],
        description:
          '**I** (capital) jumps to the first non-blank character of the line and enters Insert mode. **A** (capital) jumps to the end of the line and enters Insert mode. These save you from pressing Home/End before typing.',
        exercise: {
          initialText: `  function greet() {
    console.log("Hello")
  }`,
          instructions: 'Go to line 2. Use A to append a semicolon at the end of the console.log line.',
          hint: 'Move to line 2 with j, then press A and type ;',
        },
      },
      {
        id: 'opening-new-lines',
        title: 'Opening New Lines',
        keys: ['o', 'O'],
        description:
          '**o** opens a new line *below* the current line and enters Insert mode. **O** (capital) opens a new line *above* and enters Insert mode. No need to go to end of line and press Enter.',
        exercise: {
          initialText: `First line
Third line`,
          instructions: 'Place your cursor on "First line" and press o to open a new line below it. Type "Second line".',
          hint: 'Press o while on line 1, type "Second line", then Esc.',
        },
      },
      {
        id: 'making-small-edits',
        title: 'Making Small Edits',
        keys: ['s', 'x', 'r'],
        description:
          '**x** deletes the character under the cursor. **r** replaces the character under the cursor with the next key you press (stays in Normal mode). **s** deletes the character under the cursor and enters Insert mode.',
        exercise: {
          initialText: `Hellp, World!
This iz a testt.`,
          instructions: 'Fix the typos: "Hellp" → "Hello", "iz" → "is", "testt" → "test". Use r to replace single characters and x to delete extras.',
          hint: 'Move to the p in "Hellp", press r then o. Move to z, press r then s. Move to the extra t, press x.',
        },
      },
    ],
  },
  {
    id: 'essential-motions',
    title: 'Essential Motions',
    lessons: [
      {
        id: 'moving-by-words',
        title: 'Moving by WORDs',
        keys: ['W', 'E', 'B'],
        description:
          'Lowercase w/e/b move by "words" (separated by non-word chars). Uppercase **W**, **E**, **B** move by "WORDs" — separated only by whitespace. Great for jumping over things like `function.name()` as one unit.',
        exercise: {
          initialText: `const url = "https://example.com/api/v1"
fetch(url).then(res => res.json())`,
          instructions: 'Use W to jump over the full URL token "https://example.com/api/v1" in one move. Compare with w which stops at each punctuation.',
          hint: 'Position cursor at "https", press W to skip the whole WORD.',
        },
      },
      {
        id: 'moving-to-line-ends',
        title: 'Moving to Line Ends',
        keys: ['0', '_', '$'],
        description:
          '**0** (zero) jumps to the very start of the line. **_** jumps to the first non-blank character. **$** jumps to the end of the line. Use $ + a to quickly append to a line.',
        exercise: {
          initialText: `    const x = 10
    const y = 20
    const z = x + y`,
          instructions: 'On line 1, press $ to go to the end, then 0 to go to column 0, then _ to go to "const".',
          hint: '$ = end of line, 0 = column 0, _ = first non-blank char',
        },
      },
      {
        id: 'find-character',
        title: 'Find Character',
        keys: ['f', 'F', ';'],
        description:
          '**f{char}** moves the cursor to the next occurrence of {char} on the current line. **F{char}** searches backward. **;** repeats the last f/F search in the same direction.',
        exercise: {
          initialText: `function calculateTotal(price, tax, discount) {
  return price + tax - discount
}`,
          instructions: 'On line 1, press f( to jump to the opening parenthesis. Then press ; to jump to the next comma.',
          hint: 'f( jumps to (, then ; repeats to find the next match.',
        },
      },
      {
        id: 'till-character',
        title: 'Till Character',
        keys: ['t', 'T', ';'],
        description:
          '**t{char}** moves the cursor *up to but not including* {char}. **T{char}** searches backward the same way. Often more useful than f when you want to position just before something.',
        exercise: {
          initialText: `const result = doSomething(value, callback)`,
          instructions: 'Use t) to move just before the closing parenthesis. Notice the cursor stops one character before ) unlike f).',
          hint: 't) stops before the ), f) stops on the ).',
        },
      },
    ],
  },
  {
    id: 'basic-operators',
    title: 'Basic Operators',
    lessons: [
      {
        id: 'intro-to-operators',
        title: 'Intro to Operators',
        keys: ['operators'],
        description:
          'Operators like **d** (delete), **c** (change), **y** (yank/copy) work by combining with a motion: `operator + motion`. For example, `dw` deletes a word, `d$` deletes to end of line. This is the grammar of Vim.',
        exercise: {
          initialText: `delete this entire word please
change this word too
yank this line`,
          instructions: 'Read this lesson — the next lessons will practice each operator. For now, try dw on "entire" to delete it.',
          hint: 'Move to "entire", press dw to delete the word.',
        },
      },
      {
        id: 'delete-words',
        title: 'Delete Words',
        keys: ['d', 'w'],
        description:
          '**dw** deletes from the cursor to the start of the next word. **de** deletes to the end of the word. **dW** deletes the whole WORD. You can prefix with a count: **3dw** deletes 3 words.',
        exercise: {
          initialText: `Remove the extra extra word from this line.
Also delete these three unnecessary filler words here.`,
          instructions: 'On line 1, delete the duplicate "extra" using dw. On line 2, delete "unnecessary filler words" (try 3dw or d3w).',
          hint: 'Position on first "extra", press dw. Then find "unnecessary", press 3dw.',
        },
      },
      {
        id: 'change-words',
        title: 'Change Words',
        keys: ['c', 'w'],
        description:
          '**cw** deletes the word and enters Insert mode so you can type a replacement immediately. It\'s d + i combined. **ce** changes to end of word. **cW** changes the whole WORD.',
        exercise: {
          initialText: `const foo = "bar"
let baz = 100`,
          instructions: 'Change "foo" to "message" using cw. Change "baz" to "count" using cw.',
          hint: 'Move to "foo", press cw, type "message", Esc. Repeat for "baz".',
        },
      },
      {
        id: 'delete-lines',
        title: 'Delete Lines',
        keys: ['d', 'd', 'D'],
        description:
          '**dd** deletes the entire current line. **D** deletes from the cursor to the end of the line (equivalent to d$). Deleted lines go into the register and can be pasted with p.',
        exercise: {
          initialText: `Keep this line
DELETE THIS LINE
Keep this too
DELETE THIS ONE AS WELL
Keep me`,
          instructions: 'Delete the two lines that say "DELETE" using dd. The other lines should remain.',
          hint: 'Move to "DELETE THIS LINE", press dd. Move to the next DELETE line, press dd.',
        },
      },
      {
        id: 'delete-multiple-lines',
        title: 'Delete Multiple Lines',
        keys: ['d', 'j', 'k'],
        description:
          '**dj** deletes the current line and the line below. **dk** deletes the current line and the line above. You can use counts: **3dd** deletes 3 lines, **d2j** deletes current + 2 below.',
        exercise: {
          initialText: `Line 1 - keep
Line 2 - delete
Line 3 - delete
Line 4 - delete
Line 5 - keep`,
          instructions: 'Delete lines 2, 3, and 4 in one command. Position on line 2 and use d2j (or 3dd).',
          hint: 'Move to "Line 2", press d2j to delete it and 2 lines below.',
        },
      },
      {
        id: 'copy-paste-lines',
        title: 'Copy/Paste Lines',
        keys: ['y', 'p', 'P'],
        description:
          '**yy** yanks (copies) the current line. **p** pastes *after* the cursor (or below the current line for full lines). **P** pastes *before* the cursor (or above the line). **yw** yanks a word.',
        exercise: {
          initialText: `const PI = 3.14159
// paste the PI line below here

// paste it above this comment`,
          instructions: 'Yank the PI line with yy, then paste it below the first comment with p, and above the second comment with P.',
          hint: 'Move to the PI line, press yy, move to comment line, press p for below or P for above.',
        },
      },
    ],
  },
  {
    id: 'advanced-vertical-movement',
    title: 'Advanced Vertical Movement',
    lessons: [
      {
        id: 'relative-line-jumps',
        title: 'Relative Line Jumps',
        keys: ['{n}', 'j', 'k'],
        description:
          'Prefix j or k with a number to jump multiple lines at once. **5j** moves down 5 lines, **3k** moves up 3 lines. Enable relative line numbers in vim (`:set relativenumber`) to see how far each line is.',
        exercise: {
          initialText: `Line 1
Line 2
Line 3
Line 4
Line 5
Line 6
Line 7
Line 8
Line 9
Line 10`,
          instructions: 'From line 1, jump to line 7 with 6j. Then jump back to line 3 with 4k.',
          hint: '6j jumps 6 lines down, 4k jumps 4 lines up.',
        },
      },
      {
        id: 'absolute-line-jumps',
        title: 'Absolute Line Jumps',
        keys: ['g', 'g', 'G'],
        description:
          '**gg** jumps to the first line of the file. **G** jumps to the last line. **{n}G** or **{n}gg** jumps to line n. Perfect for large files.',
        exercise: {
          initialText: `Line 1 - top of file
Line 2
Line 3
Line 4
Line 5 - middle
Line 6
Line 7
Line 8
Line 9
Line 10 - bottom of file`,
          instructions: 'Press G to jump to the last line. Then press gg to return to the top. Then press 5G to jump to line 5.',
          hint: 'G = last line, gg = first line, 5G = line 5.',
        },
      },
      {
        id: 'paragraph-jumps',
        title: 'Paragraph Jumps',
        keys: ['}', '{'],
        description:
          '**}** jumps to the next blank line (next paragraph). **{** jumps to the previous blank line. Essential for navigating code blocks and prose quickly.',
        exercise: {
          initialText: `First paragraph here.
It has multiple lines.
All part of the same block.

Second paragraph starts here.
Another line in paragraph two.

Third paragraph is here.`,
          instructions: 'Press } to jump between paragraphs (blank lines). Press { to go back up.',
          hint: '} moves to next blank line, { moves to previous blank line.',
        },
      },
      {
        id: 'window-scrolls',
        title: 'Window Scrolls',
        keys: ['Ctrl+u', 'Ctrl+d'],
        description:
          '**Ctrl+u** scrolls up half a screen. **Ctrl+d** scrolls down half a screen. The cursor moves with the viewport. Much faster than pressing j/k many times for large files.',
        exercise: {
          initialText: Array.from({ length: 40 }, (_, i) => `Line ${i + 1}: Lorem ipsum dolor sit amet`).join('\n'),
          instructions: 'Press Ctrl+d to scroll down half a page. Press Ctrl+u to scroll back up.',
          hint: 'Hold Ctrl and press d to scroll down, u to scroll up.',
        },
      },
    ],
  },
  {
    id: 'search',
    title: 'Search',
    lessons: [
      {
        id: 'search',
        title: 'Search',
        keys: ['/', '?'],
        description:
          '**/pattern** searches forward for the pattern. **?pattern** searches backward. After typing your search, press Enter to confirm. The cursor jumps to the first match.',
        exercise: {
          initialText: `function greet(name) {
  const message = "Hello, " + name
  console.log(message)
  return message
}`,
          instructions: 'Press / then type "message" and press Enter to search for it. Watch the cursor jump to the first match.',
          hint: 'Type /message then Enter.',
        },
      },
      {
        id: 'repeat-search',
        title: 'Repeat Search',
        keys: ['n', 'N'],
        description:
          'After a search, **n** jumps to the *next* match. **N** jumps to the *previous* match. This lets you cycle through all occurrences quickly.',
        exercise: {
          initialText: `const count = 1
let total = count + count
console.log(count, total)
return count`,
          instructions: 'Search for "count" with /count Enter. Then press n to jump to each occurrence. Press N to go backward.',
          hint: 'After /count Enter, press n repeatedly to cycle through matches.',
        },
      },
      {
        id: 'quick-word-search',
        title: 'Quick Word Search',
        keys: ['*', '#'],
        description:
          '***** searches forward for the word under the cursor. **#** searches backward. No need to type the word — just position your cursor on it and press *.',
        exercise: {
          initialText: `const user = getUser(id)
if (user) {
  updateUser(user)
  console.log(user.name)
}`,
          instructions: 'Place your cursor on the word "user" and press * to find all occurrences. Press n to jump between them.',
          hint: 'Move to "user", press *, then n to cycle through.',
        },
      },
      {
        id: 'search-review',
        title: 'Search Review',
        keys: ['Review'],
        description:
          'Review all search commands: **/pattern** (forward), **?pattern** (backward), **n** (next match), **N** (previous match), ***** (search word under cursor forward), **#** (backward).',
        exercise: {
          initialText: `function processData(data) {
  const result = transform(data)
  const error = validate(result)
  if (error) handleError(error)
  return result
}`,
          instructions: 'Search for "error", jump through all matches with n, then use * on "result" to quickly find all its occurrences.',
          hint: '/error Enter, then n to cycle. Move to "result", press *.',
        },
      },
    ],
  },
  {
    id: 'text-objects-brackets',
    title: 'Text Objects – Bracket Pairs',
    lessons: [
      {
        id: 'intro-to-text-objects',
        title: 'Intro to Text Objects',
        keys: ['text objects'],
        description:
          'Text objects let you select structured units of text. They work with operators: `d` + text object, `c` + text object, `y` + text object. **i** means "inside" (not including delimiters), **a** means "around" (including delimiters).',
        exercise: {
          initialText: `const obj = { name: "Alice", age: 30 }
console.log(obj)`,
          instructions: 'Read this introduction. In the next lessons you\'ll practice di{, da{, ci{, ca{. For now, try positioning inside the { } on line 1.',
          hint: 'Move your cursor anywhere inside the { } on line 1.',
        },
      },
      {
        id: 'delete-inside-brackets',
        title: 'Delete Inside Brackets',
        keys: ['d', 'i', '{'],
        description:
          '**di{** (or di}) deletes everything *inside* the curly braces, leaving the braces themselves. Also works with: **di(**, **di[**, **di<**. The cursor can be anywhere inside the block.',
        exercise: {
          initialText: `function greet() {
  console.log("Hello!")
  return "done"
}`,
          instructions: 'Place your cursor anywhere inside the function body and press di{ to delete everything between the braces.',
          hint: 'Move inside the {}, press di{ to delete contents but keep the braces.',
        },
      },
      {
        id: 'delete-around-brackets',
        title: 'Delete Around Brackets',
        keys: ['d', 'a', '{'],
        description:
          '**da{** deletes everything *including* the curly braces. **da(** deletes including parentheses. The "around" variant removes the delimiters too.',
        exercise: {
          initialText: `if (condition) {
  doSomething()
}`,
          instructions: 'Place cursor inside the {} block and press da{ to delete the braces and their contents.',
          hint: 'Move inside {}, press da{ — it removes { ... } entirely.',
        },
      },
      {
        id: 'change-inside-brackets',
        title: 'Change Inside Brackets',
        keys: ['c', 'i', '{'],
        description:
          '**ci{** deletes everything inside the braces and enters Insert mode, so you can type a replacement immediately. Perfect for replacing the body of a function.',
        exercise: {
          initialText: `function greet() {
  console.log("old content")
}`,
          instructions: 'Position inside the function body and press ci{ to clear it and enter Insert mode. Type a new body.',
          hint: 'Move inside {}, press ci{, type new content, press Esc.',
        },
      },
      {
        id: 'change-around-brackets',
        title: 'Change Around Brackets',
        keys: ['c', 'a', '{'],
        description:
          '**ca{** deletes the braces and their contents, then enters Insert mode. Useful when you want to completely replace a bracketed expression including the delimiters.',
        exercise: {
          initialText: `const result = calculate({ x: 1, y: 2 })`,
          instructions: 'Place cursor inside { x: 1, y: 2 } and press ca{ to delete the braces and content, then type { x: 5, y: 10 }.',
          hint: 'Move inside {}, press ca{, type new object literal, Esc.',
        },
      },
      {
        id: 'brackets-review',
        title: 'Brackets Review',
        keys: ['Review'],
        description:
          'Review: **di{** (delete inside), **da{** (delete around), **ci{** (change inside), **ca{** (change around). These all work with any bracket pair: `()`, `[]`, `{}`, `<>`.',
        exercise: {
          initialText: `function process(input) {
  const data = transform([1, 2, 3])
  return { result: data, status: "ok" }
}`,
          instructions: 'Try di( on the function params, di[ on the array, and di{ on the return object. See the difference between each.',
          hint: 'Move inside (), press di(. Move inside [], press di[. Move inside {}, press di{.',
        },
      },
    ],
  },
  {
    id: 'text-objects-quotes',
    title: 'Text Objects – Quotes',
    lessons: [
      {
        id: 'delete-inside-quotes',
        title: 'Delete Inside Quotes',
        keys: ['d', 'i', '"'],
        description:
          '**di"** deletes everything inside double quotes. **di\'** works for single quotes. **di`** for backticks. The cursor just needs to be anywhere on that line.',
        exercise: {
          initialText: `const greeting = "Hello, World!"
const name = 'Alice'`,
          instructions: 'Place cursor anywhere on line 1 and press di" to delete the string contents (keep the quotes). Then di\' on line 2.',
          hint: 'di" removes content between " ". di\' removes content between \' \'.',
        },
      },
      {
        id: 'delete-around-quotes',
        title: 'Delete Around Quotes',
        keys: ['d', 'a', '"'],
        description:
          '**da"** deletes the content *and* the quote characters. Useful when you want to remove the entire string literal.',
        exercise: {
          initialText: `console.log("debug message")
const url = "https://example.com"`,
          instructions: 'Press da" on line 1 to delete the entire "debug message" string including quotes.',
          hint: 'Move to line 1, press da" to remove "debug message" (with quotes).',
        },
      },
      {
        id: 'change-inside-quotes',
        title: 'Change Inside Quotes',
        keys: ['c', 'i', '"'],
        description:
          '**ci"** is the most-used quote text object — it clears the string contents and drops you into Insert mode inside the quotes, ready to type a new value.',
        exercise: {
          initialText: `const title = "Old Title"
const author = "Unknown"`,
          instructions: 'Use ci" on line 1 to change "Old Title" to "New Title". Use ci" on line 2 to change "Unknown" to your name.',
          hint: 'Move to line 1, press ci", type new string, Esc.',
        },
      },
      {
        id: 'change-around-quotes',
        title: 'Change Around Quotes',
        keys: ['c', 'a', '"'],
        description:
          '**ca"** deletes the string including quotes and enters Insert mode. Use this when you want to replace the whole string literal, possibly with a different type of quotes.',
        exercise: {
          initialText: `const value = "replace me entirely"`,
          instructions: 'Press ca" to delete the whole "replace me entirely" (with quotes) and type a new value like 42 (no quotes needed).',
          hint: 'Press ca", type 42 or any replacement, press Esc.',
        },
      },
      {
        id: 'quotes-review',
        title: 'Quotes Review',
        keys: ['Review'],
        description:
          'Review: **di"** (inside), **da"** (around), **ci"** (change inside), **ca"** (change around). Works with ", \', and ` quote types.',
        exercise: {
          initialText: `const obj = {
  name: "Alice",
  greeting: 'Hello',
  template: \`World\`,
}`,
          instructions: 'Practice ci" on name, ci\' on greeting, and ci` on template. Change each string value.',
          hint: 'Move to each string, use the matching ci operator for that quote type.',
        },
      },
    ],
  },
  {
    id: 'text-objects-words',
    title: 'Text Objects – Words',
    lessons: [
      {
        id: 'delete-inside-word',
        title: 'Delete Inside Word',
        keys: ['d', 'i', 'w'],
        description:
          '**diw** deletes the word under the cursor, but not the surrounding whitespace. The cursor can be anywhere in the word.',
        exercise: {
          initialText: `Remove the badword from this sentence.
This has an unwanted word in it.`,
          instructions: 'Move your cursor anywhere on "badword" and press diw to delete just that word.',
          hint: 'Move anywhere on "badword", press diw.',
        },
      },
      {
        id: 'delete-around-word',
        title: 'Delete Around Word',
        keys: ['d', 'a', 'w'],
        description:
          '**daw** deletes the word *and* one surrounding space, so the remaining text doesn\'t have an extra gap. This is usually what you want when removing a word from a sentence.',
        exercise: {
          initialText: `Remove the extra badword from this sentence cleanly.`,
          instructions: 'Place cursor on "badword" and press daw. Notice it also removes the trailing space, unlike diw.',
          hint: 'daw removes word + surrounding space for clean deletion.',
        },
      },
      {
        id: 'change-inside-word',
        title: 'Change Inside Word',
        keys: ['c', 'i', 'w'],
        description:
          '**ciw** deletes the word under the cursor and enters Insert mode. This is one of the most frequently used vim commands — place cursor anywhere on a word, press ciw, type the new word.',
        exercise: {
          initialText: `const myVariable = getValue()
let anotherThing = 100`,
          instructions: 'Use ciw to rename "myVariable" to "count" and "anotherThing" to "total".',
          hint: 'Move anywhere on "myVariable", press ciw, type "count", Esc. Repeat.',
        },
      },
      {
        id: 'words-review',
        title: 'Words Review',
        keys: ['Review'],
        description:
          'Review: **diw** (delete inside word), **daw** (delete around word + space), **ciw** (change word). ciw is especially powerful — it\'s the fastest way to rename any identifier.',
        exercise: {
          initialText: `function calculateTotal(price, quantity, discount) {
  const subtotal = price * quantity
  const savings = subtotal * discount
  return subtotal - savings
}`,
          instructions: 'Use ciw to rename: "price" → "cost", "quantity" → "amount", "discount" → "reduction". Try to do it efficiently.',
          hint: 'Move to each word, press ciw, type the new name, Esc.',
        },
      },
    ],
  },
  {
    id: 'text-objects-paragraphs',
    title: 'Text Objects – Paragraphs',
    lessons: [
      {
        id: 'delete-inside-paragraph',
        title: 'Delete Inside Paragraph',
        keys: ['d', 'i', 'p'],
        description:
          '**dip** deletes the current paragraph (contiguous block of non-blank lines), leaving the surrounding blank lines intact.',
        exercise: {
          initialText: `First paragraph, line one.
First paragraph, line two.

Second paragraph — delete this.
Also delete this line.

Third paragraph, keep this.`,
          instructions: 'Place cursor anywhere in the second paragraph and press dip to delete it, leaving the blank lines.',
          hint: 'Move to "Second paragraph", press dip.',
        },
      },
      {
        id: 'delete-around-paragraph',
        title: 'Delete Around Paragraph',
        keys: ['d', 'a', 'p'],
        description:
          '**dap** deletes the paragraph *and* the adjacent blank line, cleaning up the spacing completely.',
        exercise: {
          initialText: `First paragraph here.
It has two lines.

Second paragraph — delete this and the blank line.
Second line of second paragraph.

Third paragraph stays.`,
          instructions: 'Place cursor in the second paragraph and press dap. Notice it also removes the blank line.',
          hint: 'dap removes the paragraph and adjacent blank line.',
        },
      },
      {
        id: 'change-inside-paragraph',
        title: 'Change Inside Paragraph',
        keys: ['c', 'i', 'p'],
        description:
          '**cip** deletes the current paragraph and enters Insert mode, letting you type a replacement. Great for rewriting a block of code.',
        exercise: {
          initialText: `Introduction paragraph.
This has some text.

Body paragraph with content.
More content here.
And even more.

Conclusion paragraph.`,
          instructions: 'Place cursor in the body paragraph and press cip to replace it. Type some new content.',
          hint: 'Move to "Body paragraph", press cip, type new text, Esc.',
        },
      },
      {
        id: 'paragraphs-review',
        title: 'Paragraphs Review',
        keys: ['Review'],
        description:
          'Review: **dip** (delete inside paragraph), **dap** (delete around + blank line), **cip** (change paragraph). These are great for editing structured text and code blocks.',
        exercise: {
          initialText: `Header section
Header content here.

Main section
Main content here.
More main content.

Footer section
Footer content here.`,
          instructions: 'Use dip to delete the "Main section" block, and cip to replace the "Footer section" block with new text.',
          hint: 'dip on main block, then cip on footer block.',
        },
      },
    ],
  },
  {
    id: 'text-objects-mega-review',
    title: 'Text Objects – Mega Review',
    lessons: [
      {
        id: 'mega-review',
        title: 'Text Objects Mega Review',
        keys: ['Mega Review'],
        description:
          'You now know text objects! The pattern is always: **operator** + **i/a** + **object**. Objects: `w` (word), `"` `\'` `` ` `` (quotes), `(` `)` `{` `}` `[` `]` (brackets), `p` (paragraph). Operators: `d` (delete), `c` (change), `y` (yank).',
        exercise: {
          initialText: `function processUser(userData) {
  const name = "John Doe"
  const tags = ["admin", "editor", "viewer"]
  const config = { theme: "dark", lang: "en" }

  if (userData) {
    console.log("Processing:", name)
    return { name, tags, config }
  }
}`,
          instructions: 'Practice a variety of text objects: ci" on "John Doe", di[ on the tags array contents, da{ on the config object, cip on the if block.',
          hint: 'ci" = change string, di[ = delete inside [], da{ = delete around {}, cip = change paragraph.',
        },
      },
    ],
  },
  {
    id: 'visual-mode',
    title: 'Visual Mode',
    lessons: [
      {
        id: 'intro-to-visual-mode',
        title: 'Intro to Visual Mode',
        keys: ['v', 'esc'],
        description:
          '**v** enters Visual mode where you can select text character by character. Move the cursor to expand the selection. Press **Esc** to exit. Visual mode lets you see exactly what you\'re about to operate on.',
        exercise: {
          initialText: `Select this word carefully.
Then try selecting a whole phrase.`,
          instructions: 'Press v to enter Visual mode, then use l to extend the selection rightward, or w to select word by word. Press Esc to cancel.',
          hint: 'v enters visual mode, move cursor to expand selection, Esc to cancel.',
        },
      },
      {
        id: 'visual-mode-operators',
        title: 'Visual Mode Operators',
        keys: ['d', 'c', 'y'],
        description:
          'After making a visual selection, press **d** to delete it, **c** to change it (delete + insert), or **y** to yank (copy) it. Then paste with p.',
        exercise: {
          initialText: `Delete this middle portion of the line.
Copy this phrase and paste it below.`,
          instructions: 'On line 1: press v, select "middle portion", press d to delete. On line 2: select "this phrase", press y, then p to paste.',
          hint: 'v → select → d (delete) or y (yank) → p (paste)',
        },
      },
      {
        id: 'switch-selection-ends',
        title: 'Switch Selection Ends',
        keys: ['v', 'o'],
        description:
          'While in Visual mode, **o** switches the "active end" of the selection. This lets you extend or shrink the selection from the other side without restarting.',
        exercise: {
          initialText: `Select from here all the way to the end of this line.`,
          instructions: 'Press v, select some text, then press o to switch which end is active. Extend from the other side.',
          hint: 'v → select → o to toggle active end of selection.',
        },
      },
      {
        id: 'visual-line-mode',
        title: 'Visual Line Mode',
        keys: ['V', 'esc'],
        description:
          '**V** (capital) enters Visual Line mode, which selects entire lines at once. Move up/down with j/k to select multiple full lines. Much easier than character-by-character selection for line operations.',
        exercise: {
          initialText: `Line A - keep
Line B - select this
Line C - select this
Line D - select this
Line E - keep`,
          instructions: 'Press V to enter Visual Line mode on line B, then press 2j to extend to line D, then press d to delete all three lines.',
          hint: 'V enters line visual mode, 2j extends 2 lines down, d deletes.',
        },
      },
      {
        id: 'switch-visual-line-ends',
        title: 'Switch Visual Line Ends',
        keys: ['V', 'o'],
        description:
          'Just like in character visual mode, **o** in Visual Line mode switches which end of the line selection is active, letting you adjust from either side.',
        exercise: {
          initialText: `Top line
Middle line A
Middle line B
Middle line C
Bottom line`,
          instructions: 'Press V on "Middle line B", extend up with k, press o, then extend down with j. Notice how o switches which end moves.',
          hint: 'V → extend → o to switch active end.',
        },
      },
      {
        id: 'visual-line-operators',
        title: 'Visual Line Operators',
        keys: ['V', 'd', 'y'],
        description:
          'After a Visual Line selection, **d** deletes the selected lines, **y** yanks them for pasting. **p** pastes below, **P** pastes above. This is the cleanest way to move blocks of code.',
        exercise: {
          initialText: `function first() {
  return 1
}

function second() {
  return 2
}`,
          instructions: 'Use V + j to select the "first" function (3 lines), yank with y, then paste it below the "second" function with p.',
          hint: 'V on "function first", 2j to extend, y to yank, move below second function, p to paste.',
        },
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
          '**u** undoes the last change. Press it multiple times to undo further back. **Ctrl+r** redoes (re-applies an undone change). Vim\'s undo history is deep — you can usually undo everything back to when you opened the file.',
        exercise: {
          initialText: `This line is correct.
This line will be changed.
This line is also correct.`,
          instructions: 'Delete line 2 with dd, then press u to undo it back. Press Ctrl+r to redo the deletion.',
          hint: 'dd deletes, u undoes, Ctrl+r redoes.',
        },
      },
      {
        id: 'undo-line-changes',
        title: 'Undo Line Changes',
        keys: ['U'],
        description:
          '**U** (capital) undoes all changes made to the current line since you moved to it. Unlike u, it undoes everything on that line at once, not one change at a time.',
        exercise: {
          initialText: `Make several changes to this line then undo them all.`,
          instructions: 'Make a few edits on the line (use r, x, or i). Then press U to undo all changes to that line at once.',
          hint: 'Edit the line a few times, then press U to restore the whole line.',
        },
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
          '**ma** sets a mark named "a" at the current cursor position. **\'a** (apostrophe + a) jumps back to the line of mark "a". **`a** (backtick + a) jumps to the exact position. Use any letter a-z for local marks.',
        exercise: {
          initialText: `Mark this spot as 'a'.

Navigate away...
...and further away...
...keep going...

Now jump back to the mark.`,
          instructions: 'Press ma on line 1 to set mark a. Navigate down a few lines. Press \'a to jump back to the marked line.',
          hint: 'ma sets the mark, \'a jumps back to it.',
        },
      },
      {
        id: 'jump-list',
        title: 'Jump List',
        keys: ['Ctrl+o', 'Ctrl+i'],
        description:
          'Vim tracks a "jump list" — every time you make a large jump (gg, G, /, etc.), it\'s recorded. **Ctrl+o** goes back in the jump list (older positions). **Ctrl+i** goes forward. Great for navigating your recent editing history.',
        exercise: {
          initialText: `Start here at the top.

Middle of the file.

End of the file.`,
          instructions: 'Press G to jump to the bottom, then gg to go to the top, then search /Middle. Now press Ctrl+o to go back through your jump history.',
          hint: 'Make several jumps (G, gg, /search), then Ctrl+o to walk back through them.',
        },
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
