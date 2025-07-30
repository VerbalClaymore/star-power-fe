import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Star, Users, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import PlanetIcon from "@/components/PlanetIcon";
import ArticleCard from "@/components/ArticleCard";
import type { Actor, ArticleWithDetails } from "@shared/schema";

type SortOption = 'chronological' | 'reverse-chronological' | 'popularity';
type FilterOption = 'all' | 'current-relationship';

export default function ActorProfilePage() {
  const { id, returnTo } = useParams();
  const [, setLocation] = useLocation();
  const [storiesSort, setStoriesSort] = useState<SortOption>('reverse-chronological');
  const [storiesFilter, setStoriesFilter] = useState<FilterOption>('all');
  const [selectedRelationship, setSelectedRelationship] = useState<Actor | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  // Section collapse states - default expanded, persisted per profile
  const [sectionStates, setSectionStates] = useState(() => {
    const saved = localStorage.getItem(`profile-sections-${id}`);
    return saved ? JSON.parse(saved) : {
      relationships: true,
      vibrationalCircuits: true,
      traditionalAstrology: true,
      currentTransits: true,
      stories: true
    };
  });

  // Persist section states
  useEffect(() => {
    localStorage.setItem(`profile-sections-${id}`, JSON.stringify(sectionStates));
  }, [sectionStates, id]);

  const toggleSection = (section: string) => {
    setSectionStates((prev: any) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const { data: actor, isLoading: actorLoading } = useQuery<Actor>({
    queryKey: [`/api/actors/${id}`],
    enabled: !!id,
  });

  const { data: articles, isLoading: articlesLoading } = useQuery<ArticleWithDetails[]>({
    queryKey: [`/api/actors/${id}/articles`],
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

  const getTraditionalAstrology = () => {
    // Mock traditional astrology data - in real app this would come from API
    return {
      houses: [
        { number: 1, sign: "Scorpio", planets: ["Mars"], description: "Self, Identity, First Impressions" },
        { number: 2, sign: "Sagittarius", planets: ["Jupiter"], description: "Money, Values, Possessions" },
        { number: 3, sign: "Capricorn", planets: [], description: "Communication, Siblings, Short Trips" },
        { number: 4, sign: "Aquarius", planets: ["Saturn"], description: "Home, Family, Roots" },
        { number: 5, sign: "Pisces", planets: ["Neptune"], description: "Creativity, Romance, Children" },
        { number: 6, sign: "Aries", planets: [], description: "Work, Health, Daily Routine" },
        { number: 7, sign: "Taurus", planets: ["Venus"], description: "Partnerships, Marriage, Open Enemies" },
        { number: 8, sign: "Gemini", planets: ["Mercury"], description: "Transformation, Shared Resources, Death" },
        { number: 9, sign: "Cancer", planets: ["Moon"], description: "Philosophy, Higher Learning, Travel" },
        { number: 10, sign: "Leo", planets: ["Sun"], description: "Career, Reputation, Public Image" },
        { number: 11, sign: "Virgo", planets: [], description: "Friends, Groups, Hopes & Dreams" },
        { number: 12, sign: "Libra", planets: ["Pluto"], description: "Subconscious, Hidden Things, Spirituality" }
      ]
    };
  };

  const filterAndSortArticles = (articles: ArticleWithDetails[], filter: FilterOption, sortBy: SortOption) => {
    let filtered = [...articles];
    
    // Apply filter first
    switch (filter) {
      case 'current-relationship':
        if (selectedRelationship) {
          filtered = filtered.filter(article => 
            article.actors.some(actor => actor.id === selectedRelationship.id)
          );
        } else {
          filtered = []; // No relationship selected, return empty
        }
        break;
      case 'all':
      default:
        // No filtering, keep all articles
        break;
    }
    
    // Then apply sorting
    switch (sortBy) {
      case 'chronological':
        return filtered.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
      case 'reverse-chronological':
        return filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      case 'popularity':
        return filtered.sort((a, b) => (b.likeCount + b.shareCount + b.bookmarkCount) - (a.likeCount + a.shareCount + a.bookmarkCount));
      default:
        return filtered;
    }
  };

  const handleFilterToggle = (relationshipId: number | 'all') => {
    if (relationshipId === 'all') {
      setSelectedRelationship(null);
      setStoriesFilter('all');
    } else {
      const relationship = relationships?.find(r => r.id === relationshipId);
      if (relationship) {
        setSelectedRelationship(relationship);
        setStoriesFilter('current-relationship');
        // Open stories section when relationship is selected
        setSectionStates((prev: any) => ({ ...prev, stories: true }));
      }
    }
    setShowFilterPanel(false);
  };

  const handleRelationshipSelect = (relationship: Actor) => {
    if (selectedRelationship?.id === relationship.id) {
      // Deselect if same relationship is clicked
      setSelectedRelationship(null);
      setStoriesFilter('all');
    } else {
      // Select new relationship
      setSelectedRelationship(relationship);
      setStoriesFilter('current-relationship');
      // Open stories section when relationship is selected
      setSectionStates((prev: any) => ({ ...prev, stories: true }));
    }
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
  const traditionalAstrology = getTraditionalAstrology();
  const filteredAndSortedArticles = articles ? filterAndSortArticles(articles, storiesFilter, storiesSort) : [];

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

        {/* Relationships */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('relationships')}
            className="flex items-center justify-between w-full text-left mb-4"
          >
            <h3 className="text-lg font-bold text-gray-900">Relationships</h3>
            {sectionStates.relationships ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {sectionStates.relationships && (
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
                      onClick={() => handleRelationshipSelect(relationship)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-lg border transition-colors text-left",
                        selectedRelationship?.id === relationship.id
                          ? "border-purple-300 bg-purple-50"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
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
                    </button>
                  ))}
                  
                  {selectedRelationship && (
                    <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-bold text-sm text-purple-900 mb-2">
                        Relationship with {selectedRelationship.name}
                      </h4>
                      <p className="text-sm text-purple-700">
                        These two frequently appear together in entertainment news, indicating a significant 
                        professional or personal connection that generates media attention.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No relationships found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vibrational Astrology Circuits */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('vibrationalCircuits')}
            className="flex items-center justify-between w-full text-left mb-4"
          >
            <h3 className="text-lg font-bold text-gray-900">Vibrational Astrology Circuits</h3>
            {sectionStates.vibrationalCircuits ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {sectionStates.vibrationalCircuits && (
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
          )}
        </div>

        {/* Traditional Astrology */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('traditionalAstrology')}
            className="flex items-center justify-between w-full text-left mb-4"
          >
            <h3 className="text-lg font-bold text-gray-900">Traditional Astrology</h3>
            {sectionStates.traditionalAstrology ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {sectionStates.traditionalAstrology && (
            <div className="grid grid-cols-1 gap-3">
              {traditionalAstrology.houses.map((house) => (
                <div key={house.number} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {house.number}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{house.sign}</h4>
                        <p className="text-xs text-gray-500">{house.description}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {house.planets.map((planet, planetIndex) => (
                        <PlanetIcon
                          key={planetIndex}
                          planet={planet.toLowerCase()}
                          color={`hsl(${260 + planetIndex * 25}, 60%, 50%)`}
                        />
                      ))}
                      {house.planets.length === 0 && (
                        <span className="text-xs text-gray-400 px-2 py-1">Empty</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Planetary Transits */}
        <div className="mb-8">
          <button
            onClick={() => toggleSection('currentTransits')}
            className="flex items-center justify-between w-full text-left mb-4"
          >
            <h3 className="text-lg font-bold text-gray-900">Current Planetary Transits</h3>
            {sectionStates.currentTransits ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {sectionStates.currentTransits && (
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
          )}
        </div>

        {/* Stories */}
        <div>
          <button
            onClick={() => toggleSection('stories')}
            className="flex items-center justify-between w-full text-left mb-4"
          >
            <h3 className="text-lg font-bold text-gray-900">Stories</h3>
            {sectionStates.stories ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {sectionStates.stories && (
            <>
              {/* Filter and Sort Controls */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {storiesFilter === 'current-relationship' && selectedRelationship 
                      ? `${filteredAndSortedArticles.length} stories with ${selectedRelationship.name}`
                      : `${articles?.length || 0} total stories`
                    }
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowFilterPanel(!showFilterPanel)}
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded border transition-colors",
                        showFilterPanel || selectedRelationship
                          ? "border-purple-300 bg-purple-50 text-purple-600"
                          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                    <select
                      value={storiesSort}
                      onChange={(e) => setStoriesSort(e.target.value as SortOption)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                    >
                      <option value="reverse-chronological">Newest First</option>
                      <option value="chronological">Oldest First</option>
                      <option value="popularity">Most Popular</option>
                    </select>
                  </div>
                </div>
                
                {/* Filter Panel */}
                {showFilterPanel && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Filter Stories</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="story-filter"
                          checked={storiesFilter === 'all'}
                          onChange={() => handleFilterToggle('all')}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">All Stories</span>
                      </label>
                      {relationships && relationships.length > 0 && (
                        <>
                          <div className="border-t border-gray-200 pt-2 mt-2">
                            <p className="text-xs text-gray-500 mb-2">Relationships</p>
                          </div>
                          {relationships.map((relationship) => (
                            <label key={relationship.id} className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="story-filter"
                                checked={selectedRelationship?.id === relationship.id}
                                onChange={() => handleFilterToggle(relationship.id)}
                                className="text-purple-600 focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-700">With {relationship.name}</span>
                            </label>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {articlesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading stories...</p>
                </div>
              ) : filteredAndSortedArticles.length > 0 ? (
                <div className="space-y-4">
                  {filteredAndSortedArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">
                    {storiesFilter === 'current-relationship' && selectedRelationship
                      ? `No stories found with ${selectedRelationship.name}`
                      : 'No stories found'
                    }
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}