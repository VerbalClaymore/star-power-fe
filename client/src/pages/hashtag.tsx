import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import BottomNavigation from "@/components/BottomNavigation";
import type { ArticleWithDetails } from "@shared/schema";

export default function HashtagPage() {
  const { hashtag } = useParams();
  const [, setLocation] = useLocation();

  const { data: articles, isLoading } = useQuery<ArticleWithDetails[]>({
    queryKey: ['/api/hashtags', hashtag],
    queryFn: async () => {
      const response = await fetch(`/api/hashtags/${hashtag}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      return response.json();
    },
    enabled: !!hashtag,
  });

  const handleBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen pb-20">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading articles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-gray-100" />
          </button>
          
          <div className="flex items-center">
            <span className="mr-2 text-lg">#</span>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {hashtag}
            </h1>
          </div>
          
          <div className="w-10 h-10"></div>
        </div>
      </div>

      {/* Articles */}
      <div className="p-4">
        <div className="space-y-4">
          {articles && articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">#</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No articles found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                There are no articles with the hashtag #{hashtag}
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}