import { cn } from "@/lib/utils";

interface PlanetIconProps {
  planet: string;
  symbol?: string;
  color: string;
}

export default function PlanetIcon({ planet, symbol, color }: PlanetIconProps) {
  const getPlanetClass = (planetName: string) => {
    return `planet-${planetName}`;
  };

  return (
    <div className="relative w-6 h-6">
      <div 
        className={cn("w-6 h-6 rounded-full", getPlanetClass(planet))}
        style={{ backgroundColor: color }}
      />
      {symbol && (
        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
          {symbol}
        </span>
      )}
    </div>
  );
}
