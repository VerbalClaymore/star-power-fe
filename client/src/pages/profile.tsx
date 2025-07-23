import TopNavigation from "@/components/TopNavigation";

export default function Profile() {
  return (
    <>
      <TopNavigation
        categories={[]}
        activeCategory=""
        onCategoryChange={() => {}}
        showStatusBar={false}
      />
      
      <div className="flex-1 pb-20 bg-[hsl(var(--surface-variant))] min-h-screen p-4">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <p className="text-gray-600">Profile features coming soon...</p>
        </div>
      </div>
    </>
  );
}
