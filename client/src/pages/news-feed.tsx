import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "@/components/hero-section";
import { FilterBar } from "@/components/filter-bar";
import { NewsCard } from "@/components/news-card";
import { NewsCardSkeleton } from "@/components/news-card-skeleton";
import { ArticleModal } from "@/components/article-modal";
import { EmptyState } from "@/components/empty-state";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDebounce } from "@/hooks/use-debounce";
import { Sparkles } from "lucide-react";
import type { EnrichedArticle } from "@shared/schema";

export default function NewsFeed() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSentiment, setSelectedSentiment] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<EnrichedArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: articles = [], isLoading, error } = useQuery<EnrichedArticle[]>({
    queryKey: ["/api/news", { 
      query: debouncedSearch || undefined,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      sentiment: selectedSentiment !== "all" ? selectedSentiment : undefined,
    }],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [string, Record<string, string | undefined>];
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value);
        }
      });

      const queryString = searchParams.toString();
      const url = queryString ? `/api/news?${queryString}` : "/api/news";
      const response = await fetch(url);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch news");
      }
      
      return response.json();
    },
  });

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSentiment("all");
  };

  const handleArticleClick = (article: EnrichedArticle) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const featuredArticle = articles[0] || null;
  const regularArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">AI News</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <HeroSection
        article={featuredArticle}
        onReadMore={() => featuredArticle && handleArticleClick(featuredArticle)}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedSentiment={selectedSentiment}
        onSentimentChange={setSelectedSentiment}
        onReset={handleReset}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 px-4">
            <h3 className="text-xl font-semibold mb-2">Failed to load news</h3>
            <p className="text-muted-foreground">
              There was an error loading the news. Please try again later.
            </p>
          </div>
        ) : regularArticles.length === 0 ? (
          <EmptyState onReset={handleReset} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                onClick={() => handleArticleClick(article)}
              />
            ))}
          </div>
        )}
      </main>

      <ArticleModal
        article={selectedArticle}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedArticle(null);
        }}
      />

      <footer className="border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Powered by NewsAPI and Groq AI • Built with ❤️ for intelligent news discovery</p>
        </div>
      </footer>
    </div>
  );
}
