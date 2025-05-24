import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardSummary from '../components/DashboardSummary';
import RecentHealthEvents from '../components/RecentHealthEvents';
import QuickActions from '../components/QuickActions';
import { sheepService, type HealthEvent as ApiHealthEvent, type Sheep } from '../api/sheepService';

interface HealthEventWithSheepName extends ApiHealthEvent {
  sheepName: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sheep, setSheep] = useState<Sheep[]>([]);
  const [healthEvents, setHealthEvents] = useState<HealthEventWithSheepName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sheepResponse, healthEventsResponse, matingPairsResponse] = await Promise.all([
          sheepService.getAllSheep(),
          sheepService.getHealthEvents(),
          sheepService.getMatingPairs(),
        ]);

        setSheep(sheepResponse.data);
        
        // Transform health events to include sheep names
        const eventsWithSheepNames = healthEventsResponse.data.map(event => ({
          ...event,
          sheepName: sheepResponse.data.find(s => s.id === event.sheepId)?.name || 'Unknown Sheep'
        }));
        setHealthEvents(eventsWithSheepNames);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-gray-600">
              Welcome, {user.email || user.username || 'User'}!
            </span>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <DashboardSummary
        totalSheep={sheep.length}
        activeHealthEvents={healthEvents.filter(e => e.status === 'active').length}
        upcomingTasks={8}
        recentMatingPairs={3}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RecentHealthEvents events={healthEvents} />
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard; 