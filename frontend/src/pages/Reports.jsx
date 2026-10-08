import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiBarChart2 } from 'react-icons/fi';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = '/api';

export default function Reports() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/reports/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (err) {
        console.error('Failed to load reports stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F5F9FF]">
      <Sidebar role={user?.role || 'coordinator'} onLogout={handleLogout} />

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#003399]">Coordinator Reports</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            <FiLogOut /> Logout
          </button>
        </div>

        {loading ? (
          <p>Loading reports...</p>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-gradient-to-br from-[#003399] to-[#001F3F] text-white p-6 rounded-lg shadow-lg">
              <p className="text-sm opacity-90">Total Users</p>
              <p className="text-4xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="card bg-gradient-to-br from-[#87CEEB] to-sky-300 text-white p-6 rounded-lg shadow-lg">
              <p className="text-sm opacity-90">Total Documents</p>
              <p className="text-4xl font-bold">{stats.totalDocuments}</p>
            </div>
            <div className="card bg-gradient-to-br from-[#FFD700] to-yellow-300 text-[#001F3F] p-6 rounded-lg shadow-lg">
              <p className="text-sm opacity-90">Pending Documents</p>
              <p className="text-4xl font-bold">{stats.pendingDocuments}</p>
            </div>
          </div>
        ) : (
          <p className="text-red-600">Unable to load report statistics.</p>
        )}
      </main>
    </div>
  );
}
