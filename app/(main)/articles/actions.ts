'use server';

import { api } from '@/convex/_generated/api';
import { getToken } from '@/lib/auth-server';
import { getArticleMetadata } from '@/lib/firecrawl';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { fetchMutation } from 'convex/nextjs';
import { revalidatePath } from 'next/cache';
import z from 'zod';

const articleInsightsSchema = z.object({
  flashcards: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
  tags: z
    .array(z.string())
    .describe('short keywords, lowercase, hyphen-separated'),
});

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
  images: string[];
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

  const data = await createArticleInsights({ title, description, content });

  // Cache the result
  flashcardCache.set(cacheKey, data);

  return data;
}

export async function extractArticleMetadata({ url }: { url: string }) {
  const token = await getToken();
  if (!token) {
    throw new Error('Unauthorized');
  }

  const articleMetadata = await getArticleMetadata({
    url,
    formats: ['summary', 'markdown', 'images'],
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
    tags: data.tags.join(', '),
    // Include the complete AI data to avoid reprocessing
    _aiData: {
      body: articleMetadata.body,
      flashcards: data.flashcards,
      generatedTags: data.tags,
      images: articleMetadata.images,
    },
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
    selectedImages?: string[]; // user-selected images
    _aiData?: {
      body?: string;
      flashcards: Array<{ question: string; answer: string }>;
      generatedTags: Array<string>;
      images?: string[]; // all available images from extraction
    };
  },
  options?: { skipAiProcessing?: boolean }
) {
  const token = await getToken();
  if (!token) {
    throw new Error('Unauthorized');
  }

  // Convert comma-separated tags to array for database
  const tagStrings = articleData.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  let articleMetadata: ArticleMetadata | null = null;
  let data: FlashcardResponse = { flashcards: [], tags: [] };

  // Use pre-computed AI data if available (from AI Fill)
  if (articleData._aiData) {
    data = {
      flashcards: articleData._aiData.flashcards,
      tags: articleData._aiData.generatedTags,
    };
    articleMetadata = {
      title: articleData.title,
      author: articleData.author,
      description: articleData.description,
      summary: articleData.aiSummary,
      body: articleData._aiData.body,
      images: articleData._aiData.images || [],
    };
  } else if (!options?.skipAiProcessing) {
    // Get article body content for flashcard generation (we still need the body for processing)
    articleMetadata = await getArticleMetadata({
      url: articleData.url,
      formats: ['summary', 'markdown', 'images'],
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
        images: articleData.selectedImages, // Only save user-selected images
      },
      { token }
    );
    revalidatePath('/articles');
  } catch (error) {
    console.error(error);
  }
}

export async function createArticleInsights({
  title,
  description,
  content,
}: {
  title: string;
  description: string;
  content: string;
}) {
  const token = await getToken();
  if (!token) {
    throw new Error('Unauthorized');
  }
  const prompt = `
  You are an assistant that generates concise learning aids.
  
  Given a page with:
  Title: "${title}"
  Description: "${description}"
  Content: """${content || 'Content unavailable'}"""
  
  Tasks:
  1. Generate 5–10 Q&A flashcards depending on the length of the article.
     - Questions should be clear and concise.
     - Answers should be short (1–3 sentences max).
     - Focus on key ideas, definitions, or takeaways.
  
  2. Suggest 1 reflection question that connects this article to broader knowledge or real-world applications.
     - It should encourage critical thinking, not be fact recall.
  
  3. Suggest 3–5 topical tags for this article.
     - Tags must be short, simple labels suitable for human tagging.
     - Prefer ONE word; allow TWO words only if very common (e.g. "machine learning").
     - No symbols, no hyphens, no jargon, no academic phrases.
     - Use lowercase.
     - Think of tags like those seen on blogs or news sites.
     - Examples:
       Good: ["database", "css", "technews", "women", "games"]
       Acceptable 2 words: ["machine learning", "climate change"]
       Bad: ["database management", "query-operations", "technical-process"]
  4. Write a 2-3 sentence neutral summary.
  
  Return JSON in this format:
  {
    "summary: "...",
    "flashcards": [
      { "question": "...", "answer": "..." }
    ],
    "reflection": "...",
    "tags": ["...", "..."]
  }
  `;

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: articleInsightsSchema,
    prompt,
  });

  return object;
}
