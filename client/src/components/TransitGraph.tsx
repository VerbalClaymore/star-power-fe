import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface TransitPoint {
  date: Date;
  orb: number; // Distance between planets in degrees
  isRetrograde?: boolean;
}

interface KeyframeEvent {
  date: Date;
  label: string;
  glyph: string;
  type: 'bottom' | 'peak'; // bottom axis or peak marker
}

interface TransitData {
  id: string;
  title: string;
  aspect: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';
  planets: string[];
  element: 'fire' | 'earth' | 'air' | 'water';
  points: TransitPoint[];
  keyframes: KeyframeEvent[];
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
  const [scrubbing, setScrubbing] = useState(false);
  const [scrubPosition, setScrubPosition] = useState<{ x: number; date: Date } | null>(null);
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

  // Get date from X coordinate
  const getDateFromX = useCallback((x: number): Date => {
    const padding = 20;
    const graphWidth = width - (padding * 2);
    const normalizedX = Math.max(0, Math.min(1, (x - padding) / graphWidth));
    const totalDuration = data.points[data.points.length - 1].date.getTime() - data.points[0].date.getTime();
    const targetTime = data.points[0].date.getTime() + (normalizedX * totalDuration);
    return new Date(targetTime);
  }, [data.points, width]);

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Handle pan and zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.shiftKey || e.ctrlKey) {
      // Scrubbing mode
      setScrubbing(true);
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const date = getDateFromX(x);
        setScrubPosition({ x, date });
      }
    } else {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (scrubbing) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const date = getDateFromX(x);
        setScrubPosition({ x, date });
      }
      return;
    }
    
    if (!isDragging) return;
    
    setTransform(prev => ({
      ...prev,
      x: prev.x + e.movementX,
      y: prev.y + e.movementY
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setScrubbing(false);
    setScrubPosition(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale * scaleChange))
    }));
  };

  // Touch handling for mobile zoom/pan and scrubbing
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        const x = touch.clientX - rect.left;
        const date = getDateFromX(x);
        setScrubbing(true);
        setScrubPosition({ x, date });
      }
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
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect && scrubbing) {
        const x = touch.clientX - rect.left;
        const date = getDateFromX(x);
        setScrubPosition({ x, date });
        return;
      }
      
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
                
                {/* Keyframe markers on peaks */}
                {data.keyframes.filter(kf => kf.type === 'peak').map((keyframe, index) => {
                  const keyframePadding = 20;
                  const keyframeGraphWidth = width - (keyframePadding * 2);
                  const keyframeTime = keyframe.date.getTime();
                  const startTime = data.points[0].date.getTime();
                  const endTime = data.points[data.points.length - 1].date.getTime();
                  const normalizedX = (keyframeTime - startTime) / (endTime - startTime);
                  const x = keyframePadding + normalizedX * keyframeGraphWidth;
                  
                  return (
                    <g key={`peak-${index}`}>
                      <line
                        x1={x}
                        y1={keyframePadding}
                        x2={x}
                        y2={keyframePadding - 15}
                        stroke={color}
                        strokeWidth="2"
                        className="opacity-80"
                      />
                      <rect
                        x={x - 25}
                        y={keyframePadding - 35}
                        width="50"
                        height="18"
                        rx="9"
                        fill="white"
                        stroke={color}
                        strokeWidth="1"
                        className="drop-shadow-sm"
                      />
                      <text
                        x={x}
                        y={keyframePadding - 24}
                        textAnchor="middle"
                        className="text-xs font-medium fill-current"
                        style={{ fill: color }}
                      >
                        {keyframe.glyph}
                      </text>
                    </g>
                  );
                })}

                {/* Scrub line and date indicator */}
                {scrubPosition && (
                  <g>
                    <line
                      x1={scrubPosition.x}
                      y1={20}
                      x2={scrubPosition.x}
                      y2={height - 30}
                      stroke="rgba(0,0,0,0.6)"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                    <rect
                      x={scrubPosition.x - 30}
                      y={5}
                      width="60"
                      height="14"
                      rx="7"
                      fill="rgba(0,0,0,0.8)"
                      className="drop-shadow-lg"
                    />
                    <text
                      x={scrubPosition.x}
                      y={14}
                      textAnchor="middle"
                      className="text-xs font-medium fill-white"
                    >
                      {formatDate(scrubPosition.date)}
                    </text>
                  </g>
                )}
              </g>
              
              {/* Subtle grid lines */}
              <defs>
                <pattern id={`grid-${data.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-300 dark:text-gray-600" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width={width} height={height} fill={`url(#grid-${data.id})`} />
              
              {/* Bottom axis timeline labels */}
              <g>
                {/* Start date */}
                <text
                  x={20}
                  y={height - 5}
                  textAnchor="start"
                  className="text-xs fill-gray-500 dark:fill-gray-400"
                >
                  {formatDate(data.points[0].date)}
                </text>
                
                {/* End date */}
                <text
                  x={width - 20}
                  y={height - 5}
                  textAnchor="end"
                  className="text-xs fill-gray-500 dark:fill-gray-400"
                >
                  {formatDate(data.points[data.points.length - 1].date)}
                </text>

                {/* Bottom axis keyframe markers */}
                {data.keyframes.filter(kf => kf.type === 'bottom').map((keyframe, index) => {
                  const keyframeTime = keyframe.date.getTime();
                  const startTime = data.points[0].date.getTime();
                  const endTime = data.points[data.points.length - 1].date.getTime();
                  const normalizedX = (keyframeTime - startTime) / (endTime - startTime);
                  const x = 20 + normalizedX * (width - 40);
                  
                  return (
                    <g key={`bottom-${index}`}>
                      <line
                        x1={x}
                        y1={height - 30}
                        x2={x}
                        y2={height - 20}
                        stroke={color}
                        strokeWidth="1"
                        className="opacity-70"
                      />
                      <rect
                        x={x - 35}
                        y={height - 50}
                        width="70"
                        height="16"
                        rx="8"
                        fill="white"
                        stroke={color}
                        strokeWidth="1"
                        className="drop-shadow-sm"
                      />
                      <text
                        x={x}
                        y={height - 40}
                        textAnchor="middle"
                        className="text-xs font-medium"
                        style={{ fill: color }}
                      >
                        {keyframe.glyph}
                      </text>
                      <text
                        x={x}
                        y={height - 28}
                        textAnchor="middle"
                        className="text-xs fill-gray-600 dark:fill-gray-400"
                      >
                        {formatDate(keyframe.date)}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
            
            {/* Mobile scrub instruction */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Tap and drag to scrub timeline
            </p>
          </div>
        </div>
      )}
    </div>
  );
}