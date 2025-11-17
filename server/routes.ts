import type { Express } from "express";
import { createServer, type Server } from "http";
import { fetchTopHeadlines, searchNews } from "./newsapi";
import { batchAnalyzeArticles } from "./groq";
import { articleCache } from "./cache";
import { newsFilterSchema } from "@shared/schema";
import { ConfigurationError } from "./utils/env";
import type { EnrichedArticle } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/news", async (req, res) => {
    try {
      const validationResult = newsFilterSchema.safeParse(req.query);

      if (!validationResult.success) {
        return res.status(400).json({
          error: "Invalid request parameters",
          details: validationResult.error.errors,
        });
      }

      const { query, category, sentiment, country, from, to } = validationResult.data;

      const cacheKey = articleCache.generateKey({
        query: query || "",
        category: category || "all",
        country: country || "us",
        from: from || "",
        to: to || "",
      });

      let enrichedArticles = articleCache.get(cacheKey);

      if (!enrichedArticles) {
        let rawArticles;

        if (query && query.trim()) {
          rawArticles = await searchNews(query, from, to);
        } else {
          const cat = category && category !== "all" ? category : undefined;
          rawArticles = await fetchTopHeadlines(cat, country, from, to);
        }

        enrichedArticles = await batchAnalyzeArticles(rawArticles);
        articleCache.set(cacheKey, enrichedArticles);
      }

      let filteredArticles = enrichedArticles;

      if (sentiment && sentiment !== "all") {
        filteredArticles = enrichedArticles.filter(
          (article) => article.sentiment === sentiment
        );
      }

      res.json(filteredArticles);
    } catch (error) {
      console.error("Error fetching news:", error);
      
      if (error instanceof ConfigurationError) {
        return res.status(500).json({
          error: "Configuration error",
          message: error.message,
          missingKeys: error.missingKeys,
        });
      }
      
      res.status(500).json({
        error: "Failed to fetch news",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
