import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
        "hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
      data-testid="button-theme-toggle"
    >
      {theme === 'light' ? (
        <Sun className="w-5 h-5 text-gray-700 dark:text-gray-200" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
      )}
    </button>
  );
}