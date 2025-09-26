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

interface ArticleMetadata {
  title: string;
  author: string;
  description: string;
  summary: string | undefined;
  body: string | undefined;
}

// Cache to avoid duplicate API calls
const flashcardCache = new Map<string, FlashcardResponse>();

async function getFlashcardData(
  title: string,
  description: string,
  content: string
): Promise<FlashcardResponse> {
  // Create cache key from the content
  const cacheKey = `${title}||${description}||${content?.substring(0, 100)}`;

  // Check cache first
  if (flashcardCache.has(cacheKey)) {
    return flashcardCache.get(cacheKey)!;
  }

  // Make API call
  const response = await fetch(`${process.env.SITE_URL}/api/flashcard`, {
    method: 'POST',
    body: JSON.stringify({
      title,
      description,
      content,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = (await response.json()) as FlashcardResponse;

  // Cache the result
  flashcardCache.set(cacheKey, data);

  return data;
}

export async function extractArticleMetadata({ url }: { url: string }) {
  const articleMetadata = await getArticleMetadata({
    url,
    formats: ['summary', 'markdown'],
  });

  // Generate tags and flashcards (cached)
  const data = await getFlashcardData(
    articleMetadata.title,
    articleMetadata.description || '',
    articleMetadata.body || ''
  );

  return {
    title: articleMetadata.title,
    author: articleMetadata.author,
    description: articleMetadata.description,
    summary: articleMetadata.summary,
    tags: data.tags.join(', '), // Convert tags array to comma-separated string
  };
}

export async function createArticleMetadata(
  articleData: {
    url: string;
    title: string;
    author: string;
    description: string;
    aiSummary: string;
    tags: string; // comma-separated string
  },
  options?: { skipAiProcessing?: boolean }
) {
  // Convert comma-separated tags to array for database
  const tagStrings = articleData.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  let articleMetadata: ArticleMetadata | null = null;
  let data: FlashcardResponse = { flashcards: [], tags: [] };

  if (!options?.skipAiProcessing) {
    // Get article body content for flashcard generation (we still need the body for processing)
    articleMetadata = await getArticleMetadata({
      url: articleData.url,
      formats: ['summary', 'markdown'],
    });

    // Generate flashcards and tags (use cache if available)
    data = await getFlashcardData(
      articleData.title,
      articleData.description,
      articleMetadata.body || ''
    );
  }

  // Merge user-selected tags with AI-generated tags
  const allTags = [...new Set([...tagStrings, ...data.tags])];

  try {
    const token = await getToken();
    await fetchMutation(
      api.articles.createArticle,
      {
        url: articleData.url,
        title: articleData.title,
        description: articleData.description,
        aiSummary: articleData.aiSummary || articleMetadata?.summary, // Use provided summary or fallback
        author: articleData.author,
        body: articleMetadata?.body, // Still save the body but don't expose it in the form
        flashcards: data.flashcards,
        tags: allTags,
      },
      { token }
    );
    revalidatePath('/articles');
  } catch (error) {
    console.error(error);
  }
}
