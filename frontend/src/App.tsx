import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AddSheep from './pages/AddSheep';
import RecordHealthEvent from './pages/RecordHealthEvent';
import CreateMatingPair from './pages/CreateMatingPair';
import MatingPairs from './pages/MatingPairs';
import EditMatingPair from './pages/EditMatingPair';
import { AuthProvider, useAuth } from './context/AuthContext';
import type { ReactElement } from 'react';
import './App.css'

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-xl font-bold text-gray-800">
                    Sheep Manager
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/sheep/new"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Add Sheep
                  </Link>
                  <Link
                    to="/health/new"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Record Health
                  </Link>
                  <Link
                    to="/mating"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Mating Pairs
                  </Link>
                  <Link
                    to="/mating/new"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Create Mating
                  </Link>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sheep/new"
            element={
              <ProtectedRoute>
                <AddSheep />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/new"
            element={
              <ProtectedRoute>
                <RecordHealthEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mating"
            element={
              <ProtectedRoute>
                <MatingPairs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mating/new"
            element={
              <ProtectedRoute>
                <CreateMatingPair />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mating/:id/edit"
            element={
              <ProtectedRoute>
                <EditMatingPair />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
