import { mutation } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';
import { authComponent } from './auth';

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
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      return {
        isDone: true,
        page: [],
        cursor: null,
      };
    }

    const userId = user.subject;

    return await ctx.db
      .query('articles')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .order('desc')
      .paginate(args.paginationOpts);
  },
});

export const updateArticle = mutation({
  args: { id: v.id('articles'), title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const article = await ctx.db.get(args.id);
    if (!article || article.userId !== identity.subject) {
      throw new Error('Article not found or unauthorized');
    }

    await ctx.db.patch(args.id, { title: args.title });
  },
});

export const removeArticle = mutation({
  args: { id: v.id('articles') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const article = await ctx.db.get(args.id);
    if (!article || article.userId !== identity.subject) {
      throw new Error('Article not found or unauthorized');
    }

    await ctx.db.delete(args.id);
  },
});
