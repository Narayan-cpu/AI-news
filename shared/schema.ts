import { z } from "zod";

// News Article Schema
export const articleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  content: z.string().nullable(),
  url: z.string().url(),
  urlToImage: z.string().url().nullable(),
  publishedAt: z.string(),
  source: z.object({
    id: z.string().nullable(),
    name: z.string(),
  }),
  author: z.string().nullable(),
  // AI-generated fields
  category: z.string().optional(),
  sentiment: z.enum(["positive", "neutral", "negative"]).optional(),
  sentimentScore: z.number().optional(),
});

export type Article = z.infer<typeof articleSchema>;

// API Response Schemas
export const newsApiResponseSchema = z.object({
  status: z.string(),
  totalResults: z.number(),
  articles: z.array(articleSchema),
});

export type NewsApiResponse = z.infer<typeof newsApiResponseSchema>;

// Enriched Article (with AI analysis)
export const enrichedArticleSchema = articleSchema.extend({
  category: z.string(),
  sentiment: z.enum(["positive", "neutral", "negative"]),
  sentimentScore: z.number(),
});

export type EnrichedArticle = z.infer<typeof enrichedArticleSchema>;

// Search/Filter Parameters
export const newsFilterSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  sentiment: z.enum(["all", "positive", "neutral", "negative"]).optional(),
  country: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type NewsFilter = z.infer<typeof newsFilterSchema>;

// Categories available
export const CATEGORIES = [
  "general",
  "business",
  "technology",
  "science",
  "health",
  "sports",
  "entertainment",
] as const;

export const COUNTRIES = [
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "ca", name: "Canada" },
  { code: "au", name: "Australia" },
  { code: "in", name: "India" },
] as const;

// Sentiment types
export type SentimentType = "positive" | "neutral" | "negative";
