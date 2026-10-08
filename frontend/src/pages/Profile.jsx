import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiHome, FiLock, FiCamera, FiSave, FiArrowLeft, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle, FiBook } from 'react-icons/fi';
import axios from 'axios';

const API_BASE_URL = '/api';
const ROLE_LABELS = { student: 'Student Teacher', mentor: 'Mentor', supervisor: 'Lecturer Supervisor', coordinator: 'TP Coordinator', admin: 'System Administrator' };

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem('auth_token');
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', school: '', title: '', program: '', level: '', className: '', teachingSubject: '', topic: '', tpStartDate: '', tpEndDate: '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState({ text: '', ok: true });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState({ text: '', ok: true });
  const [picUploading, setPicUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } });
      setProfile(res.data);
      setForm({ firstName: res.data.first_name, lastName: res.data.last_name, phone: res.data.phone || '', school: res.data.school || '', title: res.data.title || '', program: res.data.program || '', level: res.data.level || '', className: res.data.class_name || '', teachingSubject: res.data.teaching_subject || '', topic: res.data.topic || '', tpStartDate: res.data.tp_start_date || '', tpEndDate: res.data.tp_end_date || '' });
    } catch (err) { console.error(err); }
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setSaveMsg({ text: '', ok: true });
    try {
      await axios.put(`${API_BASE_URL}/auth/profile`, form, { headers: { Authorization: `Bearer ${token}` } });
      const stored = JSON.parse(localStorage.getItem('auth_user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, firstName: form.firstName, lastName: form.lastName }));
      setSaveMsg({ text: 'Profile updated!', ok: true }); fetchProfile();
    } catch (err) { setSaveMsg({ text: err.response?.data?.error || 'Update failed', ok: false }); }
    finally { setSaving(false); }
  };

  const handleChangePw = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwMsg({ text: 'Passwords do not match', ok: false }); return; }
    if (pwForm.newPassword.length < 6) { setPwMsg({ text: 'Minimum 6 characters', ok: false }); return; }
    setPwSaving(true); setPwMsg({ text: '', ok: true });
    try {
      await axios.post(`${API_BASE_URL}/auth/change-password`, { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }, { headers: { Authorization: `Bearer ${token}` } });
      setPwMsg({ text: 'Password changed successfully!', ok: true });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { setPwMsg({ text: err.response?.data?.error || 'Failed', ok: false }); }
    finally { setPwSaving(false); }
  };

  const handlePicUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setPicUploading(true);
    const fd = new FormData(); fd.append('picture', file);
    try {
      const res = await axios.post(`${API_BASE_URL}/users/profile-picture`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      const stored = JSON.parse(localStorage.getItem('auth_user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, profilePicture: res.data.profilePicture }));
      fetchProfile();
    } catch (err) { alert(err.response?.data?.error || 'Upload failed'); }
    finally { setPicUploading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      <div className="bg-[#002080] text-white px-6 py-4 flex items-center gap-4 shadow-lg">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg"><FiArrowLeft /></button>
        <img src="/buse-logo.png" alt="" className="w-8 h-8 object-contain" onError={e => { e.target.style.display = 'none'; }} />
        <div><p className="text-xs text-[#87CEEB]">BUSE TP Portal</p><p className="font-bold text-sm">My Profile</p></div>
      </div>
      <div className="max-w-2xl mx-auto p-6 space-y-5">
        {/* Avatar */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full bg-[#003399] text-white flex items-center justify-center text-2xl font-bold overflow-hidden">
              {profile?.profile_picture ? <img src={`/${profile.profile_picture}`} alt="" className="w-full h-full object-cover" /> : `${profile?.first_name?.[0] || ''}${profile?.last_name?.[0] || ''}`}
            </div>
            <button onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-[#001F3F] shadow hover:scale-110 transition">
              {picUploading ? <div className="w-3 h-3 border-2 border-[#001F3F] border-t-transparent rounded-full animate-spin" /> : <FiCamera className="text-sm" />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePicUpload} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#001F3F]">{profile?.first_name} {profile?.last_name}</h2>
            <p className="text-[#003399] font-semibold text-sm">{ROLE_LABELS[profile?.role] || profile?.role}</p>
            <p className="text-gray-500 text-sm">{profile?.email}</p>
            {profile?.role === 'student' && profile?.student_id && (
              <p className="text-[#003399] font-bold text-sm mt-2 bg-[#F0F4FF] px-3 py-1 rounded-lg inline-block">
                📋 Reg #: {profile.student_id}
              </p>
            )}
            {profile?.school && <p className="text-gray-400 text-xs mt-2">🏫 {profile.school}</p>}
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-[#003399] mb-4 flex items-center gap-2"><FiUser /> Edit Profile</h3>
          
          {profile?.role === 'student' && profile?.student_id && (
            <div className="mb-4 p-4 bg-[#F0F4FF] border-2 border-[#003399] rounded-xl">
              <p className="text-xs text-gray-600 uppercase tracking-wide">Your Registration Number</p>
              <p className="text-2xl font-bold text-[#003399]">{profile.student_id}</p>
            </div>
          )}
          
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{ label: 'First Name', key: 'firstName', icon: FiUser, req: true }, { label: 'Last Name', key: 'lastName', icon: FiUser, req: true }, { label: 'Title', key: 'title', icon: FiUser }, { label: 'Phone', key: 'phone', icon: FiPhone }, { label: 'Programme', key: 'program', icon: FiBook }, { label: 'Level', key: 'level', icon: FiBook }, { label: 'School', key: 'school', icon: FiHome }].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
                <div className="relative">
                  <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input type="text" value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required={f.req}
                    className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]" />
                </div>
              </div>
            ))}
            {profile?.role === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Class / Grade</label>
                  <input type="text" value={form.className} onChange={e => setForm(p => ({ ...p, className: e.target.value }))} className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teaching Subject</label>
                  <input type="text" value={form.teachingSubject} onChange={e => setForm(p => ({ ...p, teachingSubject: e.target.value }))} className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">TP Topic</label>
                  <input type="text" value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">TP Start Date</label>
                  <input type="date" value={form.tpStartDate} onChange={e => setForm(p => ({ ...p, tpStartDate: e.target.value }))} className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">TP End Date</label>
                  <input type="date" value={form.tpEndDate} onChange={e => setForm(p => ({ ...p, tpEndDate: e.target.value }))} className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]" />
                </div>
              </>
            )}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email (cannot change)</label>
              <div className="relative"><FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" /><input type="email" value={profile?.email || ''} disabled className="w-full border border-gray-100 bg-gray-50 rounded-xl py-2.5 pl-9 pr-3 text-sm text-gray-400 cursor-not-allowed" /></div>
            </div>
            {saveMsg.text && <div className={`sm:col-span-2 p-3 rounded-xl text-sm flex items-center gap-2 ${saveMsg.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{saveMsg.ok ? <FiCheckCircle /> : <FiAlertCircle />} {saveMsg.text}</div>}
            <div className="sm:col-span-2"><button type="submit" disabled={saving} className="w-full bg-[#003399] hover:bg-[#001F3F] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2"><FiSave />{saving ? 'Saving...' : 'Save Changes'}</button></div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-[#003399] mb-4 flex items-center gap-2"><FiLock /> Change Password</h3>
          <form onSubmit={handleChangePw} className="space-y-4">
            {[{ label: 'Current Password', key: 'currentPassword', show: 'current' }, { label: 'New Password', key: 'newPassword', show: 'newPw' }, { label: 'Confirm New Password', key: 'confirmPassword', show: 'confirm' }].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPw[f.show] ? 'text' : 'password'} value={pwForm[f.key]} onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]" required />
                  <button type="button" onClick={() => setShowPw(p => ({ ...p, [f.show]: !p[f.show] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#003399]">
                    {showPw[f.show] ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            ))}
            {pwMsg.text && <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${pwMsg.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{pwMsg.ok ? <FiCheckCircle /> : <FiAlertCircle />} {pwMsg.text}</div>}
            <button type="submit" disabled={pwSaving} className="w-full bg-[#003399] hover:bg-[#001F3F] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm">{pwSaving ? 'Changing...' : 'Change Password'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
