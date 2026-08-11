import rss from '@astrojs/rss';
import { SITE } from '../../data/site';
import { editionPath, getDaily } from '../../lib/content';

export async function GET(context: { site: URL }) {
  const entries = await getDaily('en');
  return rss({
    title: SITE.enName,
    description: 'A restrained, traceable editorial digest of AI news—daily.',
    site: context.site,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.publishedAtCST,
      link: editionPath('en', entry.data.datePT),
      author: entry.data.author,
      categories: entry.data.categories,
    })),
    customData: '<language>en-US</language>',
  });
}
