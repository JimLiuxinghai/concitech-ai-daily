import rss from '@astrojs/rss';
import { SITE } from '../data/site';
import { articlePath, editionPath, getArticles, getDaily } from '../lib/content';

export async function GET(context: { site: URL }) {
  const entries = await getDaily('zh');
  const articles = await getArticles();
  const items = [
    ...entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.publishedAtCST,
      link: editionPath('zh', entry.data.datePT),
      author: entry.data.author,
      categories: entry.data.categories,
    })),
    ...articles.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.publishedAtCST,
      link: articlePath(entry.data.slug),
      author: entry.data.author,
      categories: entry.data.categories,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  return rss({
    title: SITE.zhName,
    description: '每日一份克制、可追溯的 AI 新闻编辑摘要。',
    site: context.site,
    items,
    customData: '<language>zh-CN</language>',
  });
}
