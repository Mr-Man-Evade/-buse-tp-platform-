import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiCalendar, FiFileText, FiClock } from 'react-icons/fi';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = '/api';
const CATEGORY_LABELS = {
  'return-slip': 'Return Slip',
  'scheme-of-work': 'Scheme of Work',
  'daily-lesson-plan': 'DLP',
  evidence: 'Evidence',
  reflection: 'Reflection',
  general: 'General'
};

function formatMonth(date) {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export default function StudentProgress() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const role = user?.role || localStorage.getItem('auth_role') || 'student';
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDocuments(); }, []);

  const loadDocuments = async () => {
    try {
            const res = await axios.get(`${API_BASE_URL}/documents/my-documents`, { headers: { Authorization: `Bearer ${token}` } });
      setDocuments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const grouped = documents.reduce((acc, doc) => {
    const date = new Date(doc.created_at);
    const month = formatMonth(date);
    const day = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const key = `${month}-${day}`;
    acc[month] = acc[month] || {};
    acc[month][day] = acc[month][day] || [];
    acc[month][day].push(doc);
    return acc;
  }, {});

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex min-h-screen bg-[#F5F9FF]">
      <Sidebar role={role} onLogout={handleLogout} />
      <main className="flex-1 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#87CEEB]">Student Progress</p>
            <h1 className="text-4xl font-bold text-[#003399]">Submission Calendar</h1>
            <p className="text-gray-500 mt-2">Review your submission history by date and category, including DLP uploads.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/student')} className="bg-white border border-gray-200 text-[#003399] px-4 py-2 rounded-xl">Back to dashboard</button>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"><FiLogOut /> Logout</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <FiCalendar className="text-[#003399] text-xl" />
              <div>
                <p className="font-semibold text-[#001F3F]">Total submissions</p>
                <p className="text-3xl font-bold text-[#003399]">{documents.length}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Track all upload dates and document categories over time.</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <FiFileText className="text-[#003399] text-xl" />
              <div>
                <p className="font-semibold text-[#001F3F]">DLP Files</p>
                <p className="text-3xl font-bold text-[#003399]">{documents.filter((d) => d.category === 'daily-lesson-plan').length}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Daily lesson plan submissions are grouped in the calendar view.</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <FiClock className="text-[#003399] text-xl" />
              <div>
                <p className="font-semibold text-[#001F3F]">Latest upload</p>
                <p className="text-3xl font-bold text-[#003399]">{documents[0] ? new Date(documents[0].created_at).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">See how current your latest submission is.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100">
          {loading ? (
            <p className="text-gray-500">Loading submission calendar...</p>
          ) : Object.keys(grouped).length === 0 ? (
            <p className="text-gray-500">No submissions available yet. Upload a document to start tracking your progress.</p>
          ) : (
            <div className="space-y-8">
              {Object.entries(grouped).map(([month, days]) => (
                <div key={month}>
                  <h2 className="text-xl font-bold text-[#003399] mb-4">{month}</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(days).map(([day, docs]) => (
                      <div key={day} className="rounded-3xl border border-gray-100 bg-[#F8FAFF] p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-semibold text-[#001F3F]">{day}</p>
                          <span className="text-xs text-gray-500">{docs.length} files</span>
                        </div>
                        <div className="space-y-3">
                          {docs.map((doc) => (
                            <div key={doc.id} className="rounded-2xl bg-white p-3 border border-gray-100">
                              <p className="text-sm font-semibold text-[#001F3F] truncate">{doc.title || doc.file_name}</p>
                              <p className="text-xs text-gray-500">{CATEGORY_LABELS[doc.category] || 'General'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
