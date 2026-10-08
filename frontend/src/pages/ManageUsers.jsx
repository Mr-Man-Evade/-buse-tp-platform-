import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = '/api';

export default function ManageUsers() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
          <h1 className="text-4xl font-bold text-[#003399]">Manage Users</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            <FiLogOut /> Logout
          </button>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {users.map(user => (
              <div key={user.id} className="card p-4 bg-white rounded-lg shadow-sm border border-[#E2E8F0]">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold text-[#003399]">{user.first_name} {user.last_name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span className="text-xs bg-[#87CEEB] text-[#001F3F] px-2 py-1 rounded capitalize">{user.role}</span>
                </div>
                <div className="text-sm text-gray-700">Joined: {new Date(user.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
