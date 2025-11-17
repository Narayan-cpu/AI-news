import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CATEGORIES } from "@shared/schema";
import type { SentimentType } from "@shared/schema";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSentiment: string;
  onSentimentChange: (sentiment: string) => void;
  onReset: () => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSentiment,
  onSentimentChange,
  onReset,
}: FilterBarProps) {
  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedSentiment !== "all";

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onReset}
              data-testid="button-reset-filters"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Reset filters</span>
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2">Category</h3>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-2 pb-2">
                <Badge
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  className="cursor-pointer hover-elevate active-elevate-2"
                  onClick={() => onCategoryChange("all")}
                  data-testid="badge-category-all"
                >
                  All
                </Badge>
                {CATEGORIES.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer capitalize hover-elevate active-elevate-2"
                    onClick={() => onCategoryChange(category)}
                    data-testid={`badge-category-${category}`}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2">Sentiment</h3>
            <div className="flex flex-wrap gap-2">
              {["all", "positive", "neutral", "negative"].map((sentiment) => (
                <Badge
                  key={sentiment}
                  variant={selectedSentiment === sentiment ? "default" : "outline"}
                  className="cursor-pointer capitalize hover-elevate active-elevate-2"
                  onClick={() => onSentimentChange(sentiment)}
                  data-testid={`badge-sentiment-${sentiment}`}
                >
                  {sentiment}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
