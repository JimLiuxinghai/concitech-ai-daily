import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import matter from 'gray-matter';

const root = resolve(import.meta.dirname, '..');
const destination = resolve(root, 'src/content/daily');
const sourceArg = process.argv.find((arg) => arg.startsWith('--source='));
const dateArg = process.argv.find((arg) => arg.startsWith('--date='));
const daysArg = process.argv.find((arg) => arg.startsWith('--days='));
const minimumLinksArg = process.argv.find((arg) => arg.startsWith('--minimum-source-links='));
const overwrite = process.argv.includes('--overwrite');
const sourceRoot = resolve(sourceArg?.split('=')[1] ?? '/Users/yangyilin/docs/ai-list');
const requestedDate = dateArg?.split('=')[1];
const days = Number(daysArg?.split('=')[1] ?? 1);
const minimumSourceLinks = Number(minimumLinksArg?.split('=')[1] ?? 0);

function quote(value) {
  return JSON.stringify(String(value));
}

function nextDayCST(date) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return `${value.toISOString().slice(0, 10)}T13:00:00+08:00`;
}

function categoriesFor(content) {
  const rules = {
    models: /模型|model|benchmark|参数|权重/i,
    products: /产品|发布|功能|应用|助手/i,
    research: /研究|论文|猜想|证明|学术/i,
    devtools: /开发|代码|agent|工具|API|SDK|MCP/i,
    business: /商业|融资|价格|收入|估值|资本/i,
    policy: /政策|政府|法规|诉讼|合规/i,
    security: /安全|漏洞|攻击|风险|网络安全/i,
  };
  const matches = Object.entries(rules).filter(([, pattern]) => pattern.test(content)).map(([id]) => id);
  return matches.length ? matches : ['products'];
}

function descriptionFor(content, fallbackTitle) {
  const body = content.replace(/^# .*$/m, '').replace(/\n#+ .*$/s, '').replace(/\s+/g, ' ').trim();
  const value = body || fallbackTitle;
  return value.length > 180 ? `${value.slice(0, 177).trim()}…` : value;
}

function itemCountFor(content) {
  const numbered = [...content.matchAll(/^##\s+(?:[一二三四五六七八九十]+、|\d+[.、])/gm)].length;
  return numbered || Math.max(1, [...content.matchAll(/^##\s+/gm)].length);
}

const directories = readdirSync(sourceRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}-pt$/.test(entry.name))
  .map((entry) => entry.name)
  .filter((name) => !requestedDate || name === `${requestedDate}-pt`)
  .filter((name) => existsSync(resolve(sourceRoot, name, 'daily.md')))
  .filter((name) => {
    if (minimumSourceLinks === 0) return true;
    const content = readFileSync(resolve(sourceRoot, name, 'daily.md'), 'utf8');
    return (content.match(/https?:\/\/[^\s)>]+/g) ?? []).length >= minimumSourceLinks;
  })
  .sort().reverse().slice(0, days);

let imported = 0;
for (const directory of directories) {
  const date = directory.slice(0, 10);
  const sourceZh = resolve(sourceRoot, directory, 'daily.md');
  const sourceEn = resolve(sourceRoot, directory, 'daily.en.md');
  if (!existsSync(sourceZh)) continue;

  for (const [language, sourceFile] of [['zh', sourceZh], ['en', sourceEn]]) {
    if (!existsSync(sourceFile)) {
      console.warn(`Waiting for ${sourceFile}`);
      continue;
    }
    const parsed = matter(readFileSync(sourceFile, 'utf8'));
    const title = parsed.data.title ?? parsed.content.match(/^#\s+(.+)$/m)?.[1] ?? `Concitech AI Daily — ${date}`;
    const body = parsed.content.replace(/^#\s+.+\n+/, '').trim();
    const target = resolve(destination, `${date}.${language}.md`);
    if (existsSync(target) && !overwrite) {
      console.log(`Skipped existing ${target}`);
      continue;
    }
    const author = language === 'zh' ? 'Concitech AI 编辑部' : 'Concitech AI Editorial';
    const frontmatter = [
      '---',
      `title: ${quote(title)}`,
      `description: ${quote(descriptionFor(body, title))}`,
      `datePT: ${quote(date)}`,
      `publishedAtCST: ${quote(nextDayCST(date))}`,
      `language: ${language}`,
      `author: ${quote(author)}`,
      `categories: [${categoriesFor(body).join(', ')}]`,
      `cover: ${quote(`/covers/${date}-${language}.webp`)}`,
      `sourceFile: ${quote(`ai-list/${directory}/${language === 'zh' ? 'daily.md' : 'daily.en.md'}`)}`,
      `itemCount: ${itemCountFor(body)}`,
      'draft: false',
      '---',
      '',
    ].join('\n');
    writeFileSync(target, `${frontmatter}${body}\n`, 'utf8');
    imported += 1;
    console.log(`Imported ${sourceFile} -> ${target}`);
  }
}

if (directories.length === 0) {
  console.error('No matching PT daily directories found.');
  process.exit(1);
}
console.log(`Import complete: ${imported} file(s).`);
