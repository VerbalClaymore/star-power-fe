import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface TransitPoint {
  date: Date;
  orb: number; // Distance between planets in degrees
  isRetrograde?: boolean;
}

interface TransitData {
  id: string;
  title: string;
  aspect: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';
  planets: string[];
  element: 'fire' | 'earth' | 'air' | 'water';
  points: TransitPoint[];
  maxOrb: number;
  minOrb: number;
}

interface TransitGraphProps {
  data: TransitData;
  width?: number;
  height?: number;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export default function TransitGraph({ 
  data, 
  width = 320, 
  height = 120, 
  isExpanded = false,
  onToggle 
}: TransitGraphProps) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState<{ x: number; y: number; time: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Element color mapping aligned with app aesthetic
  const getElementColor = (element: string): string => {
    const colors = {
      fire: '#DC2626',     // Red-600 - passionate, energetic
      earth: '#059669',    // Emerald-600 - grounding, practical  
      air: '#D97706',      // Amber-600 - intellectual, communicative
      water: '#0891B2'     // Cyan-600 - emotional, intuitive
    };
    return colors[element as keyof typeof colors] || colors.fire;
  };

  // Generate SVG path for the transit curve
  const generatePath = useCallback(() => {
    if (!data.points.length) return '';
    
    const padding = 20;
    const graphWidth = width - (padding * 2);
    const graphHeight = height - (padding * 2);
    
    // Create smooth curve through points
    const points = data.points.map((point, index) => {
      const x = padding + (index / (data.points.length - 1)) * graphWidth;
      // Calculate orb strength - smaller orbs = higher peaks (stronger aspect)
      const orbStrength = (data.maxOrb - point.orb) / (data.maxOrb - data.minOrb);
      const y = padding + (1 - orbStrength) * graphHeight; // Invert so peaks go up
      return { x, y, orb: point.orb, orbStrength, isRetrograde: point.isRetrograde };
    });

    // Create path with area fill
    let pathData = `M ${points[0].x} ${height - padding}`;
    pathData += ` L ${points[0].x} ${points[0].y}`;
    
    // Smooth curve through all points
    for (let i = 0; i < points.length; i++) {
      if (i === 0) {
        pathData += ` L ${points[i].x} ${points[i].y}`;
      } else if (i === 1) {
        pathData += ` Q ${points[i-1].x} ${points[i-1].y} ${points[i].x} ${points[i].y}`;
      } else {
        // Use quadratic curves for smoothness
        const cpx = (points[i-1].x + points[i].x) / 2;
        const cpy = (points[i-1].y + points[i].y) / 2;
        pathData += ` Q ${cpx} ${cpy} ${points[i].x} ${points[i].y}`;
      }
    }
    
    // Close the area
    pathData += ` L ${points[points.length - 1].x} ${height - padding}`;
    pathData += ' Z';
    
    return pathData;
  }, [data, width, height]);

  // Handle pan and zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setTransform(prev => ({
      ...prev,
      x: prev.x + e.movementX,
      y: prev.y + e.movementY
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale * scaleChange))
    }));
  };

  // Touch handling for mobile zoom/pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setLastTouch({ 
        x: touch.clientX, 
        y: touch.clientY, 
        time: Date.now() 
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && lastTouch) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastTouch.x;
      const deltaY = touch.clientY - lastTouch.y;
      
      setTransform(prev => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastTouch({ 
        x: touch.clientX, 
        y: touch.clientY, 
        time: Date.now() 
      });
    }
  };

  // Double tap to reset
  const handleDoubleClick = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  const getAspectSymbol = (aspect: string): string => {
    const symbols = {
      conjunction: '☌',
      opposition: '☍', 
      trine: '△',
      square: '□',
      sextile: '⚹'
    };
    return symbols[aspect as keyof typeof symbols] || '☌';
  };

  const color = getElementColor(data.element);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-3 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        data-testid={`button-transit-${data.id}`}
      >
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: color }}
          >
            {getAspectSymbol(data.aspect)}
          </div>
          <div>
            <h4 className="font-bold text-sm dark:text-gray-300">{data.title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {data.planets.join(' ')} • {data.aspect}
            </p>
          </div>
        </div>
        <div className="text-gray-400">
          {isExpanded ? '−' : '+'}
        </div>
      </button>

      {/* Graph Content */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <svg
              ref={svgRef}
              width={width}
              height={height}
              className="rounded cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onDoubleClick={handleDoubleClick}
              style={{ touchAction: 'none' }}
            >
              <defs>
                <linearGradient id={`gradient-${data.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.2" />
                </linearGradient>
              </defs>
              
              <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
                {/* Transit curve area */}
                <path
                  d={generatePath()}
                  fill={`url(#gradient-${data.id})`}
                  stroke={color}
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
                
                {/* Retrograde markers */}
                {data.points.map((point, index) => {
                  if (!point.isRetrograde) return null;
                  
                  const padding = 20;
                  const graphWidth = width - (padding * 2);
                  const graphHeight = height - (padding * 2);
                  const x = padding + (index / (data.points.length - 1)) * graphWidth;
                  const orbStrength = (data.maxOrb - point.orb) / (data.maxOrb - data.minOrb);
                  const y = padding + (1 - orbStrength) * graphHeight;
                  
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="3"
                      fill={color}
                      stroke="white"
                      strokeWidth="1"
                      className="opacity-90"
                    />
                  );
                })}
              </g>
              
              {/* Subtle grid lines */}
              <defs>
                <pattern id={`grid-${data.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-300 dark:text-gray-600" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width={width} height={height} fill={`url(#grid-${data.id})`} />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}