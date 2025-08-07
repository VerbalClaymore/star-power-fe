import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import BottomNavigation from "@/components/BottomNavigation";
import type { Actor, ArticleWithDetails } from "@shared/schema";

type TabOption = 'relationships' | 'vibes' | 'stars' | 'houses' | 'transits';

export default function ActorProfilePage() {
  const { id, returnTo } = useParams();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabOption>('relationships');
  const [selectedRelationship, setSelectedRelationship] = useState<Actor | null>(null);
  const [expandedVibrations, setExpandedVibrations] = useState<Set<number>>(new Set());

  const { data: actor, isLoading: actorLoading } = useQuery<Actor>({
    queryKey: [`/api/actors/${id}`],
    enabled: !!id,
  });

  const { data: relationships, isLoading: relationshipsLoading } = useQuery<Actor[]>({
    queryKey: [`/api/actors/${id}/relationships`],
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

  const getPlanetColor = (planet: string) => {
    const colors: Record<string, string> = {
      sun: '#FFA500',
      moon: '#C0C0C0', 
      mercury: '#D2B48C',
      venus: '#F5F5DC',
      mars: '#B22222',
      jupiter: '#FF4500',
      saturn: '#4169E1',
      uranus: '#87CEEB',
      neptune: '#40E0D0',
      pluto: '#8A2BE2',
    };
    return colors[planet.toLowerCase()] || '#808080';
  };

  const getPlanetDegree = (planet: string) => {
    // Mock degrees - in real app this would come from API
    const degrees: Record<string, string> = {
      sun: '15°',
      moon: '23°',
      mercury: '8°',
      venus: '2°',
      mars: '29°',
      jupiter: '12°',
      saturn: '7°',
      uranus: '18°',
      neptune: '4°',
      pluto: '26°'
    };
    return degrees[planet.toLowerCase()] || '0°';
  };

  const getZodiacSign = (planet: string) => {
    // Mock signs - in real app this would come from API
    const signs: Record<string, string> = {
      sun: actor?.sunSign || 'Sagittarius',
      moon: actor?.moonSign || 'Cancer', 
      mercury: 'Capricorn',
      venus: 'Aquarius',
      mars: 'Scorpio',
      jupiter: 'Pisces',
      saturn: 'Virgo',
      uranus: 'Taurus',
      neptune: 'Pisces',
      pluto: 'Capricorn'
    };
    return signs[planet.toLowerCase()] || 'Unknown';
  };

  const getHousePlanets = (houseNumber: number) => {
    // Mock house data - in real app this would come from API
    const housePlanets: Record<number, string[]> = {
      1: ['mars'],
      2: ['venus'],
      3: ['mercury'],
      4: ['moon'],
      5: ['sun'],
      6: [],
      7: ['jupiter'],
      8: ['pluto'],
      9: [],
      10: ['saturn'],
      11: ['uranus'],
      12: ['neptune']
    };
    return housePlanets[houseNumber] || [];
  };

  const getHouseSign = (houseNumber: number) => {
    // First house is rising sign, others follow zodiacal order
    const zodiacOrder = [
      actor?.risingSign || 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 
      'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra'
    ];
    return zodiacOrder[(houseNumber - 1) % 12];
  };

  const handleBack = () => {
    if (returnTo) {
      setLocation(`/article/${returnTo}`);
    } else {
      setLocation('/');
    }
  };

  const tabs = [
    { id: 'relationships', label: 'Relationships' },
    { id: 'vibes', label: 'Vibes' },
    { id: 'stars', label: 'Stars' },
    { id: 'houses', label: 'Houses' },
    { id: 'transits', label: 'Transits' }
  ];

  const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'relationships':
        return (
          <div>
            {relationshipsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading relationships...</p>
              </div>
            ) : relationships && relationships.length > 0 ? (
              <div className="space-y-3">
                {relationships.map((relationship) => (
                  <button
                    key={relationship.id}
                    onClick={() => setSelectedRelationship(relationship.id === selectedRelationship?.id ? null : relationship)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                          {relationship.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{relationship.name}</h4>
                          <p className="text-xs text-gray-500">{relationship.category}</p>
                        </div>
                      </div>
                      {selectedRelationship?.id === relationship.id && (
                        <div className="text-purple-600">
                          <span className="text-xs font-medium">Selected</span>
                        </div>
                      )}
                    </div>
                    {selectedRelationship?.id === relationship.id && (
                      <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-bold text-sm text-purple-900 mb-2">
                          Relationship with {selectedRelationship.name}
                        </h4>
                        <p className="text-sm text-purple-700 mb-3">
                          These two frequently appear together in entertainment news, indicating a significant 
                          professional or personal connection that generates media attention.
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/actor/${selectedRelationship.id}`);
                          }}
                          className="text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors"
                        >
                          View {selectedRelationship.name}'s Profile →
                        </button>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  👥
                </div>
                <p className="text-gray-500">No relationships found</p>
              </div>
            )}
          </div>
        );

      case 'vibes':
        const vibrations = [
          {
            number: 1,
            title: "Inner Unity",
            description: "Represents things working together, focused on the self",
            planets: ["sun", "mercury"]
          },
          {
            number: 2,
            title: "External Connection", 
            description: "Governs polarity and is entirely focused on relating to things outside of oneself",
            planets: ["venus", "mars"]
          },
          {
            number: 3,
            title: "Pleasant Flow",
            description: "Characterized by a harmonious and pleasant flow of experience and energy; it is active",
            planets: ["jupiter"]
          },
          {
            number: 4,
            title: "Drive & Motivation",
            description: "Represents motivation and drive",
            planets: ["mars", "saturn"]
          },
          {
            number: 5,
            title: "Exploration & Play",
            description: "It is about interaction with and exploration of the world without an agenda. Play.",
            planets: ["mercury", "venus"]
          },
          {
            number: 6,
            title: "Shared Harmony",
            description: "Indicates a harmonious flow relating to shared characteristics and similarities",
            planets: ["venus", "jupiter"]
          },
          {
            number: 8,
            title: "Action Energy",
            description: "It provides a picture of your fundamental 'go out and take action energy' and the basic energy driving you to take action in your life",
            planets: ["mars", "pluto"]
          },
          {
            number: 9,
            title: "Ideal Community",
            description: "Relates to your ideal social group",
            planets: ["jupiter", "uranus"]
          },
          {
            number: 10,
            title: "Beyond Self",
            description: "Understanding the world beyond the self",
            planets: ["saturn", "neptune"]
          },
          {
            number: 11,
            title: "Complex Relations",
            description: "A primary tool for understanding complex relationships",
            planets: ["uranus", "neptune"]
          },
          {
            number: 12,
            title: "Balanced Action",
            description: "Combines the need to act with the need to ensure others are happy with your actions",
            planets: ["neptune", "pluto"]
          }
        ];

        const toggleVibration = (number: number) => {
          setExpandedVibrations(prev => {
            const newSet = new Set(prev);
            if (newSet.has(number)) {
              newSet.delete(number);
            } else {
              newSet.add(number);
            }
            return newSet;
          });
        };

        const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
        
        return (
          <div className="space-y-2">
            {vibrations.map((vibration) => (
              <div key={vibration.number} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleVibration(vibration.number)}
                  className="w-full p-3 text-left flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {romanNumerals[vibration.number - 1]}
                    </div>
                    <h4 className="font-bold text-sm">{vibration.title}</h4>
                  </div>
                  {expandedVibrations.has(vibration.number) ? 
                    <ChevronUp className="w-4 h-4" /> : 
                    <ChevronDown className="w-4 h-4" />
                  }
                </button>
                
                {expandedVibrations.has(vibration.number) && (
                  <div className="px-3 pb-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600 mb-2 mt-2">{vibration.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Planets:</span>
                      <div className="flex space-x-1">
                        {vibration.planets.map((planet, planetIndex) => (
                          <div
                            key={planetIndex}
                            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: getPlanetColor(planet) }}
                          >
                            {planet === 'mercury' ? '☿' : planet === 'venus' ? '♀' : planet === 'mars' ? '♂' : 
                             planet === 'jupiter' ? '♃' : planet === 'saturn' ? '♄' : planet === 'sun' ? '☉' :
                             planet === 'moon' ? '☽' : planet === 'uranus' ? '♅' : planet === 'neptune' ? '♆' :
                             planet === 'pluto' ? '♇' : '●'}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'stars':
        return (
          <div className="space-y-2">
            {planets.map((planet) => (
              <div key={planet} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: getPlanetColor(planet) }}
                  >
                    {planet === 'mercury' ? '☿' : planet === 'venus' ? '♀' : planet === 'mars' ? '♂' : 
                     planet === 'jupiter' ? '♃' : planet === 'saturn' ? '♄' : planet === 'sun' ? '☉' :
                     planet === 'moon' ? '☽' : planet === 'uranus' ? '♅' : planet === 'neptune' ? '♆' :
                     planet === 'pluto' ? '♇' : '●'}
                  </div>
                  <h4 className="font-bold text-sm capitalize flex-1">{planet}</h4>
                  <p className="text-sm font-medium flex-1">{getZodiacSign(planet)}</p>
                  <p className="text-sm font-bold">{getPlanetDegree(planet)}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'houses':
        const houseNames = [
          "Self", "Wealth", "Siblings and Routines", "Family and Home", 
          "Creation and Joy", "Service", "Others", "Wealth of Others",
          "The Quest", "Career", "Network", "Hidden Enemies"
        ];
        
        return (
          <div className="space-y-2">
            {Array.from({length: 12}, (_, i) => i + 1).map((houseNum) => {
              const housePlanets = getHousePlanets(houseNum);
              const houseSign = getHouseSign(houseNum);
              return (
                <div key={houseNum} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {houseNum}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{houseSign}</h4>
                        <p className="text-xs text-gray-500">{houseNames[houseNum - 1]}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {housePlanets.length > 0 ? housePlanets.map((planet, planetIndex) => (
                        <div
                          key={planetIndex}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: getPlanetColor(planet) }}
                        >
                          {planet === 'mercury' ? '☿' : planet === 'venus' ? '♀' : planet === 'mars' ? '♂' : 
                           planet === 'jupiter' ? '♃' : planet === 'saturn' ? '♄' : planet === 'sun' ? '☉' :
                           planet === 'moon' ? '☽' : planet === 'uranus' ? '♅' : planet === 'neptune' ? '♆' :
                           planet === 'pluto' ? '♇' : '●'}
                        </div>
                      )) : (
                        <span className="text-xs text-gray-400 px-1">Empty</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'transits':
        const currentTransits = [
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

        return (
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
                <p className="text-sm text-gray-700 mb-2">{transit.effect}</p>
                <p className="text-xs text-gray-500">{transit.duration}</p>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mobile-container bg-white min-h-screen pb-20">
      {/* Header with category accent */}
      <div className="sticky top-0 bg-white border-b-4 z-10" 
           style={{ borderBottomColor: 'hsl(329, 86%, 70%)' }}>
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center">
            <span className="mr-2 text-lg">⭐</span>
            <h1 className="text-lg font-bold">Astrological Profile</h1>
          </div>
          
          <div className="w-10 h-10"></div> {/* Spacer for center alignment */}
        </div>
      </div>

      {/* Compressed Profile Header */}
      <div className="p-4">
        <div className="bg-purple-50 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {actor.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1">{actor.name}</h2>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="w-4 h-4 mr-1" />
                {actor.category}
              </div>
            </div>
          </div>
          
          {/* Sun Moon Rising in compact row */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-1">
                ☉
              </div>
              <p className="text-xs text-gray-600">Sun</p>
              <p className="font-bold text-xs">{actor.sunSign || 'Unknown'}</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-1">
                ☽
              </div>
              <p className="text-xs text-gray-600">Moon</p>
              <p className="font-bold text-xs">{actor.moonSign || 'Unknown'}</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-1">
                ↗
              </div>
              <p className="text-xs text-gray-600">Rising</p>
              <p className="font-bold text-xs">{actor.risingSign || 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabOption)}
                className={cn(
                  "flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {renderTabContent()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}