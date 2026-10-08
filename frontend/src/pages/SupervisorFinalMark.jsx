import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiLogOut, FiCheckCircle, FiEye, FiBookOpen, FiMessageSquare } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = '/api';
const SCORE_FIELDS = [
  { key: 'lessonIntro', label: 'Relevance of Introduction', max: 4 },
  { key: 'lessonObjectives', label: 'Clarity of objectives', max: 4 },
  { key: 'lessonSequencing', label: 'Sequencing of content', max: 4 },
  { key: 'lessonTeacherActivities', label: 'Clarity of teacher activities', max: 4 },
  { key: 'lessonPupilsExperiences', label: "Pupils' activities / experiences", max: 4 },
  { key: 'lessonStrategies', label: 'Suitability of teaching strategies', max: 4 },
  { key: 'lessonMedia', label: 'Media selection', max: 4 },
  { key: 'lessonFormatFrequency', label: 'Format and frequency of lesson planning', max: 4 },
  { key: 'schemingAims', label: 'Clarity of scheme aims and objectives', max: 4 },
  { key: 'schemingContent', label: 'Specification of content / lessons', max: 4 },
  { key: 'schemingMethods', label: 'Methods and learning experiences', max: 4 },
  { key: 'schemingResources', label: 'Resources-suitability to concepts', max: 4 },
  { key: 'schemingReferences', label: 'References- variety and relevance', max: 4 },
  { key: 'assessmentTestDesign', label: 'Test designing and marking', max: 4 },
  { key: 'assessmentAssignments', label: 'Assignments and marking', max: 4 },
  { key: 'assessmentRemedial', label: 'Remedial work', max: 4 },
  { key: 'assessmentExtension', label: 'Extension work', max: 4 },
  { key: 'assessmentProfiles', label: 'Pupils\' mark profiles / reports', max: 4 },
  { key: 'assessmentRecords', label: 'Records and evaluation of peers', max: 4 },
  { key: 'reflectiveDepthScope', label: 'Depth / scope of lesson & scheme evaluations', max: 4 },
  { key: 'reflectiveAttainment', label: 'Assessment of attainment of objectives', max: 4 },
  { key: 'reflectiveWeaknessesStrengths', label: 'Highlight of weaknesses/strengths in lessons', max: 4 },
  { key: 'reflectiveSuggestions', label: 'Suggestions for improving on basis of evaluation.', max: 4 },
  { key: 'fileAppearanceRelevantSections', label: 'Relevant sections and contents', max: 4 }
];

