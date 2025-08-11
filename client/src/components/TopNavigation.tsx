import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
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
  const getCategoryColorClass = (categorySlug: string) => {
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

  return (
    <div className="bg-primary dark:bg-gradient-to-r dark:from-violet-600 dark:to-slate-900 text-white">
      {showStatusBar && (
        <div className="status-bar">
          <span></span>
          <div className="flex items-center space-x-1">
          </div>
        </div>
      )}
      
      <div className="app-header relative">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white dark:text-gray-300">Star Power</h1>
            <p className="text-xs text-purple-200 dark:text-gray-400">Astrological News Reader</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
      
      <div className="relative">
        <div className="flex overflow-x-auto scrollbar-hide px-4 pb-4 space-x-4">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => onCategoryChange(category.slug)}
              className={cn(
                "rounded-full px-4 py-2 whitespace-nowrap text-sm font-medium transition-all duration-200",
                activeCategory === category.slug
                  ? cn("text-white dark:text-gray-300", getCategoryColorClass(category.slug))
                  : "bg-white dark:bg-gray-700 bg-opacity-10 dark:bg-opacity-60 opacity-70 hover:bg-opacity-20 dark:hover:bg-opacity-80"
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
