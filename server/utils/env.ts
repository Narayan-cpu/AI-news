export class ConfigurationError extends Error {
  constructor(
    message: string,
    public missingKeys: string[]
  ) {
    super(message);
    this.name = "ConfigurationError";
  }
}

export function ensureNewsApiKey(): string {
  const key = process.env.NEWS_API_KEY;
  if (!key) {
    throw new ConfigurationError(
      "NEWS_API_KEY environment variable is not set. Please add your NewsAPI key to Replit Secrets.",
      ["NEWS_API_KEY"]
    );
  }
  return key;
}

export function ensureGroqApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new ConfigurationError(
      "GROQ_API_KEY environment variable is not set. Please add your Groq API key to Replit Secrets.",
      ["GROQ_API_KEY"]
    );
  }
  return key;
}

export function logStartupHealth(): void {
  const missing: string[] = [];

  try {
    ensureNewsApiKey();
    console.log("✓ NEWS_API_KEY configured");
  } catch (error) {
    if (error instanceof ConfigurationError) {
      missing.push(...error.missingKeys);
      console.warn(`✗ ${error.message}`);
    }
  }

  try {
    ensureGroqApiKey();
    console.log("✓ GROQ_API_KEY configured");
  } catch (error) {
    if (error instanceof ConfigurationError) {
      missing.push(...error.missingKeys);
      console.warn(`✗ ${error.message}`);
    }
  }

  if (missing.length > 0) {
    console.warn(
      `\n⚠️  Server started with missing configuration. API requests will fail until the following secrets are added:\n  - ${missing.join("\n  - ")}\n`
    );
  } else {
    console.log("✓ All API keys configured");
  }
}
