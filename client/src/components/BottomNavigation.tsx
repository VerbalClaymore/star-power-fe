import { useLocation } from "wouter";
import { Home, User, Bookmark, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNavigation() {
  const [location, navigate] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Bookmark, label: "Saved", path: "/saved" },
    { icon: Search, label: "Search", path: "/search" },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[428px] bg-primary z-50">
      <div className="flex items-center justify-around py-3 px-4">
        {navItems.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={cn(
              "flex flex-col items-center space-y-1 transition-opacity duration-200",
              location === path
                ? "text-white"
                : "text-purple-200 opacity-70 hover:opacity-100"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
