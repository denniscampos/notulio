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
  1. Write a 2-3 sentence neutral summary.
  2. Generate 5-10 Q&A flashcards depending on lenght of article.
  3. Suggest 1 reflection question that connects with broader knowledge.
  
  Return JSON following this schema with fields:
  - summary (string)
  - flashcards (array of { question, answer })
  - reflection (string)
  `;

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: FlashCardSchema,
    prompt,
  });

  return Response.json(object);
}
