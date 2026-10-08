import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiCheckCircle, FiClock, FiFileText, FiDownload, FiEye, FiBookOpen, FiAward, FiMessageSquare } from 'react-icons/fi';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = '/api';
const DOC_TYPE_LABELS = { 'return-slip': 'Return Slip', 'scheme-of-work': 'Scheme of Work', 'daily-lesson-plan': 'DLP', evidence: 'Evidence', reflection: 'Reflection', general: 'General' };

export default function SupervisorDashboard() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [grade, setGrade] = useState('');
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDocuments(response.data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDocument = async (docId) => {
    try {
      await axios.patch(`${API_BASE_URL}/documents/${docId}/status`, {
        status: 'approved'
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert('Document approved!');
      fetchDocuments();
      setSelectedDoc(null);
    } catch (err) {
      alert('Failed to approve document');
    }
  };

  const handleRejectDocument = async (docId) => {
    try {
      await axios.patch(`${API_BASE_URL}/documents/${docId}/status`, {
        status: 'rejected'
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert('Document rejected!');
      fetchDocuments();
      setSelectedDoc(null);
    } catch (err) {
      alert('Failed to reject document');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = {
    pending: documents.filter(d => d.status === 'pending').length,
    approved: documents.filter(d => d.status === 'approved').length,
    reviewed: documents.filter(d => d.status === 'reviewed').length,
    total: documents.length
  };

  const openDoc = (doc) => {
    setSelectedDoc(doc);
    setGrade(doc.final_grade || '');
    setComment(doc.supervisor_comment || '');
  };

  const saveReview = async (status) => {
    if (!selectedDoc) return;
    setSaving(true);
    try {
      await axios.patch(`${API_BASE_URL}/documents/${selectedDoc.id}/status`, { status, grade, supervisorComment: comment }, { headers: { Authorization: `Bearer ${token}` } });
      await fetchDocuments();
      setSelectedDoc(null);
      setGrade('');
      setComment('');
    } catch (err) {
      alert(err.response?.data?.error || 'Review failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F9FF]">
      <Sidebar role={user?.role || 'supervisor'} onLogout={handleLogout} />

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#87CEEB]">BUSE Supervisor Review</p>
            <h1 className="text-4xl font-bold text-[#003399]">Supervisor Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/supervisor/forms')} className="flex items-center gap-2 bg-[#003399] hover:bg-[#001F3F] text-white px-4 py-2 rounded-xl">
              <FiBookOpen /> Open Forms
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[{ label: 'Pending', value: stats.pending, color: 'from-yellow-400 to-yellow-300', icon: FiClock }, { label: 'Approved', value: stats.approved, color: 'from-green-400 to-green-300', icon: FiCheckCircle }, { label: 'Reviewed', value: stats.reviewed, color: 'from-blue-400 to-sky-400', icon: FiBookOpen }, { label: 'Total', value: stats.total, color: 'from-[#003399] to-[#001F3F]', icon: FiFileText }].map(card => (
            <div key={card.label} className={`rounded-2xl bg-gradient-to-br ${card.color} p-5 text-white shadow`}> <div className="flex items-center justify-between"><div><p className="text-sm opacity-90">{card.label}</p><p className="text-3xl font-bold">{card.value}</p></div><card.icon className="text-4xl opacity-30" /></div></div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="text-2xl font-bold text-[#003399] mb-4">Student submissions for review</h2>
              {loading ? <p className="text-gray-500">Loading submissions...</p> : documents.length === 0 ? <p className="text-gray-500">No submissions available yet.</p> : (
                <div className="space-y-3 max-h-[480px] overflow-y-auto">
                  {documents.map(doc => (
                    <div key={doc.id} className="border border-blue-100 rounded-2xl p-4 hover:shadow-md transition cursor-pointer" onClick={() => openDoc(doc)}>
                      <div className="flex justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-[#003399]">{doc.title || doc.file_name}</h3>
                          <p className="text-sm text-gray-600">{doc.first_name} {doc.last_name} · {DOC_TYPE_LABELS[doc.category] || 'General'}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${doc.status === 'approved' ? 'bg-green-100 text-green-700' : doc.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{doc.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            {selectedDoc ? (
              <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Student</p>
                  <p className="font-semibold text-[#003399]">{selectedDoc.first_name} {selectedDoc.last_name}</p>
                  {selectedDoc.student_reg_number && <p className="text-sm font-bold text-[#003399]">📋 Reg: {selectedDoc.student_reg_number}</p>}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Submission title</p>
                  <p className="font-semibold text-[#001F3F]">{selectedDoc.title || selectedDoc.file_name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Category</p>
                  <p className="font-semibold text-[#001F3F]">{DOC_TYPE_LABELS[selectedDoc.category] || 'General'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Status</p>
                  <p className="capitalize font-semibold text-[#001F3F]">{selectedDoc.status}</p>
                </div>
                <div className="rounded-2xl bg-[#EEF4FF] p-3 border border-blue-100">
                  <p className="text-sm font-semibold text-[#003399] mb-2">Supervisor review</p>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Final grade</label>
                  <input value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="e.g. 78%" />
                  <label className="block text-xs font-semibold text-gray-600 mt-3 mb-1">Comment</label>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="4" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="Provide feedback and recommended action" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => saveReview('approved')} disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold disabled:opacity-60">Approve</button>
                  <button onClick={() => saveReview('reviewed')} disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold disabled:opacity-60">Review</button>
                  <button onClick={() => saveReview('rejected')} disabled={saving} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold disabled:opacity-60">Reject</button>
                </div>
                <button onClick={() => setSelectedDoc(null)} className="w-full border border-gray-200 text-gray-600 py-2 rounded-xl">Close</button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-5 text-center text-gray-500">Select a submission to review it.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
