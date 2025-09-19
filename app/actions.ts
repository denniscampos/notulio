'use server';
import { api } from '@/convex/_generated/api';
import { getToken } from '@/lib/auth-server';
import { getArticleMetadata } from '@/lib/firecrawl';
import { fetchMutation } from 'convex/nextjs';
import { revalidatePath } from 'next/cache';

interface FlashcardResponse {
  flashcards: Array<{
    question: string;
    answer: string;
  }>;
  tags: Array<string>;
}

export async function createArticleMetadata({ url = '' }: { url: string }) {
  const articleMetadata = await getArticleMetadata({
    url,
    formats: ['summary', 'markdown'],
  });

  const response = await fetch('http://localhost:3000/api/flashcard', {
    method: 'POST',
    body: JSON.stringify({
      title: articleMetadata.title,
      description: articleMetadata.description,
      content: articleMetadata.body,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = (await response.json()) as FlashcardResponse;

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
        flashcards: data.flashcards,
        tags: data.tags,
      },
      { token }
    );
    revalidatePath('/');
  } catch (error) {
    console.error(error);
  }
}
