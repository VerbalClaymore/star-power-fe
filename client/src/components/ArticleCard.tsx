import { Heart, Bookmark } from "lucide-react";
import { PiShareNetworkBold } from "react-icons/pi";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import PlanetIcon from "./PlanetIcon";
import type { ArticleWithDetails } from "@shared/schema";

interface ArticleCardProps {
  article: ArticleWithDetails;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [, setLocation] = useLocation();
  const getCategoryColor = (categorySlug: string) => {
    const colorMap: Record<string, string> = {
      entertainment: "category-entertainment",
      celebrity: "category-celebrity",
      lifestyle: "category-lifestyle", 
      world: "category-world",
      tech: "category-tech",
      top: "category-top",
    };
    return colorMap[categorySlug] || "category-entertainment";
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

  const displayedHashtags = article.hashtags.slice(0, 2);
  const remainingCount = article.hashtags.length - 2;

  const highlightCelebrityNames = (title: string) => {
    if (!article.isCelebrity || article.actors.length === 0) return title;
    
    let highlightedTitle = title;
    article.actors.forEach(actor => {
      // Get the appropriate color based on actor and category
      const getActorColor = (actorName: string, categorySlug: string) => {
        if (actorName.toLowerCase().includes('taylor swift')) {
          return 'hsl(329, 86%, 70%)'; // Pink for Taylor Swift
        }
        if (actorName.toLowerCase().includes('elon musk')) {
          return 'hsl(24, 95%, 53%)'; // Orange for Elon Musk
        }
        // Default to category color for other actors
        return `hsl(var(--${categorySlug}))`;
      };
      
      const actorColor = getActorColor(actor.name, article.category.slug);
      const regex = new RegExp(`(${actor.name})`, 'gi');
      highlightedTitle = highlightedTitle.replace(regex, `<span class="font-bold" style="color: ${actorColor}">${actor.name}</span>`);
    });
    
    return highlightedTitle;
  };

  const handleCardClick = () => {
    setLocation(`/article/${article.id}`);
  };

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocation(`/article/${article.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg border-l-4 touch-feedback cursor-pointer hover:shadow-lg transition-shadow duration-200"
      style={{ borderLeftColor: `hsl(var(--${article.category.slug}))` }}
      onClick={handleCardClick}
    >
      <div className="p-4 relative">
        {/* Category Badge Above Title */}
        <div className="mb-2">
          <span className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-sm",
            getCategoryColor(article.category.slug)
          )}>
            <span className="mr-1.5 text-sm">{getCategoryIcon(article.category.slug)}</span>
            {getCategoryLabel(article.category.slug)}
          </span>
        </div>
        
        {/* Article Content */}
        <div className="flex">
          <div className="flex-1 pr-3">
            <h3 
              className="font-bold text-base leading-tight mb-2"
              dangerouslySetInnerHTML={{ __html: highlightCelebrityNames(article.title) }}
            />
            <p className="text-sm text-gray-600 mb-3">
              {article.summary}
            </p>
            
            {/* Metadata Tags - Single Row Only */}
            <div className="flex flex-wrap gap-1 mb-3 overflow-hidden" style={{ maxHeight: '1.5rem' }}>
              {displayedHashtags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded whitespace-nowrap">
                  +{remainingCount} more
                </span>
              )}
            </div>
            
            {/* Actors Section */}
            {article.actors.length > 0 && (
              <div className="flex items-center space-x-2 mb-3">
                {article.actors.slice(0, 3).map((actor, index) => (
                  <div key={actor.id} className="flex items-center">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold">
                      {actor.name.charAt(0)}
                    </div>
                    {index < 2 && index < article.actors.length - 1 && (
                      <span className="ml-1 text-xs text-gray-500">{actor.name.split(' ')[0]}</span>
                    )}
                  </div>
                ))}
                {article.actors.length > 3 && (
                  <span className="text-xs text-gray-500">+{article.actors.length - 3} more</span>
                )}
              </div>
            )}
            
            {/* Social Stats and Read More */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Heart className="w-3 h-3 mr-1" />
                  {article.likeCount}
                </span>
                <span className="flex items-center">
                  <PiShareNetworkBold className="w-3 h-3 mr-1" />
                  {article.shareCount}
                </span>
                <span className="flex items-center">
                  <Bookmark className="w-3 h-3 mr-1" />
                  {article.bookmarkCount}
                </span>
              </div>
              
              {/* Clear Call-to-Action */}
              <button 
                onClick={handleReadMoreClick}
                className={cn(
                  "text-xs font-bold px-2 py-1 rounded transition-opacity hover:opacity-80",
                  getCategoryColor(article.category.slug),
                  "text-white"
                )}
              >
                Read More →
              </button>
            </div>
          </div>
          
          {/* Vertical Planet Icons - Right Aligned */}
          <div className="flex flex-col items-end space-y-1 pl-2">
            {article.astroGlyphs.map((glyph, index) => (
              <PlanetIcon
                key={index}
                planet={glyph.planet}
                symbol={glyph.symbol}
                color={glyph.color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}