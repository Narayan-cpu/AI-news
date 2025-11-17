import type { Article } from "@shared/schema";
import { ensureNewsApiKey } from "./utils/env";

const NEWS_API_BASE = "https://eventregistry.org/api/v1";

const CATEGORY_MAP: Record<string, string> = {
  business: "news/Business",
  technology: "news/Technology",
  science: "news/Science",
  health: "news/Health",
  sports: "news/Sports",
  entertainment: "news/Entertainment",
  general: "",
};

const COUNTRY_MAP: Record<string, string> = {
  us: "http://en.wikipedia.org/wiki/United_States",
  gb: "http://en.wikipedia.org/wiki/United_Kingdom",
  ca: "http://en.wikipedia.org/wiki/Canada",
  au: "http://en.wikipedia.org/wiki/Australia",
  in: "http://en.wikipedia.org/wiki/India",
};

interface NewsAPIArticle {
  uri: string;
  lang: string;
  isDuplicate: boolean;
  date: string;
  time: string;
  dateTime: string;
  dateTimePub: string;
  dataType: string;
  url: string;
  title: string;
  body: string;
  source: {
    uri: string;
    title: string;
  };
  image?: string;
  sentiment?: number;
}

interface NewsAPIResponse {
  articles?: {
    results: NewsAPIArticle[];
  };
}

function transformArticle(article: NewsAPIArticle): Article {
  const description = article.body 
    ? article.body.substring(0, 200) + "..."
    : "";
  
  return {
    id: article.uri,
    title: article.title,
    description,
    content: article.body || "",
    url: article.url,
    urlToImage: article.image || null,
    publishedAt: article.dateTime,
    source: {
      id: article.source.uri,
      name: article.source.title,
    },
    author: null,
  };
}

export async function fetchTopHeadlines(
  category?: string,
  country?: string,
  from?: string,
  to?: string
): Promise<Article[]> {
  const apiKey = ensureNewsApiKey();
  
  const requestBody: any = {
    apiKey,
    resultType: "articles",
    articlesSortBy: "date",
    articlesCount: 20,
    lang: "eng",
    includeArticleImage: true,
  };

  if (category && category !== "all" && CATEGORY_MAP[category]) {
    requestBody.categoryUri = CATEGORY_MAP[category];
  }

  if (country && COUNTRY_MAP[country]) {
    requestBody.sourceLocationUri = COUNTRY_MAP[country];
  }

  if (from) {
    requestBody.dateStart = from;
  }

  if (to) {
    requestBody.dateEnd = to;
  }

  const response = await fetch(`${NEWS_API_BASE}/article/getArticles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NewsAPI.ai error: ${response.statusText} - ${errorText}`);
  }

  const data: NewsAPIResponse = await response.json();
  
  if (!data.articles || !data.articles.results) {
    return [];
  }

  return data.articles.results.map(transformArticle);
}

export async function searchNews(
  query: string,
  from?: string,
  to?: string,
  category?: string,
  country?: string
): Promise<Article[]> {
  const apiKey = ensureNewsApiKey();
  
  const requestBody: any = {
    apiKey,
    resultType: "articles",
    keyword: query,
    articlesSortBy: "date",
    articlesCount: 20,
    lang: "eng",
    includeArticleImage: true,
  };

  if (category && category !== "all" && CATEGORY_MAP[category]) {
    requestBody.categoryUri = CATEGORY_MAP[category];
  }

  if (country && COUNTRY_MAP[country]) {
    requestBody.sourceLocationUri = COUNTRY_MAP[country];
  }

  if (from) {
    requestBody.dateStart = from;
  }

  if (to) {
    requestBody.dateEnd = to;
  }

  const response = await fetch(`${NEWS_API_BASE}/article/getArticles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NewsAPI.ai error: ${response.statusText} - ${errorText}`);
  }

  const data: NewsAPIResponse = await response.json();
  
  if (!data.articles || !data.articles.results) {
    return [];
  }

  return data.articles.results.map(transformArticle);
}
