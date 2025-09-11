
// Component for team member card loading skeletons
const TeamSkeletons = ({ count = 4 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${index}`} className="border rounded-lg p-5 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="h-3 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-28"></div>
              </div>
              <div className="flex justify-between mt-4">
                <div className="h-3 bg-gray-200 rounded w-32"></div>
                <div className="h-7 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TeamSkeletons;
