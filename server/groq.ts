import type { Article, EnrichedArticle, SentimentType } from "@shared/schema";
import { ensureGroqApiKey } from "./utils/env";

const GROQ_API_BASE = "https://api.groq.com/openai/v1";

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

async function callGroq(messages: GroqMessage[], retries = 3): Promise<string> {
  const apiKey = ensureGroqApiKey();
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages,
          temperature: 0.3,
          max_tokens: 150,
        }),
      });

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get("retry-after") || "1", 10);
        const delay = Math.min(retryAfter * 1000, 5000);
        console.log(`Rate limited, waiting ${delay}ms before retry ${attempt + 1}/${retries}`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data: GroqResponse = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      if (attempt === retries - 1) {
        throw error;
      }
      const backoffDelay = Math.pow(2, attempt) * 1000;
      console.log(`Groq call failed, retrying in ${backoffDelay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
    }
  }
  
  throw new Error("Groq API call failed after all retries");
}

export async function analyzeArticle(article: Article): Promise<EnrichedArticle> {
  const text = `${article.title}. ${article.description || ""}`;

  const systemPrompt = `You are a news analysis AI. Analyze the given article and provide:
1. A primary category (one of: general, business, technology, science, health, sports, entertainment)
2. Sentiment analysis (positive, neutral, or negative)
3. A sentiment score from -1.0 to 1.0

Respond ONLY in this exact JSON format:
{"category": "category_name", "sentiment": "sentiment_type", "sentimentScore": 0.0}`;

  const userPrompt = `Analyze this news article:\n\n${text}`;

  try {
    const result = await callGroq([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    const analysis = JSON.parse(result);

    return {
      ...article,
      category: analysis.category || "general",
      sentiment: analysis.sentiment || "neutral",
      sentimentScore: analysis.sentimentScore || 0,
    };
  } catch (error) {
    console.error("Error analyzing article:", error);
    return {
      ...article,
      category: "general",
      sentiment: "neutral",
      sentimentScore: 0,
    };
  }
}

export async function batchAnalyzeArticles(
  articles: Article[]
): Promise<EnrichedArticle[]> {
  const CONCURRENCY = 5;
  const analyzed: EnrichedArticle[] = [];

  for (let i = 0; i < articles.length; i += CONCURRENCY) {
    const batch = articles.slice(i, i + CONCURRENCY);
    
    const results = await Promise.allSettled(
      batch.map(async (article) => {
        try {
          return await analyzeArticle(article);
        } catch (error) {
          console.error(`Failed to analyze article: ${article.title}`, error);
          return {
            ...article,
            category: "general",
            sentiment: "neutral",
            sentimentScore: 0,
          } as EnrichedArticle;
        }
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        analyzed.push(result.value);
      }
    }
  }

  return analyzed;
}
