#!/usr/bin/env node
// One-time migration: restructure curriculum from 14 → 11 sections
// Run: node scripts/migrate-curriculum.js
// Output: data/curriculum.ts (overwritten)

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'curriculum.ts');
const src = fs.readFileSync(filePath, 'utf8');
const lines = src.split('\n');

// ── Parse: find section and lesson boundaries ──

// Find curriculum array boundaries
const arrStartLine = lines.findIndex(l => l.startsWith('export const curriculum'));
let arrEndLine = -1;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i] === ']') { arrEndLine = i; break; }
}

const header = lines.slice(0, arrStartLine + 1).join('\n');
const tail = lines.slice(arrEndLine).join('\n');

// Find section id lines (4-space indent)
const sectionIdLines = [];
for (let i = arrStartLine; i < arrEndLine; i++) {
  const m = lines[i].match(/^    id: '([^']+)',$/);
  if (m) sectionIdLines.push({ id: m[1], line: i });
}

// Each section starts at `  {` (the line before the id line)
// and ends at the `  },` just before the next section's `  {` (or before arrEndLine)
const sectionRanges = sectionIdLines.map((s, idx) => {
  const start = s.line - 1; // `  {` line
  let end;
  if (idx < sectionIdLines.length - 1) {
    end = sectionIdLines[idx + 1].line - 2; // line before next `  {`
  } else {
    end = arrEndLine - 1; // last line before `]`
  }
  return { id: s.id, start, end };
});

console.log(`Found ${sectionRanges.length} sections:`);
sectionRanges.forEach(s => console.log(`  ${s.id}: lines ${s.start + 1}-${s.end + 1}`));

// ── Parse: find lesson boundaries within each section ──

function parseLessons(sectionLines, globalOffset) {
  const lessons = [];
  const lessonIdLines = [];

  for (let i = 0; i < sectionLines.length; i++) {
    const m = sectionLines[i].match(/^        id: '([^']+)',$/);
    if (m) lessonIdLines.push({ id: m[1], localLine: i });
  }

  for (let idx = 0; idx < lessonIdLines.length; idx++) {
    const l = lessonIdLines[idx];
    const start = l.localLine - 1; // `      {` line

    let end;
    if (idx < lessonIdLines.length - 1) {
      end = lessonIdLines[idx + 1].localLine - 2;
    } else {
      // Last lesson: find `      },` or `      }` going backward from section end
      for (let j = sectionLines.length - 1; j >= l.localLine; j--) {
        if (sectionLines[j].match(/^      \},?$/)) {
          end = j;
          break;
        }
      }
    }

    lessons.push({
      id: l.id,
      text: sectionLines.slice(start, end + 1).join('\n'),
    });
  }

  return lessons;
}

// Build lesson map: sectionId -> [{ id, text }]
const sectionMap = {};
for (const range of sectionRanges) {
  const sectionLines = lines.slice(range.start, range.end + 1);
  sectionMap[range.id] = {
    range,
    lessons: parseLessons(sectionLines, range.start),
  };
}

// Debug: verify all lessons found
let totalLessons = 0;
for (const [sid, data] of Object.entries(sectionMap)) {
  console.log(`\n  ${sid} (${data.lessons.length} lessons):`);
  data.lessons.forEach(l => console.log(`    - ${l.id}`));
  totalLessons += data.lessons.length;
}
console.log(`\nTotal lessons found: ${totalLessons}`);

// ── Build: helper to get a lesson by sectionId::lessonId ──

function getLesson(sectionId, lessonId) {
  const section = sectionMap[sectionId];
  if (!section) throw new Error(`Section not found: ${sectionId}`);
  const lesson = section.lessons.find(l => l.id === lessonId);
  if (!lesson) throw new Error(`Lesson not found: ${sectionId}::${lessonId}`);
  return lesson.text;
}

// ── Build: define new structure ──

