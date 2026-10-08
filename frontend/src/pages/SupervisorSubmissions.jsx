import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiDownload, FiArrowLeft, FiCheckCircle, FiXCircle, FiFileText, FiFolder } from 'react-icons/fi';
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

export default function SupervisorSubmissions() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const role = user?.role || localStorage.getItem('auth_role') || 'supervisor';
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docsLoading, setDocsLoading] = useState(false);
  const [downloadAllLoading, setDownloadAllLoading] = useState(false);

  useEffect(() => { loadStudents(); }, []);

  const loadStudents = async () => {
    try {
            const res = await axios.get(`${API_BASE_URL}/assignments/my-students`, { headers: { Authorization: `Bearer ${token}` } });
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async (student) => {
    setSelected(student);
    setDocsLoading(true);
    try {
            const res = await axios.get(`${API_BASE_URL}/documents?userId=${student.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setDocuments(res.data || []);
    } catch (err) {
      console.error(err);
      setDocuments([]);
    } finally {
      setDocsLoading(false);
    }
  };

  const patchStatus = async (doc, status) => {
    try {
            await axios.patch(`${API_BASE_URL}/documents/${doc.id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      loadDocuments(selected);
    } catch (err) {
      alert(err.response?.data?.error || 'Action failed');
    }
  };

  const downloadFile = async (doc) => {
    try {
            const res = await axios.post(`${API_BASE_URL}/documents/${doc.id}/download`, {}, { headers: { Authorization: `Bearer ${token}` } });
      const url = res.data.filePath;
      window.open(url, '_blank');
    } catch (err) {
      alert('Unable to download file');
    }
  };

  const downloadAll = async () => {
    if (!selected) return;
    setDownloadAllLoading(true);
    try {
            const res = await axios.get(`${API_BASE_URL}/documents/download-zip/${selected.id}`, { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selected.first_name || selected.student_name || 'student'}-submissions.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to download all files');
    } finally {
      setDownloadAllLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F5F9FF]">
      <Sidebar role={role} onLogout={handleLogout} />
      <main className="flex-1 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#87CEEB]">Supervisor Submissions</p>
            <h1 className="text-4xl font-bold text-[#003399]">Assigned Student Submissions</h1>
            <p className="text-gray-500 mt-2">Review student uploads, approve submissions, and download individual or batch files.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/supervisor')} className="bg-white border border-gray-200 text-[#003399] px-4 py-2 rounded-xl">Supervisor home</button>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"><FiLogOut /> Logout</button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-1 bg-white rounded-3xl shadow-sm p-5 border border-blue-100">
            <div className="flex items-center gap-3 mb-5">
              <FiFolder className="text-[#003399] text-xl" />
              <div>
                <p className="text-sm text-gray-500">Assigned students</p>
                <p className="text-2xl font-bold text-[#001F3F]">{students.length}</p>
              </div>
            </div>
            {loading ? (
              <p className="text-gray-500">Loading student list...</p>
            ) : students.length === 0 ? (
              <p className="text-gray-500">No students assigned yet.</p>
            ) : (
              <div className="space-y-3">
                {students.map((student) => (
                  <button key={student.id} onClick={() => loadDocuments(student)} className={`w-full text-left p-3 rounded-2xl border ${selected?.id === student.id ? 'border-[#003399] bg-[#EEF4FF]' : 'border-gray-200 hover:bg-blue-50'}`}>
                    <p className="font-semibold text-[#001F3F]">{student.first_name} {student.last_name}</p>
                    <p className="text-xs text-gray-500">Reg: {student.reg_id || student.student_id || 'N/A'}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="xl:col-span-3 bg-white rounded-3xl shadow-sm p-5 border border-blue-100">
            {selected ? (
              <>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#87CEEB]">Selected student</p>
                    <h2 className="text-2xl font-bold text-[#003399]">{selected.first_name} {selected.last_name}</h2>
                    <p className="text-sm text-gray-500">Reg: {selected.reg_id || selected.student_id || 'N/A'}</p>
                    <p className="text-sm font-semibold text-[#003399]">Program: {selected.program || 'Pending'}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={downloadAll} disabled={downloadAllLoading || docsLoading || documents.length === 0} className="bg-[#003399] hover:bg-[#001F3F] text-white px-4 py-2 rounded-xl disabled:opacity-60">{downloadAllLoading ? 'Preparing ZIP...' : 'Download all submissions'}</button>
                  </div>
                </div>

                {docsLoading ? (
                  <p className="text-gray-500">Loading submissions...</p>
                ) : documents.length === 0 ? (
                  <p className="text-gray-500">This student has no submissions yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-[#F8FAFF] text-left text-xs text-gray-500 uppercase tracking-[0.15em]">
                        <tr>
                          <th className="px-4 py-3">Title</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Submitted</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.map((doc) => (
                          <tr key={doc.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                            <td className="px-4 py-4 font-semibold text-[#001F3F]">{doc.title || doc.file_name}</td>
                            <td className="px-4 py-4"><span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700">{CATEGORY_LABELS[doc.category] || 'General'}</span></td>
                            <td className="px-4 py-4 capitalize">{doc.status}</td>
                            <td className="px-4 py-4 text-gray-500">{new Date(doc.created_at).toLocaleString()}</td>
                            <td className="px-4 py-4 space-x-2">
                              <button onClick={() => downloadFile(doc)} className="text-[#003399] hover:text-[#001F3F]">Download</button>
                              <button onClick={() => patchStatus(doc, 'approved')} className="text-green-600 hover:text-green-800">Approve</button>
                              <button onClick={() => patchStatus(doc, 'rejected')} className="text-red-600 hover:text-red-800">Reject</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-3xl bg-[#F8FAFF] p-6 text-center text-gray-500 border border-blue-100">
                <FiFolder className="mx-auto text-4xl text-[#003399] mb-4" />
                <p>Select an assigned student to view their document submissions.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
