'use server';
import { api } from '@/convex/_generated/api';
import { getToken } from '@/lib/auth-server';
import { getArticleMetadata } from '@/lib/firecrawl';
import { fetchMutation } from 'convex/nextjs';
import { revalidatePath } from 'next/cache';

export async function createArticleMetadata({ url = '' }: { url: string }) {
  //TODO: Add ServerActionResult;
  // 1) Get scrape info
  const articleMetadata = await getArticleMetadata({
    url,
    formats: ['summary', 'markdown'],
  });
  // 2) OpenAI to digest information and create flashcards.
  // await createFlashcards
  // 3) Send info to convex DB.
  try {
    const token = await getToken();
    await fetchMutation(
      api.mutations.createArticle,
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