export default function SupervisorFinalMark() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const role = user?.role || localStorage.getItem('auth_role') || 'supervisor';

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form, setForm] = useState({
    programme: '',
    tpSchoolName: '',
    tpDate: '',
    tpDurationFrom: '',
    tpDurationTo: '',
    subjectTeaching: '',
    classes: '',
    overallComments: '',
    markAwarded: ''
  });
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    if (role === 'supervisor') {
      loadStudents();
    } else {
      loadMyFinalMark();
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const loadStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/final-marks/my-students`, { headers: { Authorization: `Bearer ${token}` } });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMyFinalMark = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/final-marks/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data) {
        setSelectedStudent(res.data);
        const fields = {
          programme: res.data.programme || '',
          tpSchoolName: res.data.tp_school_name || '',
          tpDate: res.data.tp_date || '',
          tpDurationFrom: res.data.tp_duration_from || '',
          tpDurationTo: res.data.tp_duration_to || '',
          subjectTeaching: res.data.subject_teaching || '',
          classes: res.data.classes || '',
          overallComments: res.data.overall_comments || '',
          markAwarded: res.data.mark_awarded || ''
        };
        setForm(fields);
        setScores({
          lessonIntro: res.data.lesson_intro,
          lessonObjectives: res.data.lesson_objectives,
          lessonSequencing: res.data.lesson_sequencing,
          lessonTeacherActivities: res.data.lesson_teacher_activities,
          lessonPupilsExperiences: res.data.lesson_pupils_experiences,
          lessonStrategies: res.data.lesson_strategies,
          lessonMedia: res.data.lesson_media,
          lessonFormatFrequency: res.data.lesson_format_frequency,
          schemingAims: res.data.scheming_aims,
          schemingContent: res.data.scheming_content,
          schemingMethods: res.data.scheming_methods,
          schemingResources: res.data.scheming_resources,
          schemingReferences: res.data.scheming_references,
          assessmentTestDesign: res.data.assessment_test_design,
          assessmentAssignments: res.data.assessment_assignments,
          assessmentRemedial: res.data.assessment_remedial,
          assessmentExtension: res.data.assessment_extension,
          assessmentProfiles: res.data.assessment_profiles,
          assessmentRecords: res.data.assessment_records,
          reflectiveDepthScope: res.data.reflective_depth_scope,
          reflectiveAttainment: res.data.reflective_attainment,
          reflectiveWeaknessesStrengths: res.data.reflective_weaknesses_strengths,
          reflectiveSuggestions: res.data.reflective_suggestions,
          fileAppearanceRelevantSections: res.data.file_appearance_relevant_sections
        });
      }
      setReadOnly(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectStudent = async (student) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/final-marks/student/${student.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSelectedStudent({ ...student, finalMark: res.data });
      if (res.data) {
        setForm({
          programme: res.data.programme || '',
          tpSchoolName: res.data.tp_school_name || '',
          tpDate: res.data.tp_date || '',
          tpDurationFrom: res.data.tp_duration_from || '',
          tpDurationTo: res.data.tp_duration_to || '',
          subjectTeaching: res.data.subject_teaching || '',
          classes: res.data.classes || '',
          overallComments: res.data.overall_comments || '',
          markAwarded: res.data.mark_awarded || ''
        });
        setScores({
          lessonIntro: res.data.lesson_intro,
          lessonObjectives: res.data.lesson_objectives,
          lessonSequencing: res.data.lesson_sequencing,
          lessonTeacherActivities: res.data.lesson_teacher_activities,
          lessonPupilsExperiences: res.data.lesson_pupils_experiences,
          lessonStrategies: res.data.lesson_strategies,
          lessonMedia: res.data.lesson_media,
          lessonFormatFrequency: res.data.lesson_format_frequency,
          schemingAims: res.data.scheming_aims,
          schemingContent: res.data.scheming_content,
          schemingMethods: res.data.scheming_methods,
          schemingResources: res.data.scheming_resources,
          schemingReferences: res.data.scheming_references,
          assessmentTestDesign: res.data.assessment_test_design,
          assessmentAssignments: res.data.assessment_assignments,
          assessmentRemedial: res.data.assessment_remedial,
          assessmentExtension: res.data.assessment_extension,
          assessmentProfiles: res.data.assessment_profiles,
          assessmentRecords: res.data.assessment_records,
          reflectiveDepthScope: res.data.reflective_depth_scope,
          reflectiveAttainment: res.data.reflective_attainment,
          reflectiveWeaknessesStrengths: res.data.reflective_weaknesses_strengths,
          reflectiveSuggestions: res.data.reflective_suggestions,
          fileAppearanceRelevantSections: res.data.file_appearance_relevant_sections
        });
      } else {
        setForm({
          programme: '',
          tpSchoolName: '',
          tpDate: '',
          tpDurationFrom: '',
          tpDurationTo: '',
          subjectTeaching: '',
          classes: '',
          overallComments: '',
          markAwarded: ''
        });
        setScores({});
      }
      setReadOnly(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (field, value) => {
    if (readOnly) return;
    setScores(prev => ({ ...prev, [field]: value }));
  };

  const handleFormChange = (field, value) => {
    if (readOnly) return;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!selectedStudent) return;
    setSaving(true);
    try {
      await axios.post(`${API_BASE_URL}/final-marks`, {
        studentId: selectedStudent.id,
        ...form,
        ...scores
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Final mark saved successfully');
      await loadStudents();
    } catch (err) {
      alert(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const totalScore = Object.values(scores).reduce((sum, v) => sum + (parseInt(v) || 0), 0);

  return (
    <div className="flex min-h-screen bg-[#F5F9FF]">
      <Sidebar role={role} onLogout={handleLogout} />

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#87CEEB]">Supervisor Final Mark</p>
            <h1 className="text-4xl font-bold text-[#003399]">Final Mark Submission</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl">
            <FiLogOut /> Logout
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-bold text-[#003399] mb-4">Students</h2>
              {role === 'supervisor' ? (
                students.length === 0 ? <p className="text-gray-500">No assigned students.</p> : (
                  <div className="space-y-3">
                    {students.map(student => (
                      <button key={student.id} onClick={() => selectStudent(student)} className={`w-full text-left p-3 rounded-xl border-2 transition ${selectedStudent?.id === student.id ? 'bg-blue-50 border-[#003399]' : 'border-gray-200 hover:bg-blue-50'}`}>
                        <p className="font-semibold text-[#001F3F]">{student.first_name} {student.last_name}</p>
                        {student.student_id && <p className="text-sm font-bold text-[#003399]">📋 Reg: {student.student_id}</p>}
                        <p className="text-xs text-gray-500">{student.email}</p>
                        {student.total_marks != null && <p className="text-xs text-blue-600 mt-1">Final mark: {student.mark_awarded} ({student.total_marks})</p>}
                      </button>
                    ))}
                  </div>
                )
              ) : selectedStudent ? (
                <div className="space-y-3">
                  <div className="bg-[#F0F4FF] border-2 border-[#003399] rounded-lg p-3">
                    <p className="text-xs text-gray-600 uppercase">Student</p>
                    <p className="font-bold text-[#001F3F]">{selectedStudent.first_name} {selectedStudent.last_name}</p>
                  </div>
                  {selectedStudent.student_id && (
                    <div className="bg-[#F0F4FF] border-2 border-[#003399] rounded-lg p-3">
                      <p className="text-xs text-gray-600 uppercase">Registration Number</p>
                      <p className="font-bold text-2xl text-[#003399]">📋 {selectedStudent.student_id}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">{selectedStudent.email}</p>
                    {selectedStudent.finalMark && <p className="text-sm text-blue-700 font-semibold">Final Mark: {selectedStudent.finalMark.mark_awarded || 'Not assigned'}</p>}
                  </div>
                </div>
              ) : selectedStudent ? (
                <div>
                  <p className="font-semibold text-[#003399]">{selectedStudent.student_name}</p>
                  <p className="text-sm text-gray-500">{selectedStudent.email}</p>
                  <p className="text-sm text-gray-500">Reg: {selectedStudent.reg_number}</p>
                  <p className="mt-3 text-blue-700 font-semibold">Final Mark: {selectedStudent.mark_awarded || 'Not assigned'}</p>
                </div>
              ) : (
                <p className="text-gray-500">No final mark available.</p>
              )}
            </div>

            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-5 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Programme</label>
                  <input value={form.programme} onChange={(e) => handleFormChange('programme', e.target.value)} disabled={readOnly} className="w-full border border-gray-200 rounded-xl px-3 py-2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">TP School Name</label>
                  <input value={form.tpSchoolName} onChange={(e) => handleFormChange('tpSchoolName', e.target.value)} disabled={readOnly} className="w-full border border-gray-200 rounded-xl px-3 py-2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
                  <input type="date" value={form.tpDate} onChange={(e) => handleFormChange('tpDate', e.target.value)} disabled={readOnly} className="w-full border border-gray-200 rounded-xl px-3 py-2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Duration From</label>
                  <input type="date" value={form.tpDurationFrom} onChange={(e) => handleFormChange('tpDurationFrom', e.target.value)} disabled={readOnly} className="w-full border border-gray-200 rounded-xl px-3 py-2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Duration To</label>
                  <input type="date" value={form.tpDurationTo} onChange={(e) => handleFormChange('tpDurationTo', e.target.value)} disabled={readOnly} className="w-full border border-gray-200 rounded-xl px-3 py-2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Subject Teaching</label>
                  <input value={form.subjectTeaching} onChange={(e) => handleFormChange('subjectTeaching', e.target.value)} disabled={readOnly} className="w-full border border-gray-200 rounded-xl px-3 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Classes</label>
                  <input value={form.classes} onChange={(e) => handleFormChange('classes', e.target.value)} disabled={readOnly} className="w-full border border-gray-200 rounded-xl px-3 py-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SCORE_FIELDS.map(field => (
                  <div key={field.key} className="bg-[#F8FAFF] rounded-2xl p-4 border border-gray-100">
                    <p className="text-sm font-medium text-[#003399] mb-2">{field.label}</p>
                    <input type="number" min="0" max={field.max} value={scores[field.key] ?? ''} onChange={(e) => handleScoreChange(field.key, e.target.value)} disabled={readOnly} className="w-full border border-gray-200 rounded-xl px-3 py-2" />
                    <p className="text-xs text-gray-500 mt-1">Max {field.max}</p>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Overall Comments</label>
                <textarea value={form.overallComments} onChange={(e) => handleFormChange('overallComments', e.target.value)} disabled={readOnly} rows="4" className="w-full border border-gray-200 rounded-xl px-3 py-2" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Mark Awarded</label>
                  <input value={form.markAwarded} onChange={(e) => handleFormChange('markAwarded', e.target.value)} disabled={readOnly} className="w-full border border-gray-200 rounded-xl px-3 py-2" />
                </div>
                <div className="bg-blue-50 rounded-2xl p-4">
                  <p className="text-sm font-semibold text-[#003399]">Total mark</p>
                  <p className="text-3xl font-bold text-[#001F3F]">{totalScore}</p>
                </div>
              </div>

              {!readOnly && (
                <button onClick={handleSave} disabled={saving || !selectedStudent} className="w-full bg-[#003399] text-white py-3 rounded-2xl font-semibold disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save Final Mark'}
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
