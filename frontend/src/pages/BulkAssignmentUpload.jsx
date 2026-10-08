import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiFileText, FiAlertTriangle, FiCheckCircle, FiLogOut } from 'react-icons/fi';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = '/api';

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = line.split(',').map((c) => c.trim());
    const row = {};
    headers.forEach((key, index) => { row[key] = cells[index] || ''; });
    return {
      studentId: row.studentid || row.student_id || row.student || '',
      mentorId: row.mentorid || row.mentor_id || row.mentor || '',
      supervisorId: row.supervisorid || row.supervisor_id || row.supervisor || '',
      school: row.school || ''
    };
  }).filter((row) => row.studentId);
}

export default function BulkAssignmentUpload() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const role = user?.role || localStorage.getItem('auth_role') || 'coordinator';
  const [csvText, setCsvText] = useState('studentId,mentorId,supervisorId,school\n');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    const assignments = parseCsv(csvText);
    if (assignments.length === 0) {
      setMessage({ type: 'error', text: 'Please enter a valid CSV with at least one student record.' });
      return;
    }
    setLoading(true);
    try {
            const res = await axios.post(`${API_BASE_URL}/assignments/bulk`, { assignments }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage({ type: 'success', text: `Processed ${res.data.processed} rows successfully.` });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Bulk upload failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex min-h-screen bg-[#F5F9FF]">
      <Sidebar role={role} onLogout={handleLogout} />
      <main className="flex-1 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#87CEEB]">Bulk Assignment Upload</p>
            <h1 className="text-4xl font-bold text-[#003399]">Upload Student Assignments</h1>
            <p className="text-gray-500 mt-2">Use a CSV to assign students to mentors and supervisors in bulk.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/coordinator')} className="bg-white border border-gray-200 text-[#003399] px-4 py-2 rounded-xl">Coordinator home</button>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"><FiLogOut /> Logout</button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <FiUpload className="text-[#003399] text-xl" />
            <div>
              <p className="text-lg font-semibold text-[#003399]">CSV Format</p>
              <p className="text-sm text-gray-500">Required headers: <span className="font-semibold">studentId, mentorId, supervisorId, school</span></p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <textarea value={csvText} onChange={(e) => setCsvText(e.target.value)} rows={12} className="w-full border border-gray-200 rounded-3xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]" />
            {message && (
              <div className={`rounded-2xl p-4 text-sm ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                {message.text}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="submit" disabled={loading} className="bg-[#003399] hover:bg-[#001F3F] text-white py-3 rounded-2xl font-semibold disabled:opacity-60">{loading ? 'Processing...' : 'Upload assignments'}</button>
              <button type="button" onClick={() => setCsvText('studentId,mentorId,supervisorId,school\n')} className="bg-gray-100 text-gray-700 py-3 rounded-2xl">Reset template</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
