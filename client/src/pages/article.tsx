import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, Bookmark, Share2 } from "lucide-react";
import { PiShareNetworkBold } from "react-icons/pi";
import { cn } from "@/lib/utils";
import PlanetIcon from "@/components/PlanetIcon";
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
    <div className="mobile-container bg-white min-h-screen">
      {/* Header with Back Button and Actions */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setLocation('/')}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
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
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-8">
        {/* Title */}
        <h1 
          className="text-2xl font-bold leading-tight mb-6"
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
          <h2 className="text-lg font-bold text-gray-900 mb-3">News Summary</h2>
          <p className="text-gray-700 leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Astro Analysis */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Astro Analysis</h2>
          <p className="text-gray-700 leading-relaxed">
            {article.astroAnalysis}
          </p>
        </div>

        {/* Actors Section */}
        {article.actors.length > 0 && (
          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-3">Featured People</h3>
            <div className="grid grid-cols-2 gap-3">
              {article.actors.map((actor) => (
                <button
                  key={actor.id}
                  onClick={() => setLocation(`/actor/${actor.id}/${article.id}`)}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                    {actor.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{actor.name}</p>
                    {actor.sunSign && (
                      <p className="text-xs text-gray-500">
                        {actor.sunSign} ☉ {actor.moonSign && `${actor.moonSign} ☽`} {actor.risingSign && `${actor.risingSign} ↗`}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hashtags */}
        {article.hashtags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-3">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {article.hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Stats */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-gray-400" />
              <span className="text-lg font-medium">{article.likeCount}</span>
              <span className="text-sm text-gray-500">likes</span>
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
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
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
    </div>
  );
}