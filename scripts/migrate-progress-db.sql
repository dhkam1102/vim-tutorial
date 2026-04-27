-- Curriculum restructure: update sectionId for moved lessons
-- Run against the MySQL database after deploying the new curriculum
-- Safe to run multiple times (idempotent via WHERE clause)

-- insert-like-a-pro → basic-vim
UPDATE UserProgress SET sectionId = 'basic-vim' WHERE sectionId = 'insert-like-a-pro' AND lessonId = 'insert-at-line-ends';
UPDATE UserProgress SET sectionId = 'basic-vim' WHERE sectionId = 'insert-like-a-pro' AND lessonId = 'opening-new-lines';
UPDATE UserProgress SET sectionId = 'basic-vim' WHERE sectionId = 'insert-like-a-pro' AND lessonId = 'making-small-edits';

-- essential-motions → core-editing / line-control
UPDATE UserProgress SET sectionId = 'core-editing' WHERE sectionId = 'essential-motions' AND lessonId = 'moving-by-words';
UPDATE UserProgress SET sectionId = 'line-control' WHERE sectionId = 'essential-motions' AND lessonId = 'moving-to-line-ends';

-- basic-operators → line-control
UPDATE UserProgress SET sectionId = 'line-control' WHERE sectionId = 'basic-operators' AND lessonId = 'delete-lines';
UPDATE UserProgress SET sectionId = 'line-control' WHERE sectionId = 'basic-operators' AND lessonId = 'delete-multiple-lines';

-- advanced-vertical-movement → precise-movement / advanced-navigation
UPDATE UserProgress SET sectionId = 'precise-movement' WHERE sectionId = 'advanced-vertical-movement' AND lessonId = 'relative-line-jumps';
UPDATE UserProgress SET sectionId = 'advanced-navigation' WHERE sectionId = 'advanced-vertical-movement' AND lessonId = 'paragraph-jumps';
UPDATE UserProgress SET sectionId = 'advanced-navigation' WHERE sectionId = 'advanced-vertical-movement' AND lessonId = 'window-scrolls';

-- text-objects-brackets → text-objects
UPDATE UserProgress SET sectionId = 'text-objects' WHERE sectionId = 'text-objects-brackets' AND lessonId = 'intro-to-text-objects';
UPDATE UserProgress SET sectionId = 'text-objects' WHERE sectionId = 'text-objects-brackets' AND lessonId = 'delete-inside-brackets';
UPDATE UserProgress SET sectionId = 'text-objects' WHERE sectionId = 'text-objects-brackets' AND lessonId = 'delete-around-brackets';
UPDATE UserProgress SET sectionId = 'text-objects' WHERE sectionId = 'text-objects-brackets' AND lessonId = 'change-inside-brackets';
UPDATE UserProgress SET sectionId = 'text-objects' WHERE sectionId = 'text-objects-brackets' AND lessonId = 'change-around-brackets';
UPDATE UserProgress SET sectionId = 'text-objects' WHERE sectionId = 'text-objects-brackets' AND lessonId = 'brackets-review';

-- text-objects-quotes → text-objects
UPDATE UserProgress SET sectionId = 'text-objects' WHERE sectionId = 'text-objects-quotes' AND lessonId = 'delete-inside-quotes';
UPDATE UserProgress SET sectionId = 'text-objects' WHERE sectionId = 'text-objects-quotes' AND lessonId = 'delete-around-quotes';
UPDATE UserProgress SET sectionId = 'text-objects' WHERE sectionId = 'text-objects-quotes' AND lessonId = 'change-inside-quotes';
UPDATE UserProgress SET sectionId = 'text-objects' WHERE sectionId = 'text-objects-quotes' AND lessonId = 'change-around-quotes';

-- text-objects-words → text-objects
UPDATE UserProgress SET sectionId = 'text-objects' WHERE sectionId = 'text-objects-words' AND lessonId = 'delete-inside-word';
UPDATE UserProgress SET sectionId = 'text-objects' WHERE sectionId = 'text-objects-words' AND lessonId = 'delete-around-word';
UPDATE UserProgress SET sectionId = 'text-objects' WHERE sectionId = 'text-objects-words' AND lessonId = 'change-inside-word';

-- text-objects-paragraphs → text-objects
UPDATE UserProgress SET sectionId = 'text-objects' WHERE sectionId = 'text-objects-paragraphs' AND lessonId = 'delete-inside-paragraph';
UPDATE UserProgress SET sectionId = 'text-objects' WHERE sectionId = 'text-objects-paragraphs' AND lessonId = 'delete-around-paragraph';
UPDATE UserProgress SET sectionId = 'text-objects' WHERE sectionId = 'text-objects-paragraphs' AND lessonId = 'change-inside-paragraph';

-- Section ID renames (catch-all for remaining lessons in renamed sections)
UPDATE UserProgress SET sectionId = 'core-editing' WHERE sectionId = 'basic-operators';
UPDATE UserProgress SET sectionId = 'line-control' WHERE sectionId = 'advanced-vertical-movement';
UPDATE UserProgress SET sectionId = 'precise-movement' WHERE sectionId = 'essential-motions';

-- Orphaned rows from removed lessons (keep for safety, just noting them)
-- basic-vim::moving-by-words (W,B,E duplicate)
-- text-objects-words::words-review
-- text-objects-quotes::quotes-review
-- text-objects-paragraphs::paragraphs-review
-- text-objects-mega-review::mega-review
