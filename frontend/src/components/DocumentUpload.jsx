import React, { useState } from 'react';
import { FiUpload, FiX, FiBookOpen, FiFileText } from 'react-icons/fi';
import axios from 'axios';

const API_BASE_URL = '/api';
const REQUIREMENT_OPTIONS = [
  { value: 'return-slip', label: 'Return Slip' },
  { value: 'scheme-of-work', label: 'Scheme of Work' },
  { value: 'daily-lesson-plan', label: 'Daily Lesson Plan (DLP)' },
  { value: 'evidence', label: 'Evidence / Assessment File' },
  { value: 'reflection', label: 'Teaching Practice Reflection' }
];

export default function DocumentUpload({ onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: 'return-slip', description: '', dueDate: '' });
  const token = localStorage.getItem('auth_token');
  const user = JSON.parse(localStorage.getItem('auth_user') || '{}');

  const handleFileSelect = (e) => setFiles(Array.from(e.target.files));

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = (index) => setFiles(files.filter((_, i) => i !== index));

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select files to upload');
      return;
    }
    if (!formData.title.trim()) {
      alert('Please add a short title for this submission');
      return;
    }

    setUploading(true);
    const payload = new FormData();
    files.forEach((file) => payload.append('files', file));
    payload.append('title', formData.title);
    payload.append('category', formData.category);
    payload.append('description', formData.description);
    payload.append('submissionType', formData.category);
    payload.append('dueDate', formData.dueDate);
    payload.append('studentRegNumber', user.studentId || '');
    payload.append('program', user.program || '');
    payload.append('level', user.level || '');

    try {
      await axios.post(`${API_BASE_URL}/documents/upload`, payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert('Submission uploaded successfully.');
      setFiles([]);
      setFormData({ title: '', category: 'return-slip', description: '', dueDate: '' });
      onUploadSuccess?.();
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 border border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <FiUpload className="text-[#003399]" />
        <h2 className="text-xl font-bold text-[#003399]">Submit BUSE Teaching Practice Files</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">Use this form for the required student submissions such as return slips, schemes of work, DLPs, evidence, and reflections.</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Submission title</label>
          <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]" placeholder="Example: Week 3 DLP" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Submission category</label>
          <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]">
            {REQUIREMENT_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Brief description</label>
        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]" placeholder="Describe what you are submitting and any supporting notes." />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Target date</label>
        <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]" />
      </div>

      <div onDrop={handleDrop} onDragOver={handleDragOver} className="mt-4 border-2 border-dashed border-[#87CEEB] rounded-2xl p-6 text-center cursor-pointer hover:border-[#003399] hover:bg-blue-50 transition">
        <input type="file" multiple accept=".doc,.docx,.pdf,.xlsx,.xls,.mp4,.jpg,.jpeg,.png" onChange={handleFileSelect} className="hidden" id="fileInput" />
        <label htmlFor="fileInput" className="cursor-pointer">
          <p className="text-lg font-semibold text-[#003399]">📁 Drag and drop files here</p>
          <p className="text-sm text-gray-500 mt-2">Supported: Word, PDF, Excel, Video, JPG/PNG</p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#003399] mb-2"><FiFileText /> Selected files ({files.length})</div>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex justify-between items-center bg-[#F5F9FF] border border-blue-100 rounded-xl p-3">
                <div>
                  <p className="text-sm font-semibold text-[#001F3F]">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => removeFile(index)} className="text-red-500"><FiX size={18} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 rounded-2xl bg-[#EEF4FF] border border-[#DCE9FF] p-4 text-sm text-[#003399] flex items-start gap-2">
        <FiBookOpen className="mt-0.5" />
        <span>BUSE expects this submission to be linked to the correct category so supervisors can review it efficiently and grade it against the handbook.</span>
      </div>

      <button onClick={handleUpload} disabled={uploading} className="w-full mt-5 bg-[#003399] hover:bg-[#001F3F] text-white py-3 rounded-xl font-semibold disabled:opacity-60">
        {uploading ? 'Uploading...' : 'Upload submission'}
      </button>
    </div>
  );
}
