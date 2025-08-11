import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, Bookmark, Share2 } from "lucide-react";
import { PiShareNetworkBold } from "react-icons/pi";
import { cn } from "@/lib/utils";
import PlanetIcon from "@/components/PlanetIcon";
import BottomNavigation from "@/components/BottomNavigation";
import type { ArticleWithDetails } from "@shared/schema";

export default function ArticlePage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: article, isLoading } = useQuery<ArticleWithDetails>({
    queryKey: ['/api/articles', id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="mobile-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mobile-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Article not found</p>
            <button 
              onClick={() => setLocation('/')}
              className="text-primary hover:underline"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getCategoryColor = (categorySlug: string) => {
    const colorMap: Record<string, string> = {
      entertainment: "hsl(262, 83%, 58%)",
      celebrity: "hsl(329, 86%, 70%)",
      lifestyle: "hsl(158, 64%, 52%)",
      world: "hsl(217, 91%, 60%)",
      tech: "hsl(24, 95%, 53%)",
      top: "hsl(45, 93%, 47%)",
    };
    return colorMap[categorySlug] || colorMap.entertainment;
  };

  const getCategoryIcon = (categorySlug: string) => {
    const iconMap: Record<string, string> = {
      entertainment: "🎬",
      music: "🎵", 
      celebrity: "⭐",
      lifestyle: "💖",
      world: "🌍",
      tech: "💻",
    };
    return iconMap[categorySlug] || "📰";
  };

  const getCategoryLabel = (categorySlug: string) => {
    const labelMap: Record<string, string> = {
      entertainment: "ENTERTAINMENT",
      celebrity: "CELEBRITY", 
      lifestyle: "LIFESTYLE",
      world: "WORLD",
      tech: "TECH",
      top: "TOP",
    };
    return labelMap[categorySlug] || "NEWS";
  };

  const highlightCelebrityNames = (title: string) => {
    if (!article.isCelebrity || article.actors.length === 0) return title;
    
    let highlightedTitle = title;
    article.actors.forEach(actor => {
      const getActorColor = (actorName: string, categorySlug: string) => {
        if (actorName.toLowerCase().includes('taylor swift')) {
          return 'hsl(329, 86%, 70%)'; // Pink for Taylor Swift
        }
        if (actorName.toLowerCase().includes('elon musk')) {
          return 'hsl(24, 95%, 53%)'; // Orange for Elon Musk
        }
        return getCategoryColor(categorySlug);
      };
      
      const actorColor = getActorColor(actor.name, article.category.slug);
      const regex = new RegExp(`(${actor.name})`, 'gi');
      highlightedTitle = highlightedTitle.replace(regex, `<span class="font-bold" style="color: ${actorColor}">${actor.name}</span>`);
    });
    
    return highlightedTitle;
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Header with Back Button and Actions */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b-4 z-10" 
           style={{ borderBottomColor: getCategoryColor(article.category?.slug || 'top') }}>
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {/* Category Badge */}
          <div className="flex-1 flex justify-center">
            <span 
              className="inline-flex items-center px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-sm"
              style={{ backgroundColor: getCategoryColor(article.category.slug) }}
            >
              <span className="mr-1.5 text-sm">{getCategoryIcon(article.category.slug)}</span>
              {getCategoryLabel(article.category.slug)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
              <Heart className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-8">
        {/* Title */}
        <h1 
          className="text-2xl font-bold leading-tight mb-6 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: highlightCelebrityNames(article.title) }}
        />

        {/* Astro Glyphs */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {article.astroGlyphs.map((glyph, index) => (
            <PlanetIcon
              key={index}
              planet={glyph.planet}
              symbol={glyph.symbol}
              color={glyph.color}

            />
          ))}
        </div>

        {/* News Summary */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-300 mb-3">News Summary</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Astro Analysis */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-300 mb-3">Astro Analysis</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {article.astroAnalysis}
          </p>
        </div>

        {/* Actors Section */}
        {article.actors.length > 0 && (
          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-300 mb-3">Featured</h3>
            
            {/* Celebrities Section */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Celebrities</h4>
              <div className="grid grid-cols-2 gap-3">
                {article.actors.map((actor) => (
                  <button
                    key={actor.id}
                    onClick={() => setLocation(`/actor/${actor.id}/${article.id}`)}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                    data-testid={`button-celebrity-${actor.id}`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-sm font-bold text-white">
                      {actor.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-300">{actor.name}</p>
                      {actor.sunSign && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ♈ {actor.sunSign}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Relationships Section */}
            {article.actors.length > 1 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Relationships</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setLocation(`/ship/1`)}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg hover:from-pink-100 hover:to-purple-100 dark:hover:from-pink-800/30 dark:hover:to-purple-800/30 transition-colors text-left w-full"
                    data-testid="button-relationship-tayvis"
                  >
                    {/* Overlapping avatars */}
                    <div className="relative flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        T
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-xs font-bold text-white -ml-2 border-2 border-white dark:border-gray-900">
                        K
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-300">Tayvis</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        confirmed
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hashtags */}
        {article.hashtags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-300 mb-3">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {article.hashtags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => setLocation(`/hashtag/${tag.replace('#', '')}`)}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  data-testid={`button-hashtag-${tag.replace('#', '')}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Social Stats */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <span className="text-lg font-medium text-gray-900 dark:text-gray-300">{article.likeCount}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">likes</span>
            </div>
            <div className="flex items-center space-x-2">
              <PiShareNetworkBold className="w-5 h-5 text-gray-400" />
              <span className="text-lg font-medium">{article.shareCount}</span>
              <span className="text-sm text-gray-500">shares</span>
            </div>
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-gray-400" />
              <span className="text-lg font-medium">{article.bookmarkCount}</span>
              <span className="text-sm text-gray-500">saves</span>
            </div>
          </div>
        </div>

        {/* Publication Date */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200 mb-20">
          <p className="text-sm text-gray-500">
            Published {new Date(article.publishedAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}