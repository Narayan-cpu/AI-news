import { Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EnrichedArticle } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
  article: EnrichedArticle;
  onClick?: () => void;
}

export function NewsCard({ article, onClick }: NewsCardProps) {
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

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  return (
    <Card
      className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer h-full flex flex-col"
      onClick={onClick}
      data-testid={`card-article-${article.id}`}
    >
      <div className="aspect-video w-full bg-muted relative overflow-hidden">
        {article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <ExternalLink className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <CardContent className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {article.category && (
            <Badge
              variant="secondary"
              className="text-xs capitalize"
              data-testid={`badge-category-${article.id}`}
            >
              {article.category}
            </Badge>
          )}
          {article.sentiment && (
            <Badge
              className={`text-xs capitalize ${getSentimentColor(article.sentiment)}`}
              data-testid={`badge-sentiment-${article.id}`}
            >
              {article.sentiment}
            </Badge>
          )}
        </div>

        <h3
          className="font-semibold text-lg leading-tight line-clamp-3"
          data-testid={`text-title-${article.id}`}
        >
          {article.title}
        </h3>

        {article.description && (
          <p
            className="text-sm text-muted-foreground line-clamp-2 flex-1"
            data-testid={`text-description-${article.id}`}
          >
            {article.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 pt-2 border-t text-xs text-muted-foreground">
          <span className="font-medium truncate" data-testid={`text-source-${article.id}`}>
            {article.source.name}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <Calendar className="w-3 h-3" />
            <span data-testid={`text-date-${article.id}`}>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
