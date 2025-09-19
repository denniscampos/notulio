import { z } from 'zod';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';

const FlashCardSchema = z.object({
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

export async function POST(req: Request) {
  const { title, description, content } = await req.json();

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
  
  Return JSON in this format:
  {
    "flashcards": [
      { "question": "...", "answer": "..." }
    ],
    "reflection": "...",
    "tags": ["...", "..."]
  }
  `;

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: FlashCardSchema,
    prompt,
  });

  return Response.json(object);
}
