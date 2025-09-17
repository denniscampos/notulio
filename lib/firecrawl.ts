import Firecrawl, { FormatOption } from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export async function getArticleMetadata({
  url,
  formats,
}: {
  url: string;
  formats: FormatOption[];
}) {
  const doc = await firecrawl.scrape(url, { formats });
  return {
    title: doc.metadata?.title ?? 'No title found.',
    author: doc.metadata?.author ?? 'No author found.',
    description: doc.metadata?.description ?? 'No description found',
    summary: doc.summary,
  };
}
