import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import matter from 'gray-matter';

const root = resolve(import.meta.dirname, '..');
const contentDir = resolve(root, 'src/content/articles');
const validCategories = new Set(['models', 'products', 'research', 'devtools', 'business', 'policy', 'security']);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const forbiddenHtml = /<(script|iframe|object|embed|form|style)\b/i;
const errors = [];

function fail(file, message) {
  errors.push(`${file}: ${message}`);
}

const files = existsSync(contentDir) ? readdirSync(contentDir).filter((name) => name.endsWith('.md')).sort() : [];
const slugs = new Set();
for (const file of files) {
  const { data, content } = matter(readFileSync(resolve(contentDir, file), 'utf8'));
  const proseOnly = content.replace(/```[\s\S]*?```/g, '');
  const required = ['title', 'description', 'slug', 'publishedAtCST', 'language', 'author', 'categories', 'cover'];
  for (const field of required) if (data[field] === undefined || data[field] === '') fail(file, `missing frontmatter field "${field}"`);

  if (!slugPattern.test(data.slug ?? '')) fail(file, 'slug must use lowercase ASCII words separated by hyphens');
  if (file !== `${data.slug}.md`) fail(file, `filename must match slug (${data.slug}.md)`);
  if (slugs.has(data.slug)) fail(file, `duplicate slug ${data.slug}`);
  slugs.add(data.slug);
  if (data.language !== 'zh') fail(file, 'long-form articles currently support language zh only');
  if (typeof data.title !== 'string' || data.title.trim().length < 8) fail(file, 'title must contain at least 8 characters');
  if (typeof data.description !== 'string' || data.description.trim().length < 30 || data.description.length > 220) fail(file, 'description must be 30–220 characters');
  if (!Array.isArray(data.categories) || data.categories.length === 0 || data.categories.some((item) => !validCategories.has(item))) fail(file, 'categories must contain only approved category IDs');
  if (Number.isNaN(new Date(data.publishedAtCST).getTime())) fail(file, 'publishedAtCST must be a valid ISO date');
  if (content.trim().length < 1200) fail(file, 'body is too short for a long-form article (minimum 1200 characters)');
  if (/^#\s+/m.test(proseOnly)) fail(file, 'body must not repeat the frontmatter title as a level-one heading');
  if (forbiddenHtml.test(content) || /\]\(\s*javascript:/i.test(content)) fail(file, 'body contains unsafe HTML or a javascript: URL');

  if (typeof data.cover === 'string') {
    if (!data.cover.startsWith('/article-covers/') || !data.cover.endsWith('.webp')) fail(file, 'cover must be a WebP path under /article-covers/');
    else if (!existsSync(resolve(root, 'public', data.cover.slice(1)))) fail(file, `cover not found at public${data.cover}`);
  }
}

if (errors.length > 0) {
  console.error(`Article validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Article validation passed: ${files.length} long-form article(s).`);
