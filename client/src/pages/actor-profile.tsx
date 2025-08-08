import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import BottomNavigation from "@/components/BottomNavigation";
import HorizontalTimeline from "@/components/HorizontalTimeline";
import type { Actor, ArticleWithDetails } from "@shared/schema";

type TabOption = 'overview' | 'vibes' | 'stars' | 'houses' | 'transits';

export default function ActorProfilePage() {
  const { id, returnTo } = useParams();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabOption>('overview');
  const [selectedRelationship, setSelectedRelationship] = useState<Actor | null>(null);
  const [expandedVibrations, setExpandedVibrations] = useState<Set<number>>(new Set());
  const [selectedCircuits, setSelectedCircuits] = useState<Map<number, number>>(new Map());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

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
    { id: 'overview', label: 'Overview' },
    { id: 'vibes', label: 'Vibes' },
    { id: 'stars', label: 'Stars' },
    { id: 'houses', label: 'Houses' },
    { id: 'transits', label: 'Transits' }
  ];

  const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

  // Generate timeline years (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const timelineItems = Array.from({ length: 11 }, (_, i) => {
    const year = currentYear - 5 + i;
    return {
      id: year.toString(),
      label: year.toString(),
      year: year
    };
  });

  // Mock function to get articles by year
  const getArticlesByYear = (year: number) => {
    // In real app, this would query actual data
    return [
      {
        id: '1',
        title: `${actor?.name || 'Celebrity'} makes headlines in ${year}`,
        date: new Date(year, 5, 15),
        summary: `Major entertainment news story from ${year} featuring ${actor?.name || 'this celebrity'}.`,
        imageUrl: undefined
      },
      {
        id: '2',
        title: `${year} Awards Season buzz`,
        date: new Date(year, 2, 20),
        summary: `Award nominations and industry recognition in ${year}.`,
        imageUrl: undefined
      }
    ];
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Summary Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-sm mb-2">About {actor?.name}</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {actor?.name} is a prominent figure in {actor?.category?.toLowerCase() || 'entertainment'}, 
                known for their significant influence in the industry. With their {actor?.sunSign} sun sign, 
                {actor?.moonSign && ` ${actor.moonSign} moon,`} 
                {actor?.risingSign && ` and ${actor.risingSign} rising,`} 
                they bring a unique astrological profile to their public persona.
              </p>
            </div>

            {/* Relationships Section */}
            <div>
              <h4 className="font-bold text-sm mb-3">Key Relationships</h4>
              {relationshipsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading relationships...</p>
                </div>
              ) : relationships && relationships.length > 0 ? (
                <div className="space-y-2">
                  {relationships.slice(0, 3).map((relationship) => (
                    <button
                      key={relationship.id}
                      onClick={() => setLocation(`/actor/${relationship.id}`)}
                      className="w-full p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {relationship.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{relationship.name}</h5>
                          <p className="text-xs text-gray-500">{relationship.category}</p>
                        </div>
                        <span className="text-xs text-purple-600">View →</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    👥
                  </div>
                  <p className="text-sm text-gray-500">No relationships found</p>
                </div>
              )}
            </div>

            {/* Timeline Section */}
            <div>
              <h4 className="font-bold text-sm mb-3">Timeline</h4>
              <div className="bg-white border border-gray-200 rounded-lg">
                <HorizontalTimeline
                  initialYear={currentYear}
                  items={timelineItems}
                  onFocusChange={handleYearChange}
                />
                
                {/* Articles for selected year */}
                <div className="p-4 border-t border-gray-100">
                  <h5 className="font-medium text-sm mb-3">News from {selectedYear}</h5>
                  <div className="space-y-3">
                    {getArticlesByYear(selectedYear).map((article) => (
                      <div key={article.id} className="p-3 bg-gray-50 rounded-lg">
                        <h6 className="font-medium text-sm mb-1">{article.title}</h6>
                        <p className="text-xs text-gray-600 mb-2">{article.summary}</p>
                        <p className="text-xs text-gray-400">
                          {article.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'vibes':
        const vibrations = [
          {
            number: 1,
            title: "Inner Unity",
            circuits: [
              {
                id: 0,
                planets: ["sun", "mercury"],
                description: "Represents harmony between core identity and communication, creating clear self-expression and authentic messaging."
              },
              {
                id: 1,
                planets: ["moon", "venus"],
                description: "Combines emotional awareness with relationship harmony, fostering inner peace and loving connections."
              }
            ]
          },
          {
            number: 2,
            title: "External Connection",
            circuits: [
              {
                id: 0,
                planets: ["venus", "mars"],
                description: "The classic attraction circuit - balances desire with action, creating magnetic appeal and relationship dynamics."
              },
              {
                id: 1,
                planets: ["jupiter", "saturn"],
                description: "Expansion meets structure - enables growth while maintaining boundaries in partnerships."
              },
              {
                id: 2,
                planets: ["mercury", "neptune"],
                description: "Communication flows through intuitive channels, enabling deep understanding and psychic connection."
              }
            ]
          },
          {
            number: 3,
            title: "Pleasant Flow",
            circuits: [
              {
                id: 0,
                planets: ["jupiter", "venus"],
                description: "The harmony and abundance circuit - brings joy, creativity, and positive social connections."
              }
            ]
          },
          {
            number: 4,
            title: "Drive & Motivation",
            circuits: [
              {
                id: 0,
                planets: ["mars", "saturn"],
                description: "Disciplined action - channels raw drive through structured effort for lasting achievement."
              },
              {
                id: 1,
                planets: ["sun", "pluto"],
                description: "Transformational power - core identity backed by intense regenerative force."
              }
            ]
          },
          {
            number: 5,
            title: "Exploration & Play",
            circuits: [
              {
                id: 0,
                planets: ["mercury", "venus"],
                description: "Playful communication and artistic expression - finds joy in learning and creative exchange."
              },
              {
                id: 1,
                planets: ["jupiter", "uranus"],
                description: "Adventure and innovation - seeks new experiences and revolutionary insights."
              },
              {
                id: 2,
                planets: ["moon", "neptune"],
                description: "Imaginative exploration - discovers through dreams, intuition, and emotional depth."
              }
            ]
          },
          {
            number: 6,
            title: "Shared Harmony",
            circuits: [
              {
                id: 0,
                planets: ["venus", "jupiter"],
                description: "Social grace and generosity - creates beautiful relationships and shared abundance."
              }
            ]
          },
          {
            number: 7,
            title: "Deep Analysis",
            circuits: []
          },
          {
            number: 8,
            title: "Action Energy",
            circuits: [
              {
                id: 0,
                planets: ["mars", "pluto"],
                description: "Intense transformational action - raw power channeled toward complete regeneration."
              },
              {
                id: 1,
                planets: ["sun", "saturn"],
                description: "Authoritative leadership - personal power expressed through disciplined responsibility."
              }
            ]
          },
          {
            number: 9,
            title: "Ideal Community",
            circuits: [
              {
                id: 0,
                planets: ["jupiter", "uranus"],
                description: "Revolutionary expansion - seeks progressive communities that embrace innovation and growth."
              },
              {
                id: 1,
                planets: ["venus", "neptune"],
                description: "Compassionate unity - dreams of harmonious communities built on love and understanding."
              }
            ]
          },
          {
            number: 10,
            title: "Beyond Self",
            circuits: [
              {
                id: 0,
                planets: ["saturn", "neptune"],
                description: "Spiritual discipline - structures dissolve to reveal higher consciousness and universal connection."
              }
            ]
          },
          {
            number: 11,
            title: "Complex Relations",
            circuits: [
              {
                id: 0,
                planets: ["uranus", "neptune"],
                description: "Innovative intuition - sudden insights merge with spiritual awareness for breakthrough understanding."
              },
              {
                id: 1,
                planets: ["mercury", "pluto"],
                description: "Deep communication - transforms thoughts and words with penetrating psychological insight."
              },
              {
                id: 2,
                planets: ["venus", "saturn"],
                description: "Committed relationships - love expressed through loyalty, responsibility, and lasting bonds."
              }
            ]
          },
          {
            number: 12,
            title: "Balanced Action",
            circuits: [
              {
                id: 0,
                planets: ["neptune", "pluto"],
                description: "Spiritual transformation - dissolves ego boundaries to access deep regenerative power."
              }
            ]
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

        const selectCircuit = (vibrationNumber: number, circuitId: number) => {
          setSelectedCircuits(prev => {
            const newMap = new Map(prev);
            newMap.set(vibrationNumber, circuitId);
            return newMap;
          });
        };

        const getSelectedDescription = (vibrationNumber: number, circuits: any[]) => {
          const selectedCircuitId = selectedCircuits.get(vibrationNumber);
          if (selectedCircuitId !== undefined && circuits[selectedCircuitId]) {
            return circuits[selectedCircuitId].description;
          }
          return circuits.length > 0 ? circuits[0].description : '';
        };

        const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
        
        return (
          <div className="space-y-2">
            {vibrations.map((vibration) => (
              <div key={vibration.number} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleVibration(vibration.number)}
                  className="w-full p-3 text-left flex items-center justify-between hover:bg-gray-50"
                  data-testid={`button-vibration-${vibration.number}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {romanNumerals[vibration.number - 1]}
                    </div>
                    <h4 className="font-bold text-sm">({vibration.number}) {vibration.title}</h4>
                  </div>
                  {expandedVibrations.has(vibration.number) ? 
                    <ChevronUp className="w-4 h-4" /> : 
                    <ChevronDown className="w-4 h-4" />
                  }
                </button>
                
                {expandedVibrations.has(vibration.number) && (
                  <div className="px-3 pb-3 border-t border-gray-100">
                    {vibration.circuits.length > 0 ? (
                      <>
                        {/* Circuit Cards */}
                        <div className="space-y-2 mb-3 mt-3">
                          {vibration.circuits.map((circuit, circuitIndex) => {
                            const isSelected = selectedCircuits.get(vibration.number) === circuit.id || 
                                             (selectedCircuits.get(vibration.number) === undefined && circuitIndex === 0);
                            return (
                              <button
                                key={circuit.id}
                                onClick={() => selectCircuit(vibration.number, circuit.id)}
                                className={cn(
                                  "w-full p-3 rounded-lg border-2 transition-colors text-left",
                                  isSelected 
                                    ? "border-purple-500 bg-purple-50" 
                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                )}
                                data-testid={`button-circuit-${vibration.number}-${circuit.id}`}
                              >
                                <div className="flex space-x-1 mb-2">
                                  {circuit.planets.map((planet, planetIndex) => (
                                    <div
                                      key={planetIndex}
                                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                      style={{ backgroundColor: getPlanetColor(planet) }}
                                    >
                                      {planet === 'mercury' ? '☿' : planet === 'venus' ? '♀' : planet === 'mars' ? '♂' : 
                                       planet === 'jupiter' ? '♃' : planet === 'saturn' ? '♄' : planet === 'sun' ? '☉' :
                                       planet === 'moon' ? '☽' : planet === 'uranus' ? '♅' : planet === 'neptune' ? '♆' :
                                       planet === 'pluto' ? '♇' : '●'}
                                    </div>
                                  ))}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        
                        {/* Dynamic Description */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600" data-testid={`text-description-${vibration.number}`}>
                            {getSelectedDescription(vibration.number, vibration.circuits)}
                          </p>
                        </div>
                      </>
                    ) : (
                      /* Empty State */
                      <div className="text-center py-6" data-testid={`empty-state-${vibration.number}`}>
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-gray-400 text-xl">∅</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">No circuits found</p>
                        <p className="text-xs text-gray-400">This vibration currently has no planetary circuits</p>
                      </div>
                    )}
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
    <div className="bg-white min-h-screen pb-20">
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