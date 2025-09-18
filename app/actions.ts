'use server';
import { api } from '@/convex/_generated/api';
import { getToken } from '@/lib/auth-server';
import { getArticleMetadata } from '@/lib/firecrawl';
import { fetchMutation } from 'convex/nextjs';
import { revalidatePath } from 'next/cache';

export async function createArticleMetadata({ url = '' }: { url: string }) {
  // 1) Get scrape info
  const articleMetadata = await getArticleMetadata({
    url,
    formats: ['summary', 'markdown'],
  });
  // 2) OpenAI to digest information and create flashcards.
  const flashcards = await fetch('http://localhost:3000/api/flashcard', {
    method: 'POST',
    body: JSON.stringify({
      title: articleMetadata.title,
      description: articleMetadata.description,
      content: articleMetadata.body,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  console.log('flashcards: ', await flashcards.json());
  // 3) Send info to convex DB.
  try {
    const token = await getToken();
    await fetchMutation(
      api.articles.createArticle,
      {
        url,
        title: articleMetadata.title,
        description: articleMetadata.description,
        aiSummary: articleMetadata.summary,
        author: articleMetadata.author,
        body: articleMetadata.body,
      },
      { token }
    );
    revalidatePath('/');
  } catch (error) {
    console.error(error);
  }
}
