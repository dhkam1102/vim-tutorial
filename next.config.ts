import type { NextConfig } from "next";

const specificRedirects: { source: string; destination: string }[] = [
  // insert-like-a-pro → basic-vim
  { source: '/lessons/insert-like-a-pro/insert-at-line-ends', destination: '/lessons/basic-vim/insert-at-line-ends' },
  { source: '/lessons/insert-like-a-pro/opening-new-lines', destination: '/lessons/basic-vim/opening-new-lines' },
  { source: '/lessons/insert-like-a-pro/making-small-edits', destination: '/lessons/basic-vim/making-small-edits' },
  // essential-motions lessons that moved to OTHER sections (not precise-movement)
  { source: '/lessons/essential-motions/moving-by-words', destination: '/lessons/core-editing/moving-by-words' },
  { source: '/lessons/essential-motions/moving-to-line-ends', destination: '/lessons/line-control/moving-to-line-ends' },
  // basic-operators lessons that moved to OTHER sections (not core-editing)
  { source: '/lessons/basic-operators/delete-lines', destination: '/lessons/line-control/delete-lines' },
  { source: '/lessons/basic-operators/delete-multiple-lines', destination: '/lessons/line-control/delete-multiple-lines' },
  // advanced-vertical-movement lessons that moved to OTHER sections (not line-control)
  { source: '/lessons/advanced-vertical-movement/relative-line-jumps', destination: '/lessons/precise-movement/relative-line-jumps' },
  { source: '/lessons/advanced-vertical-movement/paragraph-jumps', destination: '/lessons/advanced-navigation/paragraph-jumps' },
  { source: '/lessons/advanced-vertical-movement/window-scrolls', destination: '/lessons/advanced-navigation/window-scrolls' },
  // text-objects-brackets → text-objects
  { source: '/lessons/text-objects-brackets/intro-to-text-objects', destination: '/lessons/text-objects/intro-to-text-objects' },
  { source: '/lessons/text-objects-brackets/delete-inside-brackets', destination: '/lessons/text-objects/delete-inside-brackets' },
  { source: '/lessons/text-objects-brackets/delete-around-brackets', destination: '/lessons/text-objects/delete-around-brackets' },
  { source: '/lessons/text-objects-brackets/change-inside-brackets', destination: '/lessons/text-objects/change-inside-brackets' },
  { source: '/lessons/text-objects-brackets/change-around-brackets', destination: '/lessons/text-objects/change-around-brackets' },
  { source: '/lessons/text-objects-brackets/brackets-review', destination: '/lessons/text-objects/brackets-review' },
  // text-objects-quotes → text-objects
  { source: '/lessons/text-objects-quotes/delete-inside-quotes', destination: '/lessons/text-objects/delete-inside-quotes' },
  { source: '/lessons/text-objects-quotes/delete-around-quotes', destination: '/lessons/text-objects/delete-around-quotes' },
  { source: '/lessons/text-objects-quotes/change-inside-quotes', destination: '/lessons/text-objects/change-inside-quotes' },
  { source: '/lessons/text-objects-quotes/change-around-quotes', destination: '/lessons/text-objects/change-around-quotes' },
  // text-objects-words → text-objects
  { source: '/lessons/text-objects-words/delete-inside-word', destination: '/lessons/text-objects/delete-inside-word' },
  { source: '/lessons/text-objects-words/delete-around-word', destination: '/lessons/text-objects/delete-around-word' },
  { source: '/lessons/text-objects-words/change-inside-word', destination: '/lessons/text-objects/change-inside-word' },
  // text-objects-paragraphs → text-objects
  { source: '/lessons/text-objects-paragraphs/delete-inside-paragraph', destination: '/lessons/text-objects/delete-inside-paragraph' },
  { source: '/lessons/text-objects-paragraphs/delete-around-paragraph', destination: '/lessons/text-objects/delete-around-paragraph' },
  { source: '/lessons/text-objects-paragraphs/change-inside-paragraph', destination: '/lessons/text-objects/change-inside-paragraph' },
  // removed lessons → text-objects intro
  { source: '/lessons/text-objects-quotes/quotes-review', destination: '/lessons/text-objects/intro-to-text-objects' },
  { source: '/lessons/text-objects-words/words-review', destination: '/lessons/text-objects/intro-to-text-objects' },
  { source: '/lessons/text-objects-paragraphs/paragraphs-review', destination: '/lessons/text-objects/intro-to-text-objects' },
  { source: '/lessons/text-objects-mega-review/mega-review', destination: '/lessons/text-objects/intro-to-text-objects' },
  { source: '/lessons/basic-vim/moving-by-words', destination: '/lessons/core-editing/moving-by-words' },
];

const sectionRenameRedirects: { source: string; destination: string }[] = [
  { source: '/lessons/basic-operators/:path', destination: '/lessons/core-editing/:path' },
  { source: '/lessons/advanced-vertical-movement/:path', destination: '/lessons/line-control/:path' },
  { source: '/lessons/essential-motions/:path', destination: '/lessons/precise-movement/:path' },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      ...specificRedirects.map(r => ({ ...r, permanent: true as const })),
      ...sectionRenameRedirects.map(r => ({ ...r, permanent: true as const })),
    ];
  },
};

export default nextConfig;
