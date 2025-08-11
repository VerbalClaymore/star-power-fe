import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, Sun, Moon, Heart, Share2, Bookmark, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import BottomNavigation from "@/components/BottomNavigation";
import { useTheme } from "@/contexts/ThemeContext";
import type { Actor } from "@shared/schema";

type TabOption = 'overview' | 'vibes' | 'stars' | 'houses' | 'transits';

export default function ShipProfilePage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabOption>('overview');
  const { theme, toggleTheme } = useTheme();
  const [expandedVibrations, setExpandedVibrations] = useState<Set<number>>(new Set());
  const [selectedCircuits, setSelectedCircuits] = useState<Map<number, number>>(new Map());

  // For now, we'll create a mock ship based on actor IDs
  // In a real app, this would be a separate ships API
  const shipId = parseInt(id || '0');
  
  // Mock ship data - combining Taylor Swift (1) + Travis Kelce (3) = "Tayvis"
  const mockShip = {
    id: shipId,
    name: "Tayvis",
    celebrity1: { id: 1, name: "Taylor Swift", profileImage: null },
    celebrity2: { id: 3, name: "Travis Kelce", profileImage: null },
    shipName: "Tayvis",
    status: "confirmed",
    since: "2023",
    category: "Celebrity"
  };

  const handleBack = () => {
    setLocation('/');
  };

  // Helper functions for tab content
  const toggleVibrationExpansion = (vibrationNumber: number) => {
    setExpandedVibrations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(vibrationNumber)) {
        newSet.delete(vibrationNumber);
      } else {
        newSet.add(vibrationNumber);
      }
      return newSet;
    });
  };

  const selectCircuit = (vibrationNumber: number, circuitId: number) => {
    setSelectedCircuits(prev => new Map(prev.set(vibrationNumber, circuitId)));
  };

  const getPlanetColor = (planet: string) => {
    const colors: { [key: string]: string } = {
      'sun': '#F59E0B',
      'moon': '#3B82F6',
      'mercury': '#8B5CF6',
      'venus': '#EC4899',
      'mars': '#EF4444',
      'jupiter': '#10B981',
      'saturn': '#6B7280',
      'uranus': '#06B6D4',
      'neptune': '#8B5CF6',
      'pluto': '#374151'
    };
    return colors[planet] || '#6B7280';
  };

  const getZodiacSign = (planet: string) => {
    const signs: { [key: string]: string } = {
      'sun': 'Sagittarius',
      'moon': 'Cancer',
      'mercury': 'Scorpio',
      'venus': 'Sagittarius',
      'mars': 'Scorpio',
      'jupiter': 'Sagittarius',
      'saturn': 'Aquarius',
      'uranus': 'Taurus',
      'neptune': 'Aquarius',
      'pluto': 'Sagittarius'
    };
    return signs[planet] || 'Unknown';
  };

  const getPlanetDegree = (planet: string) => {
    const degrees: { [key: string]: string } = {
      'sun': '13°22\'',
      'moon': '1°07\'',
      'mercury': '2°06\'',
      'venus': '1°58\'',
      'mars': '23°34\'',
      'jupiter': '20°34\'',
      'saturn': '11°09\'',
      'uranus': '18°43\'',
      'neptune': '25°25\'',
      'pluto': '28°01\''
    };
    return degrees[planet] || '0°00\'';
  };

  const getHousePlanets = (houseNumber: number) => {
    const housePlanetMap: { [key: number]: string[] } = {
      1: ['sun', 'mercury'],
      2: ['venus'],
      3: [],
      4: ['moon'],
      5: ['mars'],
      6: [],
      7: ['jupiter'],
      8: ['pluto'],
      9: ['saturn'],
      10: ['uranus'],
      11: [],
      12: ['neptune']
    };
    return housePlanetMap[houseNumber] || [];
  };

  const getHouseSign = (houseNumber: number) => {
    const houseSigns = [
      'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
      'Aries', 'Taurus', 'Gemini', 'Cancer',
      'Leo', 'Virgo', 'Libra', 'Scorpio'
    ];
    return houseSigns[houseNumber - 1];
  };

  const getSelectedDescription = (vibrationNumber: number, circuits: any[]) => {
    const selectedCircuitId = selectedCircuits.get(vibrationNumber);
    const selectedCircuit = selectedCircuitId 
      ? circuits.find(c => c.id === selectedCircuitId)
      : circuits[0];
    
    return selectedCircuit?.description || "No description available for this circuit.";
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'vibes', label: 'Vibes' },
    { id: 'stars', label: 'Stars' },
    { id: 'houses', label: 'Houses' },
    { id: 'transits', label: 'Transits' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Ship Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-bold text-sm mb-2 text-gray-900 dark:text-gray-300">
                About {mockShip.name}
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {mockShip.name} represents the astrological compatibility and relationship dynamics between{' '}
                {mockShip.celebrity1.name} and {mockShip.celebrity2.name}. This ship has been{' '}
                {mockShip.status} since {mockShip.since}, creating a powerful cosmic connection in the{' '}
                {mockShip.category.toLowerCase()} sphere.
              </p>
            </div>

            {/* Relationship Dynamics */}
            <div>
              <h4 className="font-bold text-sm mb-3 text-gray-900 dark:text-gray-300">
                Relationship Dynamics
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <h5 className="font-medium text-sm text-gray-900 dark:text-gray-300 mb-1">
                    Compatibility Score
                  </h5>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-300">85%</span>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <h5 className="font-medium text-sm text-gray-900 dark:text-gray-300 mb-1">
                    Relationship Status
                  </h5>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    {mockShip.status.charAt(0).toUpperCase() + mockShip.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'vibes':
        const mockVibrations = [
          {
            number: 1,
            title: "Creative Union",
            circuits: [
              {
                id: 1,
                planets: ['sun', 'venus', 'mercury'],
                description: "This creative circuit in your relationship brings artistic harmony and shared vision. Together you inspire each other's creative expression."
              },
              {
                id: 2,
                planets: ['moon', 'mars'],
                description: "An emotional action circuit that drives passionate connection and shared goals in your relationship."
              }
            ]
          },
          {
            number: 2,
            title: "Emotional Balance",
            circuits: [
              {
                id: 3,
                planets: ['moon', 'venus', 'jupiter', 'neptune'],
                description: "A nurturing emotional circuit that creates deep empathy and understanding between partners."
              }
            ]
          }
        ];

        const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

        return (
          <div className="space-y-3">
            {mockVibrations.map((vibration) => (
              <div key={vibration.number} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleVibrationExpansion(vibration.number)}
                  className={cn(
                    "w-full p-4 flex items-center justify-between transition-colors",
                    vibration.circuits.length > 0
                      ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      : "bg-gray-50 dark:bg-gray-700 cursor-default"
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
                  <div className="px-3 pb-3 border-t border-gray-100 dark:border-gray-600">
                    {vibration.circuits.length > 0 ? (
                      <>
                        {/* Circuit Cards */}
                        <div className="flex flex-wrap gap-2 mb-3 mt-3">
                          {vibration.circuits.map((circuit, circuitIndex) => {
                            const isSelected = selectedCircuits.get(vibration.number) === circuit.id || 
                                             (selectedCircuits.get(vibration.number) === undefined && circuitIndex === 0);
                            const cardWidth = Math.max(circuit.planets.length * 28 + 24, 80);
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
                      <div className="text-center py-6" data-testid={`empty-state-${vibration.number}`}>
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-gray-400 text-xl">∅</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">No circuits found</p>
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
        const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
        
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
            transit: "Venus conjunct Composite Sun",
            effect: "Enhanced harmony and love in the relationship",
            duration: "Active through February 2025",
            intensity: "high"
          },
          {
            transit: "Mars square Composite Moon", 
            effect: "Potential emotional conflicts need gentle handling",
            duration: "Peak influence this week",
            intensity: "medium"
          },
          {
            transit: "Jupiter trine Composite Venus",
            effect: "Expansion of love and mutual understanding",
            duration: "Active through March 2025",
            intensity: "low"
          }
        ];

        return (
          <div className="space-y-3">
            {currentTransits.map((transit, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm dark:text-gray-300">{transit.transit}</h4>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    transit.intensity === 'high' && "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
                    transit.intensity === 'medium' && "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200", 
                    transit.intensity === 'low' && "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  )}>
                    {transit.intensity} intensity
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{transit.effect}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{transit.duration}</p>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {tabs.find(t => t.id === activeTab)?.label} content coming soon
            </p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b-4 z-10 border-pink-500">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-gray-300" />
          </button>
          
          <div className="flex items-center">
            <span className="mr-2 text-lg">💕</span>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-300">Ship Profile</h1>
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

      {/* Ship Header */}
      <div className="p-4">
        <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {/* Overlapping avatars */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {mockShip.celebrity1.name.charAt(0)}
              </div>
              <div className="absolute -right-6 top-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xl font-bold border-4 border-white dark:border-gray-900">
                {mockShip.celebrity2.name.charAt(0)}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-300">
              {mockShip.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {mockShip.celebrity1.name} × {mockShip.celebrity2.name}
            </p>
            <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
              <Star className="w-4 h-4 mr-1" />
              {mockShip.category} • Since {mockShip.since}
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
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-300 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                )}
                data-testid={`tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {renderTabContent()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-center space-x-6 max-w-md mx-auto">
          <button 
            className="flex flex-col items-center space-y-1 text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors"
            data-testid="button-like"
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs">Like</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1 text-gray-700 dark:text-gray-300 hover:text-purple-500 transition-colors"
            data-testid="button-share"
          >
            <Share2 className="w-6 h-6" />
            <span className="text-xs">Share</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors"
            data-testid="button-bookmark"
          >
            <Bookmark className="w-6 h-6" />
            <span className="text-xs">Save</span>
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}