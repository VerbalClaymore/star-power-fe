import { Heart, Bookmark } from "lucide-react";
import { PiShareNetworkBold } from "react-icons/pi";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import PlanetIcon from "./PlanetIcon";
import { getAvatarForActor } from "@/utils/avatars";
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
      sports: "🏆",
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
      sports: "SPORTS",
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
        if (actorName.toLowerCase().includes('travis kelce')) {
          return 'hsl(120, 60%, 45%)'; // Green for Travis Kelce (Sports)
        }
        if (actorName.toLowerCase().includes('kanye west')) {
          return 'hsl(262, 83%, 58%)'; // Purple for Kanye West (Entertainment)
        }
        // Default to category color for other actors
        return `hsl(var(--${categorySlug}))`;
      };
      
      const actorColor = getActorColor(actor.name, article.category?.slug || 'top');
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
      className="bg-white dark:bg-gray-800 rounded-lg border-l-4 touch-feedback cursor-pointer hover:shadow-lg transition-shadow duration-200"
      style={{ borderLeftColor: `hsl(var(--${article.category?.slug || 'top'}))` }}
      onClick={handleCardClick}
    >
      <div className="p-4 relative">
        {/* Category Badge and Planet Glyphs Row */}
        <div className="flex items-center justify-between mb-2">
          <span className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-sm",
            getCategoryColor(article.category?.slug || 'top')
          )}>
            <span className="mr-1.5 text-sm">{getCategoryIcon(article.category?.slug || 'top')}</span>
            {getCategoryLabel(article.category?.slug || 'top')}
          </span>
          
          {/* Horizontal Planet Icons */}
          <div className="flex items-center space-x-1">
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
        
        {/* Article Content */}
        <div className="flex">
          {/* Article Image - Larger Size */}
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200 mr-4 flex-shrink-0">
            {(() => {
              const actorAvatar = article.actors.length > 0 ? getAvatarForActor(article.actors[0].name) : null;
              if (article.actors.length > 0 && (article.actors[0].profileImage || actorAvatar)) {
                return (
                  <img 
                    src={article.actors[0].profileImage || actorAvatar!} 
                    alt={article.actors[0].name}
                    className="w-full h-full object-cover"
                  />
                );
              } else {
                return (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                );
              }
            })()}
          </div>
          
          <div className="flex-1">
            <h3 
              className="font-bold text-base leading-tight mb-2 text-gray-900 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: highlightCelebrityNames(article.title) }}
            />
            
            {/* Metadata Tags - Single Row Only */}
            <div className="flex flex-wrap gap-1 mb-2 overflow-hidden" style={{ maxHeight: '1.5rem' }}>
              {displayedHashtags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded whitespace-nowrap">
                  +{remainingCount} more
                </span>
              )}
            </div>
            
            {/* Social Stats and Read More */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
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
                  getCategoryColor(article.category?.slug || 'top'),
                  "text-white"
                )}
              >
                Read More →
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}