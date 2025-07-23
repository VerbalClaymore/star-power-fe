import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TopNavigation from "@/components/TopNavigation";
import ArticleCard from "@/components/ArticleCard";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import type { ArticleWithDetails } from "@shared/schema";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useState(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  });

  const { data: articles, isLoading } = useQuery<ArticleWithDetails[]>({
    queryKey: ["/api/search", { q: debouncedQuery }],
    enabled: debouncedQuery.length > 0,
  });

  return (
    <>
      <TopNavigation
        categories={[]}
        activeCategory=""
        onCategoryChange={() => {}}
        showStatusBar={false}
      />
      
      <div className="flex-1 pb-20 bg-[hsl(var(--surface-variant))] min-h-screen">
        <div className="p-4">
          <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search articles, hashtags, actors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {debouncedQuery.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Enter a search term to find articles
            </div>
          ) : isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Searching...
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="space-y-4">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No articles found for "{debouncedQuery}"
            </div>
          )}
        </div>
      </div>
    </>
  );
}
