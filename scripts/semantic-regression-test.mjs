import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import matter from 'gray-matter';

const root = resolve(import.meta.dirname, '..');
const contentDir = resolve(root, 'src/content/daily');
const files = readdirSync(contentDir).filter((file) => file.endsWith('.md')).sort();

function run(script, args) {
  return spawnSync(process.execPath, [resolve(root, script), ...args], {
    cwd: root,
    encoding: 'utf8',
  });
}

function assertCurrentContentSemantics() {
  const pairs = new Map();
  for (const file of files) {
    const match = file.match(/^(\d{4}-\d{2}-\d{2})\.(zh|en)\.md$/);
    assert(match, `${file} must use the bilingual daily filename convention`);
    const [, date, language] = match;
    const { data, content } = matter(readFileSync(resolve(contentDir, file), 'utf8'));
    assert.equal(typeof data.datePT, 'string', `${file} datePT must remain a calendar string`);
    assert.equal(data.datePT, date, `${file} datePT must equal its route date`);
    assert(!/^#\s+/m.test(content), `${file} body must not render a second H1`);
    const pair = pairs.get(date) ?? {};
    pair[language] = data.categories;
    pairs.set(date, pair);
  }

  for (const [date, pair] of pairs) {
    assert(pair.zh && pair.en, `${date} must have both languages`);
    assert.deepEqual(pair.zh, pair.en, `${date} must reuse exactly the same topics in both languages`);
  }
}

function fixtureBody(title, lead) {
  return `# ${title}\n\n${lead}\n\n## Signal one\n\n${'Traceable analysis of this model, product, API, security, and policy signal. '.repeat(14)}\n\nSources:\n- https://example.com/one\n- https://example.com/two\n- https://example.com/three\n`;
}

function assertPairedImportTransaction() {
  const fixture = mkdtempSync(resolve(tmpdir(), 'concitech-ai-daily-import-'));
  try {
    const source = resolve(fixture, 'source');
    const destination = resolve(fixture, 'destination');
    const completeDate = '2030-02-03';
    const completeDirectory = resolve(source, `${completeDate}-pt`);
    mkdirSync(completeDirectory, { recursive: true });
    writeFileSync(resolve(completeDirectory, 'daily.md'), fixtureBody('中文日报测试标题', '这是一段关于模型、产品、研究、开发工具、商业、政策与安全的完整导语。'));
    writeFileSync(resolve(completeDirectory, 'daily.en.md'), fixtureBody('English daily fixture title', 'A complete bilingual lead about agent infrastructure and releases.'));

    const imported = run('scripts/import-daily.mjs', [
      `--source=${source}`,
      `--destination=${destination}`,
      `--date=${completeDate}`,
    ]);
    assert.equal(imported.status, 0, imported.stderr || imported.stdout);

    const zhTarget = resolve(destination, `${completeDate}.zh.md`);
    const enTarget = resolve(destination, `${completeDate}.en.md`);
    const zh = matter(readFileSync(zhTarget, 'utf8'));
    const en = matter(readFileSync(enTarget, 'utf8'));
    assert.equal(zh.data.datePT, completeDate);
    assert.equal(en.data.datePT, completeDate);
    assert.deepEqual(zh.data.categories, en.data.categories, 'one shared topics calculation must feed both outputs');
    assert(!/^#\s+/m.test(zh.content) && !/^#\s+/m.test(en.content), 'import must strip the duplicated source H1');
    assert.equal(readdirSync(destination).filter((name) => name.startsWith('.daily-import-')).length, 0, 'staging files must be cleaned up');

    const incompleteDate = '2030-02-04';
    const incompleteDirectory = resolve(source, `${incompleteDate}-pt`);
    mkdirSync(incompleteDirectory, { recursive: true });
    writeFileSync(resolve(incompleteDirectory, 'daily.md'), fixtureBody('只有中文的日报标题', '这份来源缺少非空英文版本。'));
    writeFileSync(resolve(incompleteDirectory, 'daily.en.md'), '   \n');
    const rejected = run('scripts/import-daily.mjs', [
      `--source=${source}`,
      `--destination=${destination}`,
      `--date=${incompleteDate}`,
    ]);
    assert.notEqual(rejected.status, 0, 'an incomplete or empty source pair must be rejected');
    assert(!readdirSync(destination).some((name) => name.startsWith(incompleteDate)), 'rejection must not leave an orphan target');
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

function validFixture(date, language, categories, datePT = `"${date}"`) {
  const title = language === 'zh' ? '用于验证双语主题一致性的日报标题' : 'A daily title for validating bilingual topic parity';
  const description = language === 'zh'
    ? '这是一段足够长的验证描述，用于确认双语主题严格一致且日期保留日历语义。'
    : 'A sufficiently long description that verifies strict topic parity and calendar-date semantics.';
  const body = `${'Substantive traceable daily analysis without a duplicate level-one heading. '.repeat(12)}\n\n- https://example.com/one\n- https://example.com/two\n- https://example.com/three`;
  return `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\ndatePT: ${datePT}\npublishedAtCST: "2030-02-04T13:00:00+08:00"\nlanguage: ${language}\nauthor: ${JSON.stringify(language === 'zh' ? 'Concitech AI 编辑部' : 'Concitech AI Editorial')}\ncategories: [${categories.join(', ')}]\ncover: "/covers/2026-08-11-${language}.webp"\nsourceFile: "fixture/daily${language === 'en' ? '.en' : ''}.md"\nitemCount: 1\ndraft: false\n---\n${body}\n`;
}

function assertValidatorRejectsSemanticDrift() {
  const fixture = mkdtempSync(resolve(tmpdir(), 'concitech-ai-daily-validate-'));
  try {
    const parityDir = resolve(fixture, 'parity');
    mkdirSync(parityDir);
    writeFileSync(resolve(parityDir, '2030-02-03.zh.md'), validFixture('2030-02-03', 'zh', ['models', 'products']));
    writeFileSync(resolve(parityDir, '2030-02-03.en.md'), validFixture('2030-02-03', 'en', ['models']));
    const parity = run('scripts/validate-content.mjs', [`--content-dir=${parityDir}`]);
    assert.notEqual(parity.status, 0, 'validator must reject bilingual topics drift');
    assert.match(parity.stderr, /bilingual categories must match exactly/);

    const dateDir = resolve(fixture, 'date');
    mkdirSync(dateDir);
    writeFileSync(resolve(dateDir, '2030-02-03.zh.md'), validFixture('2030-02-03', 'zh', ['models'], '2030-02-03'));
    writeFileSync(resolve(dateDir, '2030-02-03.en.md'), validFixture('2030-02-03', 'en', ['models'], '2030-02-03'));
    const calendarDate = run('scripts/validate-content.mjs', [`--content-dir=${dateDir}`]);
    assert.notEqual(calendarDate.status, 0, 'validator must reject YAML-coerced datePT values');
    assert.match(calendarDate.stderr, /datePT must remain a quoted YYYY-MM-DD calendar value/);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

assertCurrentContentSemantics();
assertPairedImportTransaction();
assertValidatorRejectsSemanticDrift();
console.log(`Semantic regression test passed: ${files.length} content files plus paired import and negative validation fixtures.`);
