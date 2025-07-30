import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import PlanetIcon from "@/components/PlanetIcon";
import ArticleCard from "@/components/ArticleCard";
import type { Actor, ArticleWithDetails } from "@shared/schema";

export default function ActorProfilePage() {
  const { id, returnTo } = useParams();
  const [, setLocation] = useLocation();

  const { data: actor, isLoading: actorLoading } = useQuery<Actor>({
    queryKey: [`/api/actors/${id}`],
    enabled: !!id,
  });

  const { data: articles, isLoading: articlesLoading } = useQuery<ArticleWithDetails[]>({
    queryKey: [`/api/actors/${id}/articles`],
    enabled: !!id,
  });

  if (actorLoading) {
    return (
      <div className="mobile-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="mobile-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Profile not found</p>
            <button 
              onClick={() => setLocation(returnTo ? `/article/${returnTo}` : '/')}
              className="text-primary hover:underline"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getVibrationalCircuits = () => {
    // Generate astrological circuits based on the actor's signs
    const circuits = [
      {
        name: "Personal Expression",
        planets: ["sun", "mercury", "venus"],
        description: "Core identity and creative expression"
      },
      {
        name: "Emotional Foundation", 
        planets: ["moon", "venus"],
        description: "Emotional patterns and relationships"
      },
      {
        name: "Drive & Ambition",
        planets: ["mars", "jupiter", "saturn"],
        description: "Action, growth, and life structure"
      },
      {
        name: "Higher Consciousness",
        planets: ["jupiter", "pluto"],
        description: "Spiritual growth and transformation"
      }
    ];
    return circuits;
  };

  const getCurrentTransits = () => {
    // Mock current transits - in real app this would come from API
    return [
      {
        transit: "Jupiter trine Natal Sun",
        effect: "Expansion of personal power and recognition",
        duration: "Active through March 2025",
        intensity: "high"
      },
      {
        transit: "Saturn square Natal Moon", 
        effect: "Emotional restructuring and growth",
        duration: "Peak influence February 2025",
        intensity: "medium"
      },
      {
        transit: "Venus conjunct Natal Mercury",
        effect: "Enhanced communication and charm",
        duration: "Active this week",
        intensity: "low"
      }
    ];
  };

  const handleBack = () => {
    if (returnTo) {
      setLocation(`/article/${returnTo}`);
    } else {
      setLocation('/');
    }
  };

  const vibrationalCircuits = getVibrationalCircuits();
  const currentTransits = getCurrentTransits();

  return (
    <div className="mobile-container bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <h1 className="text-lg font-bold">Astrological Profile</h1>
          
          <div className="w-10 h-10"></div> {/* Spacer for center alignment */}
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-4 pb-8">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
            {actor.name.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold mb-2">{actor.name}</h2>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Star className="w-4 h-4 mr-1" />
              {actor.category}
            </span>
          </div>
        </div>

        {/* Astrological Signs */}
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Astrological Blueprint</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                ☉
              </div>
              <p className="text-xs text-gray-600 mb-1">Sun Sign</p>
              <p className="font-bold text-sm">{actor.sunSign || 'Unknown'}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                ☽
              </div>
              <p className="text-xs text-gray-600 mb-1">Moon Sign</p>
              <p className="font-bold text-sm">{actor.moonSign || 'Unknown'}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                ↗
              </div>
              <p className="text-xs text-gray-600 mb-1">Rising Sign</p>
              <p className="font-bold text-sm">{actor.risingSign || 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Vibrational Astrology Circuits */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Vibrational Astrology Circuits</h3>
          <div className="space-y-4">
            {vibrationalCircuits.map((circuit, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm">{circuit.name}</h4>
                  <div className="flex space-x-1">
                    {circuit.planets.map((planet, planetIndex) => (
                      <PlanetIcon
                        key={planetIndex}
                        planet={planet}
                        color={`hsl(${210 + planetIndex * 30}, 70%, 50%)`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600">{circuit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current Planetary Transits */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Current Planetary Transits</h3>
          <div className="space-y-3">
            {currentTransits.map((transit, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm">{transit.transit}</h4>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    transit.intensity === 'high' && "bg-red-100 text-red-800",
                    transit.intensity === 'medium' && "bg-yellow-100 text-yellow-800", 
                    transit.intensity === 'low' && "bg-green-100 text-green-800"
                  )}>
                    {transit.intensity} intensity
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-1">{transit.effect}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {transit.duration}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Stories</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              {articles?.length || 0} articles
            </div>
          </div>
          
          {articlesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading stories...</p>
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="space-y-4">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No recent stories found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}