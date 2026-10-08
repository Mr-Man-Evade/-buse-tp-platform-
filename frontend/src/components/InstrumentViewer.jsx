import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = '/api';

const INSTRUMENTS = [
  {
    key: 'lesson-observation',
    title: 'Lesson Observation Instrument',
    file: '/ase/instrument1_lesson.html',
    description: 'Mentor assessment of lesson delivery and classroom practice.'
  },
  {
    key: 'document-assessment',
    title: 'Assessment of Documents Instrument',
    file: '/ase/instrument2_documents.html',
    description: 'Supervisor review of teaching documents and planning materials.'
  },
  {
    key: 'test-supervision',
    title: 'Test Supervision and Assessment Instrument',
    file: '/ase/instrument3_test_supervision.html',
    description: 'Supervisor assessment of test construction, supervision and marking.'
  }
];

export default function InstrumentViewer({ formKey, studentId, isEditable, onSaved, initialData, studentData }) {
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const [formPayload, setFormPayload] = useState(initialData || {});
  const token = localStorage.getItem('auth_token');

  const instrument = useMemo(() => INSTRUMENTS.find((item) => item.key === formKey) || INSTRUMENTS[0], [formKey]);

  useEffect(() => {
    setFormPayload(initialData || {});
    setMessage('');
  }, [initialData, formKey]);

  const loadInstrument = useCallback(() => {
    if (!instrument?.file) return;
    setLoaded(false);
    const iframe = document.getElementById(`instrument-frame-${instrument.key}`);
    if (iframe) {
      iframe.onload = () => setLoaded(true);
      iframe.src = instrument.file;
    }
  }, [instrument]);

  useEffect(() => {
    loadInstrument();
  }, [loadInstrument]);

  // Send student prefill data to iframe whenever student changes or iframe loads
  useEffect(() => {
    if (!loaded || !studentData) return;
    const iframe = document.getElementById(`instrument-frame-${instrument.key}`);
    if (!iframe?.contentWindow) return;
    const today = new Date().toISOString().split('T')[0];
    // Format dates: backend may return ISO datetime strings — keep only YYYY-MM-DD
    const fmt = (v) => (v ? String(v).split('T')[0] : '');
    iframe.contentWindow.postMessage({
      type: 'prefill-student',
      payload: {
        fullName: `${studentData.first_name || ''} ${studentData.last_name || ''}`.trim(),
        regNumber: studentData.student_id || '',
        regType: studentData.reg_type || 'CONV',
        programme: studentData.program || studentData.level || 'BScEd',
        school: studentData.school || '',
        className: studentData.class_name || '',
        today,
        tpFrom: fmt(studentData.tp_start_date),
        tpTo: fmt(studentData.tp_end_date),
        topic: studentData.topic || '',
        subject: studentData.teaching_subject || '',
      }
    }, '*');
  }, [loaded, studentData, instrument.key]);

  const handleSave = useCallback(async (status = 'submitted') => {
    if (!isEditable) {
      setMessage('Only mentor and supervisor roles can submit this instrument.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const targetStudent = studentId && studentId !== 'me' ? studentId : 'me';
      if (targetStudent === 'me') {
        throw new Error('Open a student-specific form to submit it.');
      }
      const payload = {
        formData: {
          ...formPayload,
          instrumentKey: instrument.key,
          submittedAt: new Date().toISOString()
        },
        status
      };
      const res = await axios.post(`${API_BASE_URL}/assessment-forms/${targetStudent}/${instrument.key}`, payload, { headers });
      setMessage(res.data.message || 'Assessment form saved.');
      onSaved?.(res.data);
    } catch (err) {
      setMessage(err.response?.data?.error || err.message || 'Unable to save the instrument.');
    } finally {
      setSaving(false);
    }
  }, [formPayload, instrument.key, isEditable, onSaved, studentId, token]);

  const handleDelete = useCallback(async () => {
    if (!isEditable) {
      setMessage('Only mentor and supervisor roles can delete this instrument draft.');
      return;
    }

    if (!window.confirm('Delete this assessment form? This cannot be undone.')) {
      return;
    }

    setDeleting(true);
    setMessage('');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const targetStudent = studentId && studentId !== 'me' ? studentId : 'me';
      if (targetStudent === 'me') {
        throw new Error('Open a student-specific form to delete it.');
      }
      const res = await axios.delete(`${API_BASE_URL}/assessment-forms/${targetStudent}/${instrument.key}`, { headers });
      setMessage(res.data.message || 'Assessment form deleted.');
      onSaved?.(res.data);
    } catch (err) {
      setMessage(err.response?.data?.error || err.message || 'Unable to delete the instrument.');
    } finally {
      setDeleting(false);
    }
  }, [instrument.key, isEditable, onSaved, studentId, token]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.data || typeof event.data !== 'object') return;

      if (event.data.type === 'instrument-save-request') {
        handleSave();
        return;
      }

      if (event.data.type === 'instrument-data' && event.data.payload) {
        setFormPayload((prev) => ({ ...prev, ...event.data.payload }));
        return;
      }

      if ('score' in event.data) {
        setFormPayload((prev) => ({ ...prev, score: event.data.score }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleSave]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-[#F5F9FF] p-4 text-sm text-gray-600">
        <p className="font-semibold text-[#003399]">{instrument.title}</p>
        <p>{instrument.description}</p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-3">
        {!loaded && <p className="text-sm text-gray-500">Loading instrument preview...</p>}
        <iframe id={`instrument-frame-${instrument.key}`} title={instrument.title} className="w-full min-h-[900px] rounded-xl border border-gray-200" src={instrument.file} />
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleSave('draft')} disabled={saving || deleting || !isEditable} className="rounded-xl border border-[#003399] px-4 py-2 text-sm font-semibold text-[#003399] disabled:opacity-60">
            {saving ? 'Saving draft...' : 'Save draft'}
          </button>
          <button onClick={() => handleSave('submitted')} disabled={saving || deleting || !isEditable} className="rounded-xl bg-[#003399] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? 'Publishing...' : 'Publish to student'}
          </button>
          <button onClick={handleDelete} disabled={saving || deleting || !isEditable} className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-60">
            {deleting ? 'Deleting...' : 'Delete draft'}
          </button>
        </div>
        <span className="text-sm text-gray-500">{message}</span>
      </div>
    </div>
  );
}
