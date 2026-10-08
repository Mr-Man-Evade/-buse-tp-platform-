import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUpload, FiLogOut, FiFileText, FiCheckCircle, FiClock, FiMessageSquare, FiChevronUp, FiTrash2, FiAlertCircle, FiBell, FiHome, FiBarChart2, FiUser, FiMenu, FiMessageCircle, FiXCircle, FiBookOpen, FiCalendar, FiAward } from 'react-icons/fi';
import axios from 'axios';
import DocumentUpload from '../components/DocumentUpload';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = '/api';
const STATUS_COLORS = { approved: 'bg-green-100 text-green-700 border border-green-200', pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200', rejected: 'bg-red-100 text-red-700 border border-red-200', reviewed: 'bg-blue-100 text-blue-700 border border-blue-200' };
const TYPE_LABELS = { 'return-slip': 'Return Slip', 'scheme-of-work': 'Scheme of Work', 'daily-lesson-plan': 'DLP', evidence: 'Evidence', reflection: 'Reflection', general: 'General' };
const TYPE_COLORS = { 'return-slip': 'bg-sky-100 text-sky-700', 'scheme-of-work': 'bg-indigo-100 text-indigo-700', 'daily-lesson-plan': 'bg-purple-100 text-purple-700', evidence: 'bg-teal-100 text-teal-700', reflection: 'bg-amber-100 text-amber-700', general: 'bg-gray-100 text-gray-600' };

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [documents, setDocuments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState(null);
  const [feedbackMap, setFeedbackMap] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [assignment, setAssignment] = useState(null);
  const [showAnn, setShowAnn] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [docsRes, annRes, assignRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/documents/my-documents`, { headers }),
        axios.get(`${API_BASE_URL}/announcements`, { headers }),
        axios.get(`${API_BASE_URL}/assignments/my-assignment`, { headers }).catch(() => ({ data: null })),
      ]);
      setDocuments(docsRes.data);
      setAnnouncements(annRes.data);
      setUnreadCount(annRes.data.filter(a => !parseInt(a.is_read)).length);
      setAssignment(assignRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filteredDocs = statusFilter === 'all' ? documents : documents.filter(d => d.status === statusFilter);
  const stats = { pending: documents.filter(d => d.status === 'pending').length, approved: documents.filter(d => d.status === 'approved').length, rejected: documents.filter(d => d.status === 'rejected').length, reviewed: documents.filter(d => d.status === 'reviewed').length };
  const approvalRate = documents.length > 0 ? Math.round((stats.approved / documents.length) * 100) : 0;

  const toggleFeedback = async (doc) => {
    if (expandedDoc === doc.id) { setExpandedDoc(null); return; }
    setExpandedDoc(doc.id);
    if (feedbackMap[doc.id]) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/feedback/document/${doc.id}`, { headers });
      setFeedbackMap(prev => ({ ...prev, [doc.id]: res.data }));
    } catch { setFeedbackMap(prev => ({ ...prev, [doc.id]: [] })); }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/documents/${deleteTarget.id}`, { headers });
      setDocuments(prev => prev.filter(d => d.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) { alert(err.response?.data?.error || 'Delete failed'); }
    finally { setDeleteLoading(false); }
  };

  const markRead = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/announcements/${id}/read`, {}, { headers });
      setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, is_read: 1 } : a));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const handleLogout = () => { logout(); navigate('/login'); };


  return (
    <div className="flex min-h-screen portal-page">
      <Sidebar role={user?.role || 'student'} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="portal-hero text-white px-5 py-3 flex items-center gap-3 shadow-lg sticky top-0 z-20">
          <div className="flex items-center gap-2 flex-1">
            <img src="/buse-logo.png" alt="" className="w-8 h-8 object-contain hidden sm:block" onError={e => { e.target.style.display = 'none'; }} />
            <p className="font-bold text-sm">BUSE TP Management System</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAnn(!showAnn)} className="relative p-2 hover:bg-white/10 rounded-full">
              <FiBell />{unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 rounded-full text-xs flex items-center justify-center font-bold">{unreadCount}</span>}
            </button>
            <Link to="/chat" className="p-2 hover:bg-white/10 rounded-full"><FiMessageCircle /></Link>
            <Link to="/profile" className="w-9 h-9 rounded-full bg-[#FFD700] text-[#001F3F] font-bold text-sm flex items-center justify-center overflow-hidden shrink-0">
              {user?.profilePicture ? <img src={`/${user.profilePicture}`} className="w-full h-full object-cover" alt="" /> : `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`}
            </Link>
          </div>
        </header>

        {/* Announcements dropdown */}
        {showAnn && (
          <div className="bg-white shadow-xl border-b max-h-72 overflow-y-auto z-10">
            <div className="px-5 py-3 border-b font-bold text-[#003399] text-sm flex justify-between items-center">
              <span>📢 Announcements</span>
              <button onClick={() => setShowAnn(false)}><FiXCircle className="text-gray-400" /></button>
            </div>
            {announcements.length === 0 ? <p className="p-4 text-sm text-gray-400">No announcements</p>
              : announcements.map(ann => (
                <div key={ann.id} onClick={() => markRead(ann.id)} className={`px-5 py-3 border-b cursor-pointer hover:bg-gray-50 ${!parseInt(ann.is_read) ? 'bg-blue-50 border-l-4 border-l-[#003399]' : ''}`}>
                  <p className="font-semibold text-sm text-[#001F3F]">{ann.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{ann.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(ann.created_at).toLocaleDateString()} · {ann.created_by_name}</p>
                </div>
              ))}
          </div>
        )}

        <main className="flex-1 p-5 space-y-5">
          <div className="portal-panel p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <span className="portal-badge">Student Teacher Dashboard</span>
              <h1 className="text-2xl font-bold text-[#001F3F] mt-2">Welcome, {user.firstName} {user.lastName}</h1>
              <p className="text-gray-500 text-sm">Keep your submissions and progress visible to your supervisor and coordinator.</p>
              {user.studentId && (
                <div className="mt-3 inline-block bg-[#F0F4FF] border-2 border-[#003399] px-4 py-2 rounded-lg">
                  <p className="text-xs text-gray-600">Registration Number</p>
                  <p className="text-lg font-bold text-[#003399]">📋 {user.studentId}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/student/forms')} className="flex items-center gap-2 bg-[#003399] hover:bg-[#001F3F] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow">
                <FiBookOpen /> View Forms
              </button>
              <button onClick={() => setShowUpload(!showUpload)} className="flex items-center gap-2 bg-gradient-to-r from-[#003399] to-[#001F3F] hover:from-[#002266] hover:to-[#001040] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow">
                <FiUpload /> Upload Document
              </button>
            </div>
          </div>

          {showUpload && <div className="bg-white rounded-2xl shadow-sm p-4"><DocumentUpload onUploadSuccess={() => { fetchAll(); setShowUpload(false); }} /></div>}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Documents Pending', value: stats.pending, from: 'from-orange-400', to: 'to-orange-500', icon: FiClock },
              { label: 'Documents Approved', value: stats.approved, from: 'from-green-500', to: 'to-emerald-500', icon: FiCheckCircle },
              { label: 'Documents Rejected', value: stats.rejected, from: 'from-red-500', to: 'to-rose-500', icon: FiXCircle },
              { label: 'Approval Rate', value: `${approvalRate}%`, from: 'from-[#003399]', to: 'to-[#001F3F]', icon: FiBarChart2 },
            ].map(c => (
              <div key={c.label} className={`bg-gradient-to-br ${c.from} ${c.to} rounded-2xl p-4 text-white shadow-md`}>
                <div className="flex justify-between items-start">
                  <div><p className="text-xs font-semibold opacity-80 mb-1">{c.label}</p><p className="text-3xl font-bold">{c.value}</p></div>
                  <c.icon className="text-3xl opacity-25" />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex justify-between text-sm font-semibold text-[#003399] mb-2"><span>Teaching Practice Progress</span><span>{approvalRate}%</span></div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-[#003399] to-[#87CEEB] h-2.5 rounded-full transition-all duration-700" style={{ width: `${approvalRate}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{stats.approved} of {documents.length} submissions approved</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[#003399]">Submission Record</h2>
                  <p className="text-xs text-gray-500">Track return slips, DLPs, schemes, and evidence uploads.</p>
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none">
                  <option value="all">All</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="reviewed">Reviewed</option>
                </select>
              </div>
              {loading ? <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
                : filteredDocs.length === 0 ? (
                  <div className="p-8 text-center">
                    <FiFileText className="text-4xl text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No submissions yet</p>
                    <button onClick={() => setShowUpload(true)} className="mt-2 text-[#003399] text-xs hover:underline">Upload your first submission →</button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                          <th className="text-left px-5 py-3 font-semibold">Title</th>
                          <th className="text-left px-3 py-3 font-semibold">Type</th>
                          <th className="text-left px-3 py-3 font-semibold">Status</th>
                          <th className="text-left px-3 py-3 font-semibold">Date</th>
                          <th className="px-3 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredDocs.map(doc => (
                          <React.Fragment key={doc.id}>
                            <tr className="hover:bg-gray-50 transition">
                              <td className="px-5 py-3 font-medium text-[#001F3F] max-w-[180px] truncate" title={doc.title || doc.file_name}>{doc.title || doc.file_name}</td>
                              <td className="px-3 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[doc.category] || TYPE_COLORS.general}`}>{TYPE_LABELS[doc.category] || 'General'}</span></td>
                              <td className="px-3 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[doc.status]}`}>{doc.status}</span></td>
                              <td className="px-3 py-3 text-gray-400 text-xs">{new Date(doc.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                              <td className="px-3 py-3">
                                <div className="flex gap-1">
                                  <button onClick={() => toggleFeedback(doc)} className="p-1 text-gray-400 hover:text-[#003399] rounded">{expandedDoc === doc.id ? <FiChevronUp /> : <FiMessageSquare />}</button>
                                  {doc.status === 'pending' && <button onClick={() => setDeleteTarget(doc)} className="p-1 text-gray-300 hover:text-red-500 rounded"><FiTrash2 /></button>}
                                </div>
                              </td>
                            </tr>
                            {expandedDoc === doc.id && (
                              <tr><td colSpan={5} className="bg-blue-50 px-5 py-3">
                                <p className="text-xs font-bold text-[#003399] mb-2">Supervisor feedback</p>
                                {!feedbackMap[doc.id] ? <p className="text-xs text-gray-400">Loading...</p>
                                  : feedbackMap[doc.id].length === 0 ? <p className="text-xs text-gray-400 italic">No feedback yet</p>
                                  : feedbackMap[doc.id].map(fb => (
                                    <div key={fb.id} className="bg-white rounded-lg p-3 mb-2 shadow-sm">
                                      <div className="flex justify-between mb-1">
                                        <span className="font-semibold text-xs text-[#003399]">{fb.first_name} {fb.last_name}</span>
                                        <span className="text-yellow-500 text-xs">{'★'.repeat(fb.rating || 0)}{'☆'.repeat(5 - (fb.rating || 0))}</span>
                                      </div>
                                      <p className="text-xs text-gray-700">{fb.comment}</p>
                                    </div>
                                  ))}
                              </td></tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>

            {/* Right panel */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="font-bold text-[#003399] text-sm mb-3 flex items-center gap-2"><FiAward /> Student profile</h3>
                <div className="rounded-2xl bg-[#EEF4FF] p-4 border border-blue-100 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Registration:</span><span className="font-semibold text-[#001F3F]">{user.studentId || 'Pending'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Program:</span><span className="font-semibold text-[#001F3F]">{user.program || 'Pending'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Level:</span><span className="font-semibold text-[#001F3F]">{user.level || 'Pending'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">School:</span><span className="font-semibold text-[#001F3F]">{user.school || 'Pending'}</span></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="font-bold text-[#003399] text-sm mb-3">My Mentor & Supervisor</h3>
                {assignment?.supervisor_name && <p className="text-xs text-gray-500 mb-3">Your supervisor can review submissions and submit the final TP assessment here.</p>}
                {!assignment ? <p className="text-xs text-gray-400">Not yet assigned. Contact your coordinator.</p> : (
                  <div className="space-y-3">
                    {assignment.mentor_name && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#003399] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                          {assignment.mentor_picture ? <img src={`/${assignment.mentor_picture}`} className="w-full h-full object-cover" alt="" /> : assignment.mentor_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0"><p className="font-semibold text-xs text-[#001F3F]">{assignment.mentor_name}</p><p className="text-xs text-gray-400">Mentor</p></div>
                        <Link to="/chat" className="text-xs bg-[#003399] text-white px-2 py-1 rounded-lg">Chat</Link>
                      </div>
                    )}
                    {assignment.supervisor_name && (
                      <div className="flex items-center gap-3 pt-3 border-t">
                        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {assignment.supervisor_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0"><p className="font-semibold text-xs text-[#001F3F]">{assignment.supervisor_name}</p><p className="text-xs text-gray-400">Supervisor</p></div>
                        <Link to="/chat" className="text-xs bg-green-600 text-white px-2 py-1 rounded-lg">Chat</Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="font-bold text-[#003399] text-sm mb-3 flex items-center gap-2">
                  <FiBell /> Announcements {unreadCount > 0 && <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount} new</span>}
                </h3>
                {announcements.length === 0 ? <p className="text-xs text-gray-400">No announcements</p>
                  : announcements.slice(0, 3).map(ann => (
                    <div key={ann.id} onClick={() => markRead(ann.id)} className={`p-2.5 rounded-xl mb-2 cursor-pointer ${!parseInt(ann.is_read) ? 'bg-[#EEF2FF] border-l-2 border-[#003399]' : 'bg-gray-50'}`}>
                      <p className={`text-xs font-semibold ${!parseInt(ann.is_read) ? 'text-[#003399]' : 'text-gray-700'}`}>🔔 {ann.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{ann.message}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <FiAlertCircle className="text-4xl text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">Delete Document?</h3>
            <p className="text-gray-500 text-sm mb-4">Delete <strong>"{deleteTarget.title || deleteTarget.file_name}"</strong>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border rounded-xl text-gray-700 text-sm font-semibold">Cancel</button>
              <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold disabled:opacity-60">{deleteLoading ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
