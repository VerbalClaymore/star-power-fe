import { cn } from "@/lib/utils";

interface AdCardProps {
  className?: string;
}

export default function AdCard({ className }: AdCardProps) {
  return (
    <div className={cn(
      "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900",
      "dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950",
      "rounded-lg border-l-4 border-yellow-400 dark:border-yellow-500", 
      "relative overflow-hidden cursor-default select-none",
      "min-h-[140px] flex items-center justify-center",
      className
    )} data-testid="ad-card">
      {/* Night sky pattern */}
      <div className="absolute inset-0">
        {/* Stars */}
        <div className="absolute top-4 left-6 w-1 h-1 bg-white rounded-full opacity-80"></div>
        <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-70"></div>
        <div className="absolute top-12 left-16 w-1 h-1 bg-blue-200 rounded-full opacity-90"></div>
        <div className="absolute top-16 right-8 w-1 h-1 bg-white rounded-full opacity-60"></div>
        <div className="absolute top-20 left-8 w-1.5 h-1.5 bg-purple-200 rounded-full opacity-80"></div>
        <div className="absolute bottom-16 right-16 w-1 h-1 bg-pink-200 rounded-full opacity-70"></div>
        <div className="absolute bottom-12 left-12 w-1 h-1 bg-white rounded-full opacity-90"></div>
        <div className="absolute bottom-8 right-6 w-1.5 h-1.5 bg-indigo-200 rounded-full opacity-60"></div>
        
        {/* Constellation lines */}
        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 320 140">
          <defs>
            <linearGradient id="constellationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
              <stop offset="100%" stopColor="rgba(147,197,253,0.6)" />
            </linearGradient>
          </defs>
          <path
            d="M50 30 L80 45 L120 35 L150 55 M180 25 L210 40 L240 30 M60 80 L90 95 L130 85 M200 90 L230 105 L270 95"
            stroke="url(#constellationGrad)"
            strokeWidth="0.5"
            fill="none"
            className="opacity-60"
          />
        </svg>
        
        {/* Floating cosmic dust */}
        <div className="absolute top-6 left-10 w-8 h-8 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-sm"></div>
        <div className="absolute bottom-10 right-14 w-6 h-6 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-sm"></div>
        <div className="absolute top-14 right-20 w-4 h-4 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-sm"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center p-6">
        <div className="mb-3">
          <div className="text-2xl mb-2">✨</div>
          <h3 className="text-lg font-bold text-white mb-1">
            Cosmic Insights
          </h3>
          <p className="text-sm text-purple-200 dark:text-indigo-200 mb-3">
            Unlock your astrological destiny
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-xs text-yellow-300 dark:text-yellow-400">
          <span>⭐</span>
          <span className="font-medium">Premium Reading</span>
          <span>⭐</span>
        </div>
        
        {/* Mystical border */}
        <div className="absolute inset-0 border border-purple-400/30 dark:border-indigo-400/20 rounded-lg"></div>
      </div>
    </div>
  );
}