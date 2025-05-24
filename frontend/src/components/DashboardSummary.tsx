import React from 'react';

interface DashboardSummaryProps {
  totalSheep: number;
  activeHealthEvents: number;
  upcomingTasks: number;
  recentMatingPairs: number;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  totalSheep,
  activeHealthEvents,
  upcomingTasks,
  recentMatingPairs,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700">Total Sheep</h3>
        <p className="text-3xl font-bold text-blue-600">{totalSheep}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700">Active Health Events</h3>
        <p className="text-3xl font-bold text-red-600">{activeHealthEvents}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700">Upcoming Tasks</h3>
        <p className="text-3xl font-bold text-yellow-600">{upcomingTasks}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700">Recent Mating Pairs</h3>
        <p className="text-3xl font-bold text-green-600">{recentMatingPairs}</p>
      </div>
    </div>
  );
};

export default DashboardSummary; 