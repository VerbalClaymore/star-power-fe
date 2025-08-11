import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import BottomNavigation from "@/components/BottomNavigation";
import type { Actor } from "@shared/schema";

type TabOption = 'overview' | 'vibes' | 'stars' | 'houses' | 'transits';

export default function ShipProfilePage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabOption>('overview');

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
          
          <div className="w-10 h-10"></div>
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

      <BottomNavigation />
    </div>
  );
}