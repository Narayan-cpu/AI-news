import { Calendar, ExternalLink, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EnrichedArticle } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface ArticleModalProps {
  article: EnrichedArticle | null;
  open: boolean;
  onClose: () => void;
}

export function ArticleModal({ article, open, onClose }: ArticleModalProps) {
  if (!article) return null;

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="modal-article">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold leading-tight pr-8">
            {article.title}
          </DialogTitle>
        </DialogHeader>

        {article.urlToImage && (
          <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden -mt-2">
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {article.category && (
            <Badge variant="secondary" className="text-sm capitalize">
              {article.category}
            </Badge>
          )}
          {article.sentiment && (
            <Badge className={`text-sm capitalize ${getSentimentColor(article.sentiment)}`}>
              {article.sentiment}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-y py-3">
          <div className="flex items-center gap-2">
            <span className="font-medium">{article.source.name}</span>
          </div>
          {article.author && (
            <div className="flex items-center gap-2">
              <span>By {article.author}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>

        {article.description && (
          <p className="text-base leading-relaxed">{article.description}</p>
        )}

        {article.content && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-base leading-relaxed text-foreground/90">
              {article.content.replace(/\[\+\d+ chars\]$/, "...")}
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button asChild className="flex-1" data-testid="button-read-original">
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Read Full Article
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
