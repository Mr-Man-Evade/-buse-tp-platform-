import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiArrowLeft, FiAward, FiCalendar, FiFileText } from 'react-icons/fi';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = '/api';
const SCORE_LABELS = [
  { key: 'lesson_intro', label: 'Introduction' },
  { key: 'lesson_objectives', label: 'Objectives' },
  { key: 'lesson_sequencing', label: 'Sequencing' },
  { key: 'lesson_teacher_activities', label: 'Teacher Activities' },
  { key: 'lesson_pupils_experiences', label: 'Pupils Experiences' },
  { key: 'lesson_strategies', label: 'Teaching Strategies' },
  { key: 'lesson_media', label: 'Media Selection' },
  { key: 'lesson_format_frequency', label: 'Lesson Format' },
  { key: 'scheming_aims', label: 'Scheme Aims' },
  { key: 'scheming_content', label: 'Scheme Content' },
  { key: 'scheming_methods', label: 'Scheme Methods' },
  { key: 'scheming_resources', label: 'Scheme Resources' },
  { key: 'scheming_references', label: 'Scheme References' },
  { key: 'assessment_test_design', label: 'Test Design' },
  { key: 'assessment_assignments', label: 'Assignments' },
  { key: 'assessment_remedial', label: 'Remedial Work' },
  { key: 'assessment_extension', label: 'Extension Work' },
  { key: 'assessment_profiles', label: 'Mark Profiles / Reports' },
  { key: 'assessment_records', label: 'Records Evaluation' },
  { key: 'reflective_depth_scope', label: 'Reflective Depth' },
  { key: 'reflective_attainment', label: 'Attainment Review' },
  { key: 'reflective_weaknesses_strengths', label: 'Weaknesses / Strengths' },
  { key: 'reflective_suggestions', label: 'Reflective Suggestions' },
  { key: 'file_appearance_relevant_sections', label: 'File Appearance & Sections' }
];

export default function StudentFinalMark() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const role = user?.role || localStorage.getItem('auth_role') || 'student';
  const [finalMark, setFinalMark] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadFinalMark(); }, []);

  const loadFinalMark = async () => {
    try {
            const res = await axios.get(`${API_BASE_URL}/final-marks/me`, { headers: { Authorization: `Bearer ${token}` } });
      setFinalMark(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
            <p className="text-sm uppercase tracking-[0.2em] text-[#87CEEB]">Student Final Mark</p>
            <h1 className="text-4xl font-bold text-[#003399]">My Final Mark</h1>
            <p className="text-gray-500 mt-2">View your supervisor's final assessment and overall school placement summary.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/student')} className="bg-white border border-gray-200 text-[#003399] px-4 py-2 rounded-xl">Back to dashboard</button>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"><FiLogOut /> Logout</button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading final mark...</p>
        ) : !finalMark ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-blue-100 text-center">
            <p className="text-gray-500">No final mark has been submitted yet. Please check back with your supervisor.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100">
                <p className="text-xs uppercase tracking-[0.3em] text-[#87CEEB] mb-2">Student</p>
                <h2 className="text-xl font-bold text-[#003399]">{finalMark.student_name}</h2>
                <p className="text-sm text-gray-500">{finalMark.email}</p>
                <p className="text-sm text-gray-500 mt-2">Reg #: {finalMark.reg_number || 'Not available'}</p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100">
                <p className="text-xs uppercase tracking-[0.3em] text-[#87CEEB] mb-2">Supervisor</p>
                <h2 className="text-xl font-bold text-[#003399]">{finalMark.supervisor_id ? 'Assigned' : 'Unassigned'}</h2>
                <p className="text-sm text-gray-500 mt-2">Program: {finalMark.programme || 'Pending'}</p>
                <p className="text-sm text-gray-500">School: {finalMark.tp_school_name || 'Pending'}</p>
              </div>
              <div className="bg-gradient-to-br from-[#003399] to-[#001F3F] text-white rounded-3xl p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] opacity-80">Final Award</p>
                <p className="text-5xl font-bold mt-4">{finalMark.mark_awarded || 'Pending'}</p>
                <p className="text-sm mt-2 text-white/80">Total points: {finalMark.total_marks ?? '-'}</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#003399]">Assessment Details</h2>
                  <p className="text-sm text-gray-500">Scores and comments from your supervisor.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF4FF] px-3 py-1 text-xs text-[#003399]">
                  <FiAward /> Read-only
                </span>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {SCORE_LABELS.map((item) => (
                  <div key={item.key} className="rounded-2xl bg-[#F8FAFF] p-4 border border-gray-100">
                    <p className="text-sm text-gray-600 mb-2">{item.label}</p>
                    <p className="text-lg font-semibold text-[#001F3F]">{finalMark[item.key] ?? '—'}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100">
              <h2 className="text-xl font-bold text-[#003399] mb-3">Supervisor notes</h2>
              <p className="text-gray-600 whitespace-pre-line">{finalMark.overall_comments || 'No additional comments were provided.'}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
