const modelContext = document.modelContext;

if (modelContext?.registerTool && !window.__concitechAiWebMCP) {
  const controller = new AbortController();
  window.__concitechAiWebMCP = controller;
  let indexPromise;

  function compact(value, limit) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
  }

  async function loadIndex() {
    indexPromise ||= fetch('/webmcp-content.json', { credentials: 'same-origin' }).then(async (response) => {
      if (!response.ok) throw new Error(`内容索引暂时不可用，HTTP ${response.status}`);
      return response.json();
    });
    return indexPromise;
  }

  function serialize(query, language, contentType, entries) {
    const results = entries.map((entry) => ({
      kind: entry.kind,
      language: entry.language,
      title: compact(entry.title, 100),
      description: compact(entry.description, 150),
      date: entry.date,
      categories: entry.categories,
      url: new URL(entry.url, location.origin).href,
    }));
    const payload = { query: query || null, language, contentType, count: results.length, results };

    while (JSON.stringify(payload).length > 1450 && payload.results.length > 1) payload.results.pop();
    payload.count = payload.results.length;
    return JSON.stringify(payload);
  }

  modelContext.registerTool({
    name: 'find_ai_content',
    description: '查找 Concitech AI 日报的每日版本和中文深度文章，返回日期、栏目、摘要与链接。',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '可选关键词，例如 Claude、模型、研究或安全。' },
        contentType: {
          type: 'string',
          enum: ['all', 'daily', 'article'],
          description: '内容类型，默认 all。',
        },
        language: {
          type: 'string',
          enum: ['current', 'zh', 'en'],
          description: '内容语言，默认跟随当前页面。',
        },
        maxResults: { type: 'integer', minimum: 1, maximum: 5, description: '返回 1 到 5 条结果。' },
      },
    },
    annotations: { readOnlyHint: true, untrustedContentHint: true },
    execute: async ({ query = '', contentType = 'all', language = 'current', maxResults = 5 } = {}) => {
      if (!['all', 'daily', 'article'].includes(contentType)) {
        throw new Error('contentType 必须是 all、daily 或 article。');
      }
      if (!['current', 'zh', 'en'].includes(language)) {
        throw new Error('language 必须是 current、zh 或 en。');
      }
      if (!Number.isInteger(maxResults) || maxResults < 1 || maxResults > 5) {
        throw new Error('maxResults 必须是 1 到 5 之间的整数。');
      }

      const selectedLanguage = language === 'current'
        ? (document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en')
        : language;
      const normalizedQuery = compact(query, 120).toLocaleLowerCase(selectedLanguage === 'zh' ? 'zh-CN' : 'en-US');
      const { entries } = await loadIndex();
      const results = entries.filter((entry) => {
        if (entry.language !== selectedLanguage) return false;
        if (contentType !== 'all' && entry.kind !== contentType) return false;
        if (!normalizedQuery) return true;
        const searchable = `${entry.title} ${entry.description} ${entry.categories.join(' ')}`;
        return searchable.toLocaleLowerCase(selectedLanguage === 'zh' ? 'zh-CN' : 'en-US').includes(normalizedQuery);
      }).slice(0, maxResults);

      return serialize(query, selectedLanguage, contentType, results);
    },
  }, { signal: controller.signal }).catch(() => {
    controller.abort();
    delete window.__concitechAiWebMCP;
  });

  window.addEventListener('pagehide', () => controller.abort(), { once: true });
}
