import React from 'react';
import type { HealthEvent as ApiHealthEvent } from '../api/sheepService';

interface HealthEvent extends ApiHealthEvent {
  sheepName: string;
}

interface RecentHealthEventsProps {
  events: HealthEvent[];
}

const RecentHealthEvents: React.FC<RecentHealthEventsProps> = ({ events }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Recent Health Events</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Sheep</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Event Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Description</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-t">
                <td className="px-4 py-2">{event.sheepName}</td>
                <td className="px-4 py-2">{event.eventType}</td>
                <td className="px-4 py-2">{new Date(event.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      event.status === 'active'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="px-4 py-2">{event.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentHealthEvents; 