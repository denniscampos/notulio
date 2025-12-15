import { mutation } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';

// Helper function to create search content
function createSearchContent(
  title: string,
  description?: string,
  author?: string,
  tags: string[] = []
): string {
  return [title, description || '', author || '', ...tags]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export const createArticle = mutation({
  args: {
    url: v.string(),
    title: v.string(),
    author: v.optional(v.string()),
    description: v.optional(v.string()),
    aiSummary: v.optional(v.string()),
    body: v.optional(v.string()),
    tags: v.array(v.string()),
    images: v.optional(v.array(v.string())),
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

    const searchContent = createSearchContent(
      args.title,
      args.description,
      args.author,
      args.tags
    );

    return await ctx.db.insert('articles', {
      ...args,
      userId,
      searchContent,
    });
  },
});

export const searchArticles = query({
  args: {
    searchQuery: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      return {
        isDone: true,
        page: [],
        cursor: null,
        continueCursor: null,
      };
    }

    const userId = user.subject;

    if (!args.searchQuery.trim()) {
      return await ctx.db
        .query('articles')
        .withIndex('userId', (q) => q.eq('userId', userId))
        .order('desc')
        .paginate(args.paginationOpts);
    }

    return await ctx.db
      .query('articles')
      .withSearchIndex('search_articles', (q) =>
        q.search('searchContent', args.searchQuery).eq('userId', userId)
      )
      .paginate(args.paginationOpts);
  },
});

export const getArticleById = query({
  args: { id: v.id('articles') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // Return undefined during auth loading - this is temporary
      return undefined;
    }

    const article = await ctx.db.get('articles', args.id);
    if (!article) {
      throw new ConvexError('Article not found');
    }

    if (article.userId !== identity.subject) {
      throw new ConvexError('Unauthorized access to article');
    }

    return article;
  },
});

export const updateArticle = mutation({
  args: {
    id: v.id('articles'),
    title: v.optional(v.string()),
    author: v.optional(v.string()),
    description: v.optional(v.string()),
    aiSummary: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const article = await ctx.db.get('articles', args.id);
    if (!article || article.userId !== identity.subject) {
      throw new Error('Article not found or unauthorized');
    }

    // Only update fields that are provided
    const updateData: any = {};
    if (args.title !== undefined) updateData.title = args.title;
    if (args.author !== undefined) updateData.author = args.author;
    if (args.description !== undefined)
      updateData.description = args.description;
    if (args.aiSummary !== undefined) updateData.aiSummary = args.aiSummary;
    if (args.tags !== undefined) updateData.tags = args.tags;
    if (args.images !== undefined) updateData.images = args.images;

    // Update search content if any searchable fields changed
    if (
      args.title !== undefined ||
      args.description !== undefined ||
      args.tags !== undefined ||
      args.author !== undefined
    ) {
      const newTitle = args.title ?? article.title;
      const newDescription = args.description ?? article.description;
      const newTags = args.tags ?? article.tags;
      const newAuthor = args.author ?? article.author;
      updateData.searchContent = createSearchContent(
        newTitle,
        newDescription,
        newAuthor,
        newTags
      );
    }

    await ctx.db.patch('articles', args.id, updateData);
  },
});

export const removeArticle = mutation({
  args: { id: v.id('articles') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const article = await ctx.db.get('articles', args.id);
    if (!article || article.userId !== identity.subject) {
      throw new Error('Article not found or unauthorized');
    }

    await ctx.db.delete(args.id);
  },
});
