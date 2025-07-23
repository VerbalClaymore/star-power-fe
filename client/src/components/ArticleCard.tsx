import { Heart, Share, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import PlanetIcon from "./PlanetIcon";
import type { ArticleWithDetails } from "@shared/schema";

interface ArticleCardProps {
  article: ArticleWithDetails;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const getCategoryColor = (categorySlug: string) => {
    const colorMap: Record<string, string> = {
      entertainment: "category-entertainment",
      music: "category-music", 
      celebrity: "category-celebrity",
      lifestyle: "category-lifestyle",
      world: "category-world",
      tech: "category-tech",
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

  const displayedHashtags = article.hashtags.slice(0, 2);
  const remainingCount = article.hashtags.length - 2;

  const highlightCelebrityNames = (title: string) => {
    if (!article.isCelebrity || article.actors.length === 0) return title;
    
    let highlightedTitle = title;
    article.actors.forEach(actor => {
      const regex = new RegExp(`(${actor.name})`, 'gi');
      highlightedTitle = highlightedTitle.replace(regex, `<span class="font-extrabold ${getCategoryColor(article.category.slug)}">${actor.name}</span>`);
    });
    
    return highlightedTitle;
  };

  return (
    <div className={cn(
      "bg-white rounded-lg border-l-4 touch-feedback cursor-pointer",
      `border-l-[hsl(var(--${article.category.slug}))]`
    )}>
      <div className="p-4 relative">
        {/* Category Badge Above Title */}
        <div className="mb-2">
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded text-white text-xs font-bold",
            getCategoryColor(article.category.slug)
          )}>
            <span className="mr-1">{getCategoryIcon(article.category.slug)}</span>
            {article.category.name.toUpperCase()}
          </span>
        </div>
        
        {/* Article Content */}
        <div className="flex">
          <div className="flex-1 pr-4">
            <h3 
              className="font-bold text-base leading-tight mb-2"
              dangerouslySetInnerHTML={{ __html: highlightCelebrityNames(article.title) }}
            />
            <p className="text-sm text-gray-600 mb-3">
              {article.summary}
            </p>
            
            {/* Metadata Tags - Single Row */}
            <div className="flex flex-wrap gap-1 mb-3">
              {displayedHashtags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  +{remainingCount} more
                </span>
              )}
            </div>
            
            {/* Social Stats */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <Heart className="w-3 h-3 mr-1" />
                {article.likeCount}
              </span>
              <span className="flex items-center">
                <Share className="w-3 h-3 mr-1" />
                {article.shareCount}
              </span>
              <span className="flex items-center">
                <Bookmark className="w-3 h-3 mr-1" />
                {article.bookmarkCount}
              </span>
            </div>
          </div>
          
          {/* Vertical Planet Icons */}
          <div className="flex flex-col items-center space-y-1 ml-2">
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
