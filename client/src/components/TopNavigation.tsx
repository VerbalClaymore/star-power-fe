import { cn } from "@/lib/utils";
import type { Category } from "@shared/schema";

interface TopNavigationProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  showStatusBar?: boolean;
}

export default function TopNavigation({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  showStatusBar = true
}: TopNavigationProps) {
  return (
    <div className="bg-primary text-white">
      {showStatusBar && (
        <div className="status-bar">
          <span></span>
          <div className="flex items-center space-x-1">
          </div>
        </div>
      )}
      
      <div className="app-header">
        <h1 className="text-xl font-bold">Star Power</h1>
        <p className="text-xs text-purple-200">Astrological News Reader</p>
      </div>
      
      <div className="relative">
        <div className="flex overflow-x-auto scrollbar-hide px-4 pb-4 space-x-4">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => onCategoryChange(category.slug)}
              className={cn(
                "rounded-full px-4 py-2 whitespace-nowrap text-sm transition-all duration-200",
                activeCategory === category.slug
                  ? "bg-white bg-opacity-20 font-medium"
                  : "opacity-70 hover:bg-white hover:bg-opacity-10"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
