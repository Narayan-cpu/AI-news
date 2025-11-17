import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles } from "lucide-react";
import type { EnrichedArticle } from "@shared/schema";

interface HeroSectionProps {
  article: EnrichedArticle | null;
  onReadMore: () => void;
}

export function HeroSection({ article, onReadMore }: HeroSectionProps) {
  if (!article) {
    return (
      <div className="relative h-64 md:h-96 bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">AI News Aggregator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover news with intelligent categorization and sentiment analysis
          </p>
        </div>
      </div>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200";
      case "negative":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div className="relative h-64 md:h-96 overflow-hidden" data-testid="section-hero">
      <div className="absolute inset-0">
        {article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-end pb-8">
        <div className="space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            {article.category && (
              <Badge
                variant="secondary"
                className="capitalize backdrop-blur-sm bg-background/80"
              >
                {article.category}
              </Badge>
            )}
            {article.sentiment && (
              <Badge className={`capitalize backdrop-blur-sm ${getSentimentColor(article.sentiment)}`}>
                {article.sentiment}
              </Badge>
            )}
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">
            {article.title}
          </h2>

          {article.description && (
            <p className="text-sm md:text-base text-white/90 line-clamp-2">
              {article.description}
            </p>
          )}

          <Button
            onClick={onReadMore}
            className="backdrop-blur-sm bg-background/20 hover:bg-background/30 border border-white/20"
            data-testid="button-hero-read-more"
          >
            Read Full Story
          </Button>
        </div>
      </div>
    </div>
  );
}
