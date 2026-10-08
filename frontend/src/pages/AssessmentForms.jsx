import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiUsers, FiBookOpen, FiSend, FiUserCheck } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import InstrumentViewer from '../components/InstrumentViewer';

const API_BASE_URL = '/api';

const FORM_DEFS = [
  { key: 'lesson-observation', title: 'Lesson Observation Instrument', description: 'Mentor review of lesson delivery and classroom practice.' },
  { key: 'test-supervision', title: 'Test Supervision and Assessment', description: 'Supervisor evaluation of test administration and assessment quality.' },
  { key: 'document-assessment', title: 'Assessment of Documents', description: 'Review of student teaching documents and planning materials.' }
];

const initialFormData = {
  teacherName: '',
  school: '',
  className: '',
  teachingSubject: '',
  topic: '',
  tpDates: '',
  observationDate: '',
  lessonType: '',
  strengths: '',
  improvements: '',
  overallRating: '3'
};

const ROLE_LABELS = {
  student: 'Student',
  mentor: 'Mentor',
  supervisor: 'Supervisor',
  coordinator: 'Coordinator',
  admin: 'Admin'
};

export default function AssessmentForms() {
  const navigate = useNavigate();
  const params = useParams();
  const routeStudentId = params.studentId || '';
  const [selectedForm, setSelectedForm] = useState(FORM_DEFS[0].key);
  const [student, setStudent] = useState(null);
  const [formState, setFormState] = useState(initialFormData);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(routeStudentId || 'me');
  const [studentListLoading, setStudentListLoading] = useState(false);
  const [accessNotice, setAccessNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('auth_token');
  const currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
  const currentRole = currentUser.role || localStorage.getItem('auth_role');
  const canBrowseAssignedStudents = ['mentor', 'supervisor', 'coordinator', 'admin'].includes(currentRole);

  useEffect(() => {
    setSelectedStudentId(routeStudentId || (currentRole === 'student' ? 'me' : ''));
  }, [currentRole, routeStudentId]);

  useEffect(() => {
    const loadStudents = async () => {
      if (!canBrowseAssignedStudents) return;

      try {
        setStudentListLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${API_BASE_URL}/assessment-forms/reviewer-students`, { headers });
        setAssignedStudents(res.data || []);
        if (!routeStudentId && res.data?.length === 1) {
          setSelectedStudentId(String(res.data[0].id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setStudentListLoading(false);
      }
    };

    loadStudents();
  }, [canBrowseAssignedStudents, routeStudentId, token]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setAccessNotice('');
        const headers = { Authorization: `Bearer ${token}` };
        const targetStudent = selectedStudentId || 'me';

        if (canBrowseAssignedStudents && !selectedStudentId) {
          setStudent(null);
          setFormState(initialFormData);
          return;
        }

        if (targetStudent === 'me') {
          const res = await axios.get(`${API_BASE_URL}/assessment-forms/my-forms`, { headers });
          const studentForm = res.data.find((item) => item.form_type === selectedForm) || null;
          const stored = studentForm?.formData || {};
          const base = { ...initialFormData, ...stored };
          setFormState(base);
          setStudent({ name: 'My Profile' });
        } else {
          const [studentRes, formRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/users/profile/${targetStudent}`, { headers }),
            axios.get(`${API_BASE_URL}/assessment-forms/${targetStudent}/${selectedForm}`, { headers })
          ]);
          const base = { ...initialFormData, ...formRes.data.formData };
          setFormState(base);
          setStudent(studentRes.data);
        }
      } catch (err) {
        console.error(err);
        setAccessNotice(err.response?.data?.error || 'Unable to load the selected assessment form.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedForm, selectedStudentId, token]);

  useEffect(() => {
    setFormState((prev) => ({ ...prev, school: student?.school || prev.school, className: student?.class_name || prev.className, teachingSubject: student?.teaching_subject || prev.teachingSubject, topic: student?.topic || prev.topic, tpDates: student?.tp_start_date && student?.tp_end_date ? `${student.tp_start_date} to ${student.tp_end_date}` : prev.tpDates }));
  }, [student]);

  const currentForm = useMemo(() => FORM_DEFS.find((item) => item.key === selectedForm), [selectedForm]);

  const canSubmit = useMemo(() => {
    if (currentRole === 'mentor') return selectedForm === 'lesson-observation';
    if (currentRole === 'supervisor') return selectedForm === 'test-supervision' || selectedForm === 'document-assessment';
    return false;
  }, [currentRole, selectedForm]);

  const handleSaved = (result) => {
    if (result?.status === 'draft') {
      setMessage('Assessment form saved as draft.');
      return;
    }

    if (result?.message) {
      setMessage(result.message);
      return;
    }

    setMessage('Assessment form updated successfully.');
  };

  const handleStudentSelect = (studentRecord) => {
    setSelectedStudentId(String(studentRecord.id));
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <div className="bg-[#002080] text-white px-6 py-4 flex items-center gap-4 shadow-lg">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg"><FiArrowLeft /></button>
        <div>
          <p className="text-xs text-[#87CEEB]">BUSE TP Assessment Instruments</p>
          <p className="font-bold text-sm">{currentForm?.title}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#001F3F]">Assessment Instrument Workspace</h1>
            <p className="text-sm text-gray-500">Mentors and supervisors complete these forms for their assigned students. Students can only view them once submitted.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {FORM_DEFS.map((form) => (
              <button key={form.key} onClick={() => setSelectedForm(form.key)} className={`px-3 py-2 rounded-xl border text-sm font-semibold ${selectedForm === form.key ? 'bg-[#003399] text-white border-[#003399]' : 'bg-white text-gray-700 border-gray-200'}`}>
                {form.title}
              </button>
            ))}
          </div>
        </div>

        {canBrowseAssignedStudents && (
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-blue-100">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#003399] flex items-center gap-2"><FiUserCheck /> Assigned students</h2>
                <p className="text-sm text-gray-500">Choose a student to open, draft, or publish an assessment form for them.</p>
              </div>
              {studentListLoading && <span className="text-sm text-gray-500">Loading assigned students...</span>}
            </div>
            {assignedStudents.length === 0 ? (
              <p className="text-sm text-gray-500">No assigned students were found for your account.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {assignedStudents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleStudentSelect(item)}
                    className={`px-4 py-2 rounded-xl border text-sm font-semibold transition ${String(item.id) === selectedStudentId ? 'bg-[#003399] text-white border-[#003399]' : 'bg-white text-gray-700 border-gray-200 hover:bg-[#F5F9FF]'}`}
                  >
                    {item.name} <span className="opacity-80">({item.student_id || 'No reg'})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-[#003399]">{currentForm?.title}</h2>
                <p className="text-sm text-gray-500">{currentForm?.description}</p>
              </div>
              <div className="bg-[#EEF4FF] text-[#003399] px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"><FiBookOpen /> {student?.name || 'Student record'}</div>
            </div>

            {loading ? <p className="text-sm text-gray-500">Loading form...</p> : (
              <div className="space-y-4">
                <div className="rounded-xl border border-blue-100 bg-[#F5F9FF] p-3 text-sm text-gray-600">
                  <p className="font-semibold text-[#003399]">Current role: {ROLE_LABELS[currentRole] || 'Viewer'}</p>
                  <p>{canSubmit ? 'You can save this instrument for the assigned student.' : 'This role can view the instrument but cannot submit it.'}</p>
                  {selectedStudentId === '' && canBrowseAssignedStudents && <p className="mt-2 text-amber-700 font-semibold flex items-center gap-2"><FiSend /> Select an assigned student to start working on the form.</p>}
                </div>
                {accessNotice && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{accessNotice}</div>}
                {selectedStudentId ? (
                  <InstrumentViewer formKey={selectedForm} studentId={selectedStudentId || 'me'} isEditable={canSubmit && selectedStudentId !== 'me'} initialData={formState} onSaved={handleSaved} studentData={student} />
                ) : (
                  <div className="rounded-2xl border border-dashed border-blue-200 bg-[#F8FAFF] p-8 text-center text-sm text-gray-500">
                    Choose an assigned student to load the assessment instrument and use the draft/publish buttons.
                  </div>
                )}
                {message && <div className={`p-3 rounded-xl text-sm ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>{message}</div>}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 text-[#003399] font-semibold mb-4"><FiUsers /> Role access</div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="p-3 bg-[#F5F9FF] rounded-xl border border-blue-100"><p className="font-semibold text-[#001F3F]">Mentor</p><p>Fills the lesson observation instrument for their assigned student.</p></div>
              <div className="p-3 bg-[#F5F9FF] rounded-xl border border-blue-100"><p className="font-semibold text-[#001F3F]">Supervisor</p><p>Completes the test supervision and document assessment forms for the assigned student.</p></div>
              <div className="p-3 bg-[#F5F9FF] rounded-xl border border-blue-100"><p className="font-semibold text-[#001F3F]">Student</p><p>Can view submitted forms only and cannot edit marks.</p></div>
              <div className="p-3 bg-[#F5F9FF] rounded-xl border border-blue-100"><p className="font-semibold text-[#001F3F]">Coordinator</p><p>Can review all forms in read-only mode and manage student assignments.</p></div>
            </div>
            <div className="mt-4 border-t pt-4 text-sm text-gray-500">
              <div className="flex items-center gap-2"><FiCheckCircle className="text-green-500" /> Student profile metadata is prefilled when available.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
