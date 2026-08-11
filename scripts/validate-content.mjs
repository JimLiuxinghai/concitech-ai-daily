import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import matter from 'gray-matter';

const root = resolve(import.meta.dirname, '..');
const contentDir = resolve(root, 'src/content/daily');
const validCategories = new Set(['models', 'products', 'research', 'devtools', 'business', 'policy', 'security']);
const filenamePattern = /^(\d{4}-\d{2}-\d{2})\.(zh|en)\.md$/;
const forbiddenHtml = /<(script|iframe|object|embed|form|style)\b/i;
const errors = [];
const editions = new Map();

function fail(file, message) {
  errors.push(`${file}: ${message}`);
}

const files = readdirSync(contentDir).filter((name) => name.endsWith('.md')).sort();
for (const file of files) {
  const match = file.match(filenamePattern);
  if (!match) {
    fail(file, 'filename must be YYYY-MM-DD.zh.md or YYYY-MM-DD.en.md');
    continue;
  }

  const [, filenameDate, filenameLanguage] = match;
  const { data, content } = matter(readFileSync(resolve(contentDir, file), 'utf8'));
  const datePT = data.datePT instanceof Date ? data.datePT.toISOString().slice(0, 10) : String(data.datePT ?? '');
  const required = ['title', 'description', 'datePT', 'publishedAtCST', 'language', 'author', 'categories', 'cover', 'sourceFile', 'itemCount'];
  for (const field of required) if (data[field] === undefined || data[field] === '') fail(file, `missing frontmatter field "${field}"`);

  if (datePT !== filenameDate) fail(file, `datePT ${datePT || '(empty)'} does not match filename date ${filenameDate}`);
  if (data.language !== filenameLanguage) fail(file, `language ${data.language ?? '(empty)'} does not match filename language ${filenameLanguage}`);
  if (typeof data.title !== 'string' || data.title.trim().length < 8) fail(file, 'title must contain at least 8 characters');
  if (typeof data.description !== 'string' || data.description.trim().length < 30 || data.description.length > 220) fail(file, 'description must be 30–220 characters');
  if (!Array.isArray(data.categories) || data.categories.length === 0 || data.categories.some((item) => !validCategories.has(item))) fail(file, 'categories must contain only approved category IDs');
  if (!Number.isInteger(data.itemCount) || data.itemCount < 1) fail(file, 'itemCount must be a positive integer');
  if (Number.isNaN(new Date(data.publishedAtCST).getTime())) fail(file, 'publishedAtCST must be a valid ISO date');
  if (content.trim().length < 700) fail(file, 'body is too short for a daily edition (minimum 700 characters)');
  if (forbiddenHtml.test(content) || /\]\(\s*javascript:/i.test(content)) fail(file, 'body contains unsafe HTML or a javascript: URL');

  const externalLinks = [...content.matchAll(/https?:\/\/[^\s)>]+/g)].map((item) => item[0]);
  if (externalLinks.length < 3) fail(file, 'body must include at least three traceable source links');

  if (typeof data.cover === 'string') {
    if (!data.cover.startsWith('/covers/') || !data.cover.endsWith('.webp')) fail(file, 'cover must be a WebP path under /covers/');
    else if (!existsSync(resolve(root, 'public', data.cover.slice(1)))) fail(file, `cover not found at public${data.cover}`);
  }

  const pair = editions.get(filenameDate) ?? new Set();
  pair.add(filenameLanguage);
  editions.set(filenameDate, pair);
}

for (const [date, languages] of editions) {
  if (!languages.has('zh') || !languages.has('en')) fail(date, 'edition is incomplete; both zh and en files are required');
}

if (errors.length > 0) {
  console.error(`Content validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Content validation passed: ${editions.size} bilingual edition(s), ${files.length} file(s).`);
