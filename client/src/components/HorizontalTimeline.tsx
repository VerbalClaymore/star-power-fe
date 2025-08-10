import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TimelineItem {
  id: string;
  label: string;
  year: number;
}

interface HorizontalTimelineProps {
  initialYear: number;
  items: TimelineItem[];
  onFocusChange: (year: number) => void;
}

export default function HorizontalTimeline({ initialYear, items, onFocusChange }: HorizontalTimelineProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const ITEM_WIDTH = 80;

  useEffect(() => {
    // Find initial year index and center it
    const initialIndex = items.findIndex(item => item.year === initialYear);
    if (initialIndex !== -1) {
      setFocusedIndex(initialIndex);
      scrollToIndex(initialIndex);
    }
  }, [initialYear, items]);

  useEffect(() => {
    // Notify parent when focus changes
    if (items[focusedIndex]) {
      onFocusChange(items[focusedIndex].year);
    }
  }, [focusedIndex, items, onFocusChange]);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current && itemRefs.current[index]) {
      const container = scrollRef.current;
      const item = itemRefs.current[index];
      const containerWidth = container.offsetWidth;
      const itemLeft = item.offsetLeft;
      const itemWidth = item.offsetWidth;
      
      const scrollLeft = itemLeft - (containerWidth / 2) + (itemWidth / 2);
      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    // Debounce scroll handler to improve performance
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      const container = scrollRef.current;
      if (!container) return;
      
      const containerCenter = container.scrollLeft + container.offsetWidth / 2;
      
      let closestIndex = 0;
      let minDistance = Infinity;
      
      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(itemCenter - containerCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });
      
      if (closestIndex !== focusedIndex) {
        setFocusedIndex(closestIndex);
      }
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && focusedIndex > 0) {
      e.preventDefault();
      handleItemClick(focusedIndex - 1);
    } else if (e.key === 'ArrowRight' && focusedIndex < items.length - 1) {
      e.preventDefault();
      handleItemClick(focusedIndex + 1);
    }
  };

  const handleItemClick = (index: number) => {
    setFocusedIndex(index);
    scrollToIndex(index);
  };

  return (
    <div className="w-full">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide py-4 focus:outline-none select-none cursor-grab active:cursor-grabbing"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'auto'
        }}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="flex space-x-4 px-4 min-w-max select-none">
          {items.map((item, index) => {
            const isFocused = index === focusedIndex;
            const isAdjacent = Math.abs(index - focusedIndex) === 1;
            
            return (
              <div
                key={item.id}
                ref={(el) => (itemRefs.current[index] = el)}
                className={cn(
                  "flex-shrink-0 flex items-center justify-center cursor-pointer transition-all duration-300 ease-out select-none",
                  "hover:scale-110"
                )}
                style={{ 
                  width: ITEM_WIDTH,
                  transform: `scale(${isFocused ? 1.3 : 1})`,
                  opacity: isFocused ? 1 : isAdjacent ? 0.6 : 0.3,
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
                onClick={() => handleItemClick(index)}
              >
                <div className="text-center select-none">
                  <div className={cn(
                    "text-lg transition-all duration-300 select-none",
                    isFocused ? "font-bold text-purple-600 dark:text-purple-400" : "font-normal text-gray-600 dark:text-gray-300"
                  )}>
                    {item.label}
                  </div>
                  {isFocused && (
                    <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mx-auto mt-1 transition-all duration-300" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}