const newStructure = [
  {
    id: 'basic-vim',
    title: 'Basics',
    lessons: [
      { from: 'basic-vim', id: 'intro-to-modes' },
      { from: 'basic-vim', id: 'basic-movement' },
      { from: 'basic-vim', id: 'insert-mode' },
      { from: 'insert-like-a-pro', id: 'insert-at-line-ends' },
      { from: 'insert-like-a-pro', id: 'opening-new-lines' },
      { from: 'insert-like-a-pro', id: 'making-small-edits' },
    ],
  },
  {
    id: 'basic-operators',
    title: 'Core Editing',
    lessons: [
      { from: 'essential-motions', id: 'moving-by-words' },
      { from: 'basic-operators', id: 'intro-to-operators' },
      { from: 'basic-operators', id: 'delete-words' },
      { from: 'basic-operators', id: 'change-words' },
      { from: 'basic-operators', id: 'copy-paste-lines' },
    ],
  },
  {
    id: 'advanced-vertical-movement',
    title: 'Line Control',
    lessons: [
      { from: 'essential-motions', id: 'moving-to-line-ends' },
      { from: 'advanced-vertical-movement', id: 'absolute-line-jumps' },
      { from: 'basic-operators', id: 'delete-lines' },
      { from: 'basic-operators', id: 'delete-multiple-lines' },
    ],
  },
  {
    id: 'essential-motions',
    title: 'Precise Movement',
    lessons: [
      { from: 'essential-motions', id: 'find-character' },
      { from: 'essential-motions', id: 'till-character' },
      { from: 'advanced-vertical-movement', id: 'relative-line-jumps' },
    ],
  },
  {
    id: 'text-objects',
    title: 'Text Objects',
    lessons: [
      { from: 'text-objects-brackets', id: 'intro-to-text-objects' },
      { from: 'text-objects-brackets', id: 'delete-inside-brackets' },
      { from: 'text-objects-brackets', id: 'delete-around-brackets' },
      { from: 'text-objects-brackets', id: 'change-inside-brackets' },
      { from: 'text-objects-brackets', id: 'change-around-brackets' },
      { from: 'text-objects-brackets', id: 'brackets-review' },
      { from: 'text-objects-quotes', id: 'delete-inside-quotes' },
      { from: 'text-objects-quotes', id: 'delete-around-quotes' },
      { from: 'text-objects-quotes', id: 'change-inside-quotes' },
      { from: 'text-objects-quotes', id: 'change-around-quotes' },
      { from: 'text-objects-words', id: 'delete-inside-word' },
      { from: 'text-objects-words', id: 'delete-around-word' },
      { from: 'text-objects-words', id: 'change-inside-word' },
      { from: 'text-objects-paragraphs', id: 'delete-inside-paragraph' },
      { from: 'text-objects-paragraphs', id: 'delete-around-paragraph' },
      { from: 'text-objects-paragraphs', id: 'change-inside-paragraph' },
    ],
  },
  {
    id: 'search',
    title: 'Search',
    lessons: [
      { from: 'search', id: 'search' },
      { from: 'search', id: 'repeat-search' },
      { from: 'search', id: 'quick-word-search' },
      { from: 'search', id: 'search-review' },
    ],
  },
  {
    id: 'visual-mode',
    title: 'Visual Mode',
    lessons: [
      { from: 'visual-mode', id: 'intro-to-visual-mode' },
      { from: 'visual-mode', id: 'visual-mode-operators' },
      { from: 'visual-mode', id: 'visual-line-mode' },
      { from: 'visual-mode', id: 'visual-line-operators' },
      { from: 'visual-mode', id: 'switch-selection-ends' },
      { from: 'visual-mode', id: 'switch-visual-line-ends' },
    ],
  },
  {
    id: 'advanced-navigation',
    title: 'Advanced Navigation',
    lessons: [
      { from: 'advanced-vertical-movement', id: 'paragraph-jumps' },
      { from: 'advanced-vertical-movement', id: 'window-scrolls' },
    ],
  },
  {
    id: 'undo-redo',
    title: 'Undo & Redo',
    lessons: [
      { from: 'undo-redo', id: 'undo-redo' },
      { from: 'undo-redo', id: 'undo-line-changes' },
    ],
  },
  {
    id: 'marks-and-jumps',
    title: 'Marks & Jumps',
    lessons: [
      { from: 'marks-and-jumps', id: 'setting-marks' },
      { from: 'marks-and-jumps', id: 'jump-list' },
    ],
  },
  {
    id: 'command-mode',
    title: 'Command Mode',
    lessons: [],
  },
];

// ── Verify: all kept lessons are accounted for ──

const removedLessons = new Set([
  'basic-vim::moving-by-words',
  'text-objects-words::words-review',
  'text-objects-quotes::quotes-review',
  'text-objects-paragraphs::paragraphs-review',
  'text-objects-mega-review::mega-review',
]);

const usedLessons = new Set();
for (const section of newStructure) {
  for (const lesson of section.lessons) {
    usedLessons.add(`${lesson.from}::${lesson.id}`);
  }
}

// Check every current lesson is either used or removed
let missingCount = 0;
for (const [sid, data] of Object.entries(sectionMap)) {
  for (const lesson of data.lessons) {
    const key = `${sid}::${lesson.id}`;
    if (!usedLessons.has(key) && !removedLessons.has(key)) {
      console.error(`ERROR: Lesson ${key} is neither used nor explicitly removed!`);
      missingCount++;
    }
  }
}

if (missingCount > 0) {
  console.error(`\n${missingCount} lesson(s) unaccounted for. Aborting.`);
  process.exit(1);
}

// Check all referenced lessons exist
for (const section of newStructure) {
  for (const lesson of section.lessons) {
    try {
      getLesson(lesson.from, lesson.id);
    } catch (e) {
      console.error(`ERROR: ${e.message}`);
      process.exit(1);
    }
  }
}

console.log('\nValidation passed. All lessons accounted for.');

// ── Generate: build new curriculum.ts ──

function buildSection(sectionDef) {
  const lessonTexts = sectionDef.lessons.map(l => getLesson(l.from, l.id));
  const lessonsBlock = lessonTexts.join('\n');

  return `  {
    id: '${sectionDef.id}',
    title: '${sectionDef.title}',
    lessons: [
${lessonsBlock ? lessonsBlock + '\n' : ''}    ],
  },`;
}

const sectionsOutput = newStructure.map(buildSection).join('\n');
const output = `${header}\n${sectionsOutput}\n${tail}\n`;

fs.writeFileSync(filePath, output);
console.log(`\nWrote ${output.split('\n').length} lines to ${filePath}`);

// ── Summary ──

const newLessonCount = newStructure.reduce((sum, s) => sum + s.lessons.length, 0);
console.log(`\nNew structure: ${newStructure.length} sections, ${newLessonCount} lessons`);
console.log(`Removed: ${removedLessons.size} lessons`);
console.log(`Original: ${sectionRanges.length} sections, ${totalLessons} lessons`);
