import { articlePath, editionPath, getArticles, getDaily } from '../lib/content';

export const prerender = true;

export async function GET() {
  const [daily, articles] = await Promise.all([getDaily(), getArticles()]);
  const entries = [
    ...daily.map((entry) => ({
      kind: 'daily' as const,
      language: entry.data.language,
      title: entry.data.title,
      description: entry.data.description,
      date: entry.data.datePT,
      categories: entry.data.categories,
      url: editionPath(entry.data.language, entry.data.datePT),
    })),
    ...articles.map((entry) => ({
      kind: 'article' as const,
      language: entry.data.language,
      title: entry.data.title,
      description: entry.data.description,
      date: entry.data.publishedAtCST.toISOString().slice(0, 10),
      categories: entry.data.categories,
      url: articlePath(entry.data.slug),
    })),
  ];

  return new Response(JSON.stringify({ version: 1, entries }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
    },
  });
}
