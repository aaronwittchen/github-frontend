import colorsData from './colors.json';

export const languageColors: Record<string, string> = Object.fromEntries(
  Object.entries(colorsData)
    .filter(([_, data]) => data.color)
    .map(([language, data]) => [language, data.color!]),
);

export function getLanguageColor(language: string | null): string {
  if (!language) return '#cccccc';
  return languageColors[language] || '#cccccc';
}

// Define most searched languages
export const mostSearchedLanguages: string[] = [
  'C',
  'C++',
  'C#',
  'Java',
  'Python',
  'Go',
  'Rust',
  'Ruby',
  'PHP',
  'Kotlin',
  'Swift',
  'Dart',
  'TypeScript',
  'JavaScript',
];

// Compute others dynamically from colorsData, excluding most searched
export const otherLanguages: string[] = Object.keys(colorsData)
  .filter((lang) => !mostSearchedLanguages.includes(lang))
  .sort(); // optional alphabetical sort
