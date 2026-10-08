import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiBookOpen, FiSearch } from 'react-icons/fi';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = '/api';

export default function CoordinatorGradebook() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const role = user?.role || localStorage.getItem('auth_role') || 'coordinator';
  const [gradebook, setGradebook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadGradebook(); }, []);

  const loadGradebook = async () => {
    try {
            const res = await axios.get(`${API_BASE_URL}/final-marks/gradebook`, { headers: { Authorization: `Bearer ${token}` } });
      setGradebook(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const filtered = gradebook.filter((item) => {
    const term = search.toLowerCase();
    return item.student_name?.toLowerCase().includes(term)
      || item.reg_number?.toLowerCase().includes(term)
      || item.supervisor_name?.toLowerCase().includes(term)
      || (item.programme || '').toLowerCase().includes(term);
  });

  return (
    <div className="flex min-h-screen bg-[#F5F9FF]">
      <Sidebar role={role} onLogout={handleLogout} />
      <main className="flex-1 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#87CEEB]">Coordinator Gradebook</p>
            <h1 className="text-4xl font-bold text-[#003399]">Supervisor Final Marks</h1>
            <p className="text-gray-500 mt-2">View final scores submitted by supervisors without editing privileges.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/coordinator')} className="bg-white border border-gray-200 text-[#003399] px-4 py-2 rounded-xl">Coordinator home</button>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"><FiLogOut /> Logout</button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 border border-blue-100">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative max-w-md w-full">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by student, supervisor, program..." className="w-full border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]" />
            </div>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading gradebook...</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500">No final marks found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#F8FAFF] text-xs uppercase tracking-[0.15em] text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Supervisor</th>
                    <th className="px-4 py-3">Reg No.</th>
                    <th className="px-4 py-3">Program</th>
                    <th className="px-4 py-3">Marks</th>
                    <th className="px-4 py-3">Final Grade</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4 font-semibold text-[#001F3F]">{item.student_name}</td>
                      <td className="px-4 py-4">{item.supervisor_name || 'Unassigned'}</td>
                      <td className="px-4 py-4">{item.reg_number}</td>
                      <td className="px-4 py-4">{item.programme || 'N/A'}</td>
                      <td className="px-4 py-4">{item.total_marks ?? '-'}</td>
                      <td className="px-4 py-4">{item.mark_awarded || '-'}</td>
                      <td className="px-4 py-4 text-gray-500">{new Date(item.updated_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
