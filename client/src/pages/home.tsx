import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TopNavigation from "@/components/TopNavigation";
import ArticleCard from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category, ArticleWithDetails } from "@shared/schema";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("top");

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: articles, isLoading: articlesLoading } = useQuery<ArticleWithDetails[]>({
    queryKey: ["/api/articles", activeCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeCategory !== "top") {
        params.append("category", activeCategory);
      }
      const response = await fetch(`/api/articles?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  if (categoriesLoading) {
    return (
      <div className="mobile-container">
        <div className="bg-primary text-white">
          <div className="status-bar">
            <span className="font-medium">9:41</span>
            <div className="flex items-center space-x-1">
              <span>📶</span>
              <span>📶</span>
              <span>🔋</span>
            </div>
          </div>
          <div className="app-header">
            <h1 className="text-xl font-bold">Star Power</h1>
            <p className="text-xs text-purple-200">Astrological News Reader</p>
          </div>
          <div className="px-4 pb-4">
            <Skeleton className="h-8 w-full bg-white/20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopNavigation
        categories={categories || []}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      <div className="flex-1 pb-20 bg-[hsl(var(--surface-variant))] dark:bg-gray-900 min-h-screen">
        {articlesLoading ? (
          <div className="space-y-4 p-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-gray-200">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <div className="flex space-x-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {articles?.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
            {articles?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No articles found for this category.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
