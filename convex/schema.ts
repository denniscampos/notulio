import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  articles: defineTable({
    url: v.string(),
    title: v.string(),
    author: v.optional(v.string()),
    description: v.optional(v.string()),
    aiSummary: v.optional(v.string()),
    body: v.optional(v.string()),
    userId: v.string(),
  }).index('userId', ['userId']),
});
