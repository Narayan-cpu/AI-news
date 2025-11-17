import type { Article } from "@shared/schema";
import { ensureNewsApiKey } from "./utils/env";

const NEWS_API_BASE = "https://newsapi.org/v2";

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export async function fetchTopHeadlines(
  category?: string,
  country?: string,
  from?: string,
  to?: string
): Promise<Article[]> {
  const apiKey = ensureNewsApiKey();
  
  const params = new URLSearchParams({
    apiKey,
    country: country || "us",
    pageSize: "20",
  });

  if (category && category !== "all") {
    params.append("category", category);
  }

  if (from) {
    params.append("from", from);
  }

  if (to) {
    params.append("to", to);
  }

  const response = await fetch(`${NEWS_API_BASE}/top-headlines?${params}`);
  
  if (!response.ok) {
    throw new Error(`NewsAPI error: ${response.statusText}`);
  }

  const data: NewsAPIResponse = await response.json();
  
  return data.articles.map((article, index) => ({
    ...article,
    id: `${article.url}-${index}`,
  }));
}

export async function searchNews(
  query: string,
  from?: string,
  to?: string
): Promise<Article[]> {
  const apiKey = ensureNewsApiKey();
  
  const params = new URLSearchParams({
    apiKey,
    q: query,
    sortBy: "publishedAt",
    pageSize: "20",
    language: "en",
  });

  if (from) {
    params.append("from", from);
  }

  if (to) {
    params.append("to", to);
  }

  const response = await fetch(`${NEWS_API_BASE}/everything?${params}`);
  
  if (!response.ok) {
    throw new Error(`NewsAPI error: ${response.statusText}`);
  }

  const data: NewsAPIResponse = await response.json();
  
  return data.articles.map((article, index) => ({
    ...article,
    id: `${article.url}-${index}`,
  }));
}
