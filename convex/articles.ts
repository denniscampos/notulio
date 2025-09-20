import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';

export const createArticle = mutation({
  args: {
    url: v.string(),
    title: v.string(),
    author: v.optional(v.string()),
    description: v.optional(v.string()),
    aiSummary: v.optional(v.string()),
    body: v.optional(v.string()),
    tags: v.array(v.string()),
    flashcards: v.array(
      v.object({
        question: v.string(),
        answer: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    return await ctx.db.insert('articles', {
      ...args,
      userId,
    });
  },
});

export const listArticles = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return {
        page: [],
        isDone: true,
        continueCursor: '',
      };
    }

    const userId = identity.subject;

    return await ctx.db
      .query('articles')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .order('desc')
      .paginate(args.paginationOpts);
  },
});
