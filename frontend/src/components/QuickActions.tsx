import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Add New Sheep',
      description: 'Register a new sheep in the system',
      icon: '🐑',
      path: '/sheep/new',
    },
    {
      title: 'Record Health Event',
      description: 'Log a new health event or treatment',
      icon: '💉',
      path: '/health/new',
    },
    {
      title: 'Schedule Mating',
      description: 'Create a new mating pair',
      icon: '❤️',
      path: '/mating/new',
    },
    {
      title: 'View Reports',
      description: 'Access detailed reports and analytics',
      icon: '📊',
      path: '/reports',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-3xl mb-2">{action.icon}</span>
            <h3 className="font-medium text-gray-900">{action.title}</h3>
            <p className="text-sm text-gray-500 text-center">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions; 