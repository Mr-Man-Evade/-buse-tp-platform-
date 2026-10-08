import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, userRole, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <nav className="bg-[#003399] text-white p-4 shadow-lg flex justify-between items-center">
        <h1 className="text-2xl font-bold">BUSE TP System</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
          <FiLogOut /> Logout
        </button>
      </nav>

      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold text-[#003399] mb-6">
          Welcome, {user?.firstName || 'User'} {user?.lastName || ''}!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold text-[#003399] mb-2">Your Role</h3>
            <p className="text-lg text-gray-700 capitalize">{userRole || 'loading...'}</p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold text-[#003399] mb-2">Email</h3>
            <p className="text-lg text-gray-700">{user?.email || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => {
              const dashboardPath = 
                userRole === 'admin' 
                  ? '/admin' 
                  : userRole === 'coordinator'
                  ? '/coordinator'
                  : userRole === 'student'
                  ? '/student'
                  : userRole === 'mentor'
                  ? '/mentor'
                  : userRole === 'supervisor'
                  ? '/supervisor'
                  : '/dashboard';
              navigate(dashboardPath);
            }}
            className="btn-primary text-lg py-3 px-8"
          >
            Go to {userRole ? (userRole === 'admin' || userRole === 'coordinator' ? 'Coordinator' : userRole.charAt(0).toUpperCase() + userRole.slice(1)) : 'Dashboard'} Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
