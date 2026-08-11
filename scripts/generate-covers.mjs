import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const contentDir = resolve(root, 'src/content/daily');
const coverDir = resolve(root, 'public/covers');
const requestedDate = process.argv.find((arg) => arg.startsWith('--date='))?.split('=')[1];

function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

function wrapTitle(title, language) {
  const limit = language === 'zh' ? 13.2 : 25;
  const units = language === 'zh'
    ? title.match(/\s*[A-Za-z0-9][A-Za-z0-9.+/-]*|\s*[\u3400-\u9fff]|\s*[^\s]/gu) ?? [...title]
    : title.split(/\s+/);
  const lines = [];
  let line = '';
  let lineWidth = 0;
  for (const unit of units) {
    const cleanUnit = language === 'zh' ? unit : `${line ? ' ' : ''}${unit}`;
    const visible = cleanUnit.trim();
    const unitWidth = language === 'zh' && /^[A-Za-z0-9]/.test(visible)
      ? Math.max(1, visible.length * 0.58)
      : visible.length;
    if (lineWidth + unitWidth > limit && line.trim()) {
      lines.push(line.trim());
      line = cleanUnit.trimStart();
      lineWidth = unitWidth;
      if (lines.length === 3) {
        lines[2] = `${lines[2].replace(/[，,、；;：:]$/u, '')}…`;
        return lines;
      }
    } else {
      line += cleanUnit;
      lineWidth += unitWidth;
    }
  }
  if (lines.length < 3 && line.trim()) lines.push(line.trim());
  return lines.slice(0, 3);
}

mkdirSync(coverDir, { recursive: true });
const files = readdirSync(contentDir).filter((file) => /\.((zh)|(en))\.md$/.test(file) && (!requestedDate || file.startsWith(requestedDate)));
for (const file of files) {
  const { data } = matter(readFileSync(resolve(contentDir, file), 'utf8'));
  const language = data.language;
  const date = basename(file).slice(0, 10);
  const lines = wrapTitle(data.title, language);
  const lineMarkup = lines.map((line, index) => `<text x="72" y="${240 + index * 92}" class="title">${escapeXml(line)}</text>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#1557ff"/>
    <rect x="0" y="0" width="1200" height="25" fill="#101820"/>
    <rect x="0" y="605" width="1200" height="25" fill="#101820"/>
    <path d="M970 25h230v580H970z" fill="#0f46d3"/>
    <path d="M1005 82h130M1005 118h130M1005 154h130" stroke="#86a4ff" stroke-width="2"/>
    <style>.mono{font:500 26px monospace;letter-spacing:4px}.title{font:700 ${language === 'zh' ? 60 : 58}px Georgia,serif;fill:#f4f0e7}.date{font:700 56px monospace;fill:#f4f0e7}</style>
    <text x="72" y="91" class="mono" fill="#f4f0e7">CONCITECH AI ${language === 'zh' ? '日报' : 'DAILY'}</text>
    ${lineMarkup}
    <text x="1005" y="520" class="date">${escapeXml(date.slice(5).replace('-', '/'))}</text>
    <circle cx="1081" cy="565" r="12" fill="#ff5b35"/>
  </svg>`;
  const target = resolve(coverDir, `${date}-${language}.webp`);
  await sharp(Buffer.from(svg)).webp({ quality: 90, effort: 5 }).toFile(target);
  console.log(`Generated ${target}`);
}
