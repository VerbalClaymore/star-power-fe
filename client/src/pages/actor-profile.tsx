import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, ChevronDown, ChevronUp, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import BottomNavigation from "@/components/BottomNavigation";
import HorizontalTimeline from "@/components/HorizontalTimeline";
import { useTheme } from "@/contexts/ThemeContext";
import type { Actor, ArticleWithDetails } from "@shared/schema";

type TabOption = 'overview' | 'vibes' | 'stars' | 'houses' | 'transits';

export default function ActorProfilePage() {
  const { id, returnTo } = useParams();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabOption>('overview');
  const { theme, toggleTheme } = useTheme();
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

  // Get articles by year for this actor
  const { data: actorArticles } = useQuery({
    queryKey: ['/api/actors', actor?.id, 'articles'],
    enabled: !!actor?.id,
  });

  // Generate timeline years based on actual article data
  const currentYear = new Date().getFullYear();
  const availableYears = actorArticles ? 
    Array.from(new Set((actorArticles as any[]).map((article: any) => new Date(article.publishedAt).getFullYear())))
      .sort((a, b) => a - b) : [];
  
  // Create timeline items with a full range from earliest year to current year
  const timelineItems = (() => {
    if (availableYears.length > 0) {
      const minYear = Math.min(...availableYears);
      const maxYear = Math.max(currentYear, Math.max(...availableYears));
      
      return Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
        const year = minYear + i;
        return {
          id: year.toString(),
          label: year.toString(),
          year: year
        };
      });
    } else {
      // Fallback: create a 10-year range centered around current year
      return Array.from({ length: 10 }, (_, i) => {
        const year = currentYear - 5 + i;
        return {
          id: year.toString(),
          label: year.toString(),
          year: year
        };
      });
    }
  })();

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
      window.history.back();
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

  const getArticlesByYear = (year: number) => {
    if (!actorArticles) return [];
    
    return (actorArticles as any[]).filter((article: any) => {
      const articleYear = new Date(article.publishedAt).getFullYear();
      return articleYear === year;
    });
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
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-bold text-sm mb-2 text-gray-900 dark:text-gray-300">
                About {actor?.name}
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {actor?.name} is a prominent figure in {actor?.category?.toLowerCase() || 'entertainment'}, 
                known for their significant influence in the industry. With their {actor?.sunSign} sun sign, 
                {actor?.moonSign && ` ${actor.moonSign} moon,`} 
                {actor?.risingSign && ` and ${actor.risingSign} rising,`} 
                they bring a unique astrological profile to their public persona.
              </p>
            </div>

            {/* Relationships Section */}
            <div>
              <h4 className="font-bold text-sm mb-3">Featured</h4>
              {relationshipsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading relationships...</p>
                </div>
              ) : relationships && relationships.length > 0 ? (
                <div className="space-y-4">
                  {/* Celebrities */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Celebrities</h5>
                    <div className="space-y-2">
                      {relationships.slice(0, 2).map((relationship) => (
                        <button
                          key={relationship.id}
                          onClick={() => setLocation(`/actor/${relationship.id}`)}
                          className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow text-left"
                          data-testid={`button-celebrity-${relationship.id}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {relationship.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm dark:text-gray-300">{relationship.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">♈ {relationship.sunSign || 'Unknown'}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Relationships/Ships */}
                  {actor?.id === 1 && ( // Only show for Taylor Swift
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Relationships</h5>
                      <div className="space-y-2">
                        <button
                          onClick={() => setLocation(`/ship/1`)}
                          className="flex items-center space-x-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg hover:from-pink-100 hover:to-purple-100 dark:hover:from-pink-800/30 dark:hover:to-purple-800/30 transition-colors text-left w-full"
                          data-testid="button-relationship-tayvis"
                        >
                          {/* Overlapping avatars */}
                          <div className="relative flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                              T
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-xs font-bold text-white -ml-2 border-2 border-white">
                              K
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900 dark:text-gray-300">Tayvis</p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              confirmed
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
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
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <HorizontalTimeline
                  initialYear={availableYears.length > 0 ? Math.max(...availableYears) : currentYear}
                  items={timelineItems}
                  onFocusChange={handleYearChange}
                />
                
                {/* Articles for selected year */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                  <h5 className="font-medium text-sm mb-3 text-gray-900 dark:text-gray-300">News from {selectedYear}</h5>
                  <div className="space-y-3">
                    {getArticlesByYear(selectedYear).map((article: any) => (
                      <div 
                        key={article.id} 
                        className="bg-white dark:bg-gray-700 rounded-lg border-l-4 touch-feedback cursor-pointer hover:shadow-md transition-shadow duration-200 p-3"
                        style={{ borderLeftColor: article.category?.color || 'hsl(329, 86%, 70%)' }}
                        onClick={() => setLocation(`/article/${article.id}`)}
                        data-testid={`article-card-${article.id}`}
                      >
                        {/* Category Badge and Planet Glyphs */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-white text-xs font-bold"
                                style={{ backgroundColor: article.category?.color || 'hsl(329, 86%, 70%)' }}>
                            <span className="mr-1 text-xs">⭐</span>
                            {article.category?.name?.toUpperCase() || 'CELEBRITY'}
                          </span>
                          
                          <div className="flex items-center space-x-1">
                            {article.astroGlyphs.map((glyph: any, index: number) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                style={{ backgroundColor: glyph.color }}
                              >
                                {glyph.symbol}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Article Content - Condensed */}
                        <div className="flex items-start space-x-3">
                          {/* Actor Image - Smaller for timeline */}
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                            {article.actors.length > 0 && article.actors[0].profileImage ? (
                              <img 
                                src={article.actors[0].profileImage} 
                                alt={article.actors[0].name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h6 className="font-bold text-sm leading-tight mb-1 line-clamp-2 text-gray-900 dark:text-white">{article.title}</h6>
                            
                            {/* Hashtags - Limited */}
                            <div className="flex gap-1 mb-2 overflow-hidden" style={{ maxHeight: '1.25rem' }}>
                              {article.hashtags.slice(0, 2).map((tag: string, index: number) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded whitespace-nowrap"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            {/* Social Stats and Date */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                                <span>{article.likeCount}♥</span>
                                <span>{article.shareCount}↗</span>
                                <span>{article.bookmarkCount}📑</span>
                              </div>
                              
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
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
                planets: ["sun", "mercury", "venus", "mars"],
                description: "Represents harmony between core identity and communication, creating clear self-expression and authentic messaging."
              },
              {
                id: 1,
                planets: ["moon", "venus", "jupiter"],
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
                planets: ["venus", "mars", "jupiter", "saturn", "uranus"],
                description: "The classic attraction circuit - balances desire with action, creating magnetic appeal and relationship dynamics."
              },
              {
                id: 1,
                planets: ["jupiter", "saturn", "neptune"],
                description: "Expansion meets structure - enables growth while maintaining boundaries in partnerships."
              },
              {
                id: 2,
                planets: ["mercury", "neptune", "pluto", "moon", "sun", "venus"],
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
                planets: ["jupiter", "venus", "sun", "moon", "mercury", "mars", "saturn", "uranus"],
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
                planets: ["mars", "saturn", "pluto"],
                description: "Disciplined action - channels raw drive through structured effort for lasting achievement."
              },
              {
                id: 1,
                planets: ["sun", "pluto", "jupiter", "mercury", "venus"],
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
                planets: ["mercury", "venus", "jupiter", "uranus"],
                description: "Playful communication and artistic expression - finds joy in learning and creative exchange."
              },
              {
                id: 1,
                planets: ["jupiter", "uranus", "neptune", "mars", "sun"],
                description: "Adventure and innovation - seeks new experiences and revolutionary insights."
              },
              {
                id: 2,
                planets: ["moon", "neptune", "venus"],
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
                planets: ["venus", "jupiter", "moon", "mercury", "sun", "saturn", "neptune", "uranus", "mars", "pluto"],
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
                planets: ["mars", "pluto", "saturn", "sun"],
                description: "Intense transformational action - raw power channeled toward complete regeneration."
              },
              {
                id: 1,
                planets: ["sun", "saturn", "jupiter"],
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
                planets: ["jupiter", "uranus", "neptune", "venus", "mercury"],
                description: "Revolutionary expansion - seeks progressive communities that embrace innovation and growth."
              },
              {
                id: 1,
                planets: ["venus", "neptune", "moon"],
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
                planets: ["saturn", "neptune", "pluto", "uranus", "jupiter"],
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
                planets: ["uranus", "neptune", "pluto"],
                description: "Innovative intuition - sudden insights merge with spiritual awareness for breakthrough understanding."
              },
              {
                id: 1,
                planets: ["mercury", "pluto", "mars", "saturn"],
                description: "Deep communication - transforms thoughts and words with penetrating psychological insight."
              },
              {
                id: 2,
                planets: ["venus", "saturn", "jupiter", "moon", "sun", "mercury"],
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
                planets: ["neptune", "pluto", "uranus", "saturn", "jupiter", "mars", "venus", "mercury", "moon"],
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
                  onClick={() => vibration.circuits.length > 0 ? toggleVibration(vibration.number) : null}
                  className={cn(
                    "w-full p-3 text-left flex items-center justify-between transition-opacity",
                    vibration.circuits.length > 0 
                      ? "hover:bg-gray-50 cursor-pointer" 
                      : "opacity-50 cursor-not-allowed"
                  )}
                  data-testid={`button-vibration-${vibration.number}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      vibration.circuits.length > 0
                        ? "bg-purple-500 text-white"
                        : "bg-gray-300 text-gray-500"
                    )}>
                      {romanNumerals[vibration.number - 1]}
                    </div>
                    <h4 className={cn(
                      "text-sm",
                      vibration.circuits.length > 0
                        ? "font-bold text-gray-900 dark:text-gray-300"
                        : "font-medium text-gray-400"
                    )}>
                      {vibration.title}
                    </h4>
                  </div>
                  {vibration.circuits.length > 0 && (
                    expandedVibrations.has(vibration.number) ? 
                      <ChevronUp className="w-4 h-4" /> : 
                      <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                
                {expandedVibrations.has(vibration.number) && (
                  <div className="px-3 pb-3 border-t border-gray-100">
                    {vibration.circuits.length > 0 ? (
                      <>
                        {/* Circuit Cards */}
                        <div className="flex flex-wrap gap-2 mb-3 mt-3">
                          {vibration.circuits.map((circuit, circuitIndex) => {
                            const isSelected = selectedCircuits.get(vibration.number) === circuit.id || 
                                             (selectedCircuits.get(vibration.number) === undefined && circuitIndex === 0);
                            // Dynamic width based on planet count - ensure adequate tap target
                            const cardWidth = Math.max(circuit.planets.length * 28 + 24, 80); // min 80px width
                            return (
                              <button
                                key={circuit.id}
                                onClick={() => selectCircuit(vibration.number, circuit.id)}
                                className={cn(
                                  "p-3 rounded-lg border-2 transition-colors flex-shrink-0",
                                  isSelected 
                                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-400" 
                                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                                )}
                                style={{ minWidth: `${cardWidth}px` }}
                                data-testid={`button-circuit-${vibration.number}-${circuit.id}`}
                              >
                                <div className="flex space-x-1 justify-center">
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
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <p className="text-xs text-gray-600 dark:text-gray-400" data-testid={`text-description-${vibration.number}`}>
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
              <div key={planet} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
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
                  <h4 className="font-bold text-sm capitalize flex-1 dark:text-gray-300">{planet}</h4>
                  <p className="text-sm font-medium flex-1 dark:text-gray-300">{getZodiacSign(planet)}</p>
                  <p className="text-sm font-bold dark:text-gray-300">{getPlanetDegree(planet)}</p>
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
                <div key={houseNum} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {houseNum}
                      </div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm dark:text-gray-300">{houseSign}</h4>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{houseNames[houseNum - 1]}</p>
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
                        <span className="text-xs text-gray-400 dark:text-gray-500 px-1">Empty</span>
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
                  <h4 className="font-bold text-sm dark:text-gray-300">{transit.transit}</h4>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    transit.intensity === 'high' && "bg-red-100 text-red-800",
                    transit.intensity === 'medium' && "bg-yellow-100 text-yellow-800", 
                    transit.intensity === 'low' && "bg-green-100 text-green-800"
                  )}>
                    {transit.intensity} intensity
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{transit.effect}</p>
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
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-20">
      {/* Header with category accent */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b-4 z-10" 
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
            <h1 className="text-lg font-bold dark:text-gray-300">Celeb Profile</h1>
          </div>
          
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            data-testid="button-theme-toggle"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-700" />
            ) : (
              <Sun className="w-5 h-5 text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Compressed Profile Header */}
      <div className="p-4">
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {actor.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1 dark:text-gray-300">{actor.name}</h2>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
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
              <p className="text-xs text-gray-600 dark:text-gray-400">Sun</p>
              <p className="font-bold text-xs dark:text-gray-300">{actor.sunSign || 'Unknown'}</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-1">
                ☽
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Moon</p>
              <p className="font-bold text-xs dark:text-gray-300">{actor.moonSign || 'Unknown'}</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-1">
                ↗
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Rising</p>
              <p className="font-bold text-xs dark:text-gray-300">{actor.risingSign || 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabOption)}
                className={cn(
                  "flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-gray-300 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
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