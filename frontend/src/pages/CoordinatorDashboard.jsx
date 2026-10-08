import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiLogOut, FiUsers, FiUserPlus, FiSearch, FiCheckCircle, FiXCircle, FiKey, FiEye, FiEyeOff, FiToggleLeft, FiToggleRight, FiHome, FiBell, FiSettings, FiTrash2, FiLink, FiCopy, FiRefreshCw, FiX, FiBookOpen, FiAlertTriangle } from 'react-icons/fi';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = '/api';
const RC = { student:'bg-blue-100 text-blue-700', mentor:'bg-purple-100 text-purple-700', supervisor:'bg-green-100 text-green-700', coordinator:'bg-orange-100 text-orange-700', admin:'bg-red-100 text-red-700' };
const IC = 'w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]';

export default function CoordinatorDashboard() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const H = { Authorization: `Bearer ${token}` };

  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [fu, setFu] = useState([]);
  const [q, setQ] = useState('');
  const [rf, setRf] = useState('all');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const [reg, setReg] = useState({ firstName:'', lastName:'', email:'', password:'', role:'student', studentId:'', phone:'', school:'' });
  const [regL, setRegL] = useState(false);
  const [regErr, setRegErr] = useState('');
  const [regOk, setRegOk] = useState('');

  const [resetT, setResetT] = useState(null);
  const [resetP, setResetP] = useState('');
  const [showRP, setShowRP] = useState(false);
  const [resetL, setResetL] = useState(false);

  const [assigns, setAssigns] = useState([]);
  const [af, setAf] = useState({ studentId:'', mentorId:'', supervisorId:'', school:'' });
  const [aL, setAL] = useState(false);
  const [aMsg, setAMsg] = useState('');
  const [mentors, setMentors] = useState([]);
  const [supers, setSupers] = useState([]);
  const [studs, setStuds] = useState([]);

  const [anns, setAnns] = useState([]);
  const [annF, setAnnF] = useState({ title:'', message:'', targetRole:'all' });
  const [annL, setAnnL] = useState(false);
  const [annMsg, setAnnMsg] = useState('');

  const [settings, setSettings] = useState({});
  const [tokens, setTokens] = useState([]);
  const [tRole, setTRole] = useState('student');
  const [tL, setTL] = useState(false);
  const [newTok, setNewTok] = useState(null);

  useEffect(() => { load(); }, []);
  useEffect(() => {
    let r = users;
    if (q.trim()) { const lq = q.toLowerCase(); r = r.filter(u => `${u.first_name} ${u.last_name} ${u.email} ${u.student_id||''}`.toLowerCase().includes(lq)); }
    if (rf !== 'all') r = r.filter(u => u.role === rf);
    setFu(r);
  }, [q, rf, users]);
  useEffect(() => {
    if (tab === 'assignments') loadAssigns();
    if (tab === 'announcements') loadAnns();
    if (tab === 'settings' && isAdmin) loadSettings();
  }, [tab]);

  const load = async () => {
    try {
      const [s, u] = await Promise.all([axios.get(`${API_BASE_URL}/reports/stats`, {headers:H}), axios.get(`${API_BASE_URL}/users`, {headers:H})]);
      setStats(s.data); setUsers(u.data); setFu(u.data);
      setMentors(u.data.filter(x => x.role==='mentor'));
      setSupers(u.data.filter(x => x.role==='supervisor'));
      setStuds(u.data.filter(x => x.role==='student'));
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };
  const loadAssigns = async () => { try { const r = await axios.get(`${API_BASE_URL}/assignments`,{headers:H}); setAssigns(r.data); } catch(e){} };
  const loadAnns = async () => { try { const r = await axios.get(`${API_BASE_URL}/announcements`,{headers:H}); setAnns(r.data); } catch(e){} };
  const loadSettings = async () => {
    try {
      const [s,t] = await Promise.all([axios.get(`${API_BASE_URL}/settings`,{headers:H}), axios.get(`${API_BASE_URL}/tokens`,{headers:H})]);
      setSettings(s.data); setTokens(t.data);
    } catch(e){}
  };

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const doRegister = async (e) => {
    e.preventDefault(); setRegL(true); setRegErr(''); setRegOk('');
    try { await axios.post(`${API_BASE_URL}/auth/register`, reg, {headers:H}); setRegOk(`✓ ${reg.firstName} ${reg.lastName} registered!`); setReg({ firstName:'', lastName:'', email:'', password:'', role:'student', studentId:'', phone:'', school:'' }); load(); }
    catch(err) { setRegErr(err.response?.data?.error || 'Failed'); } finally { setRegL(false); }
  };

  const doToggleActive = async (u) => {
    try { const r = await axios.patch(`${API_BASE_URL}/users/${u.id}/toggle-active`,{},{headers:H}); setUsers(prev => prev.map(x => x.id===u.id ? {...x, is_active:r.data.is_active} : x)); flash(`${u.first_name} ${r.data.is_active?'activated':'deactivated'}`); }
    catch(err) { alert(err.response?.data?.error||'Failed'); }
  };

  const doResetPw = async () => {
    if (!resetP || resetP.length<6) { alert('Min 6 chars'); return; }
    setResetL(true);
    try { await axios.post(`${API_BASE_URL}/users/${resetT.id}/reset-password`,{newPassword:resetP},{headers:H}); flash(`Password reset for ${resetT.first_name}`); setResetT(null); setResetP(''); }
    catch(err) { alert(err.response?.data?.error||'Failed'); } finally { setResetL(false); }
  };

  const doAssign = async (e) => {
    e.preventDefault(); setAL(true); setAMsg('');
    try { await axios.post(`${API_BASE_URL}/assignments`, af, {headers:H}); setAMsg('✓ Assignment saved!'); setAf({ studentId:'', mentorId:'', supervisorId:'', school:'' }); loadAssigns(); }
    catch(err) { setAMsg('✗ '+(err.response?.data?.error||'Failed')); } finally { setAL(false); }
  };

  const delAssign = async (id) => { if(!window.confirm('Remove?')) return; try { await axios.delete(`${API_BASE_URL}/assignments/${id}`,{headers:H}); setAssigns(p=>p.filter(a=>a.id!==id)); } catch{} };

  const doAnn = async (e) => {
    e.preventDefault(); setAnnL(true); setAnnMsg('');
    try { await axios.post(`${API_BASE_URL}/announcements`, annF, {headers:H}); setAnnMsg('✓ Announcement sent!'); setAnnF({title:'',message:'',targetRole:'all'}); loadAnns(); }
    catch(err) { setAnnMsg('✗ '+(err.response?.data?.error||'Failed')); } finally { setAnnL(false); }
  };

  const delAnn = async (id) => { try { await axios.delete(`${API_BASE_URL}/announcements/${id}`,{headers:H}); setAnns(p=>p.filter(a=>a.id!==id)); } catch{} };

  const doToggleSetting = async (key, val) => {
    const nv = val==='1' ? '0' : '1';
    try { await axios.put(`${API_BASE_URL}/settings/${key}`,{value:nv},{headers:H}); setSettings(p=>({...p,[key]:nv})); flash(`Self-registration ${nv==='1'?'ENABLED':'DISABLED'}`); } catch{}
  };

  const doGenToken = async () => {
    setTL(true); setNewTok(null);
    try { const r = await axios.post(`${API_BASE_URL}/tokens/generate`,{role:tRole,expiresInHours:48},{headers:H}); setNewTok(r.data); loadSettings(); }
    catch(err) { alert(err.response?.data?.error||'Failed'); } finally { setTL(false); }
  };

  const delToken = async (id) => { try { await axios.delete(`${API_BASE_URL}/tokens/${id}`,{headers:H}); setTokens(p=>p.filter(t=>t.id!==id)); } catch{} };
  const copy = (t) => { navigator.clipboard.writeText(t).then(()=>flash(`Token ${t} copied!`)); };

  const doDeleteUser = async (u) => {
    const msg = u.role === 'supervisor'
      ? `Delete supervisor ${u.first_name} ${u.last_name}? ${!isAdmin ? '⚠ Only admin can delete supervisors with assigned students.' : 'This will also remove all their student assignments.'}`
      : `Delete ${u.role} ${u.first_name} ${u.last_name}? This cannot be undone.`;
    if (!window.confirm(msg)) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/${u.id}`, {headers:H});
      setUsers(prev => prev.filter(x => x.id !== u.id));
      flash(`${u.first_name} ${u.last_name} deleted`);
    } catch(err) { alert(err.response?.data?.error || 'Delete failed'); }
  };

  const byRole = { Students:users.filter(u=>u.role==='student').length, Mentors:users.filter(u=>u.role==='mentor').length, Supervisors:users.filter(u=>u.role==='supervisor').length, Coordinators:users.filter(u=>u.role==='coordinator').length };

  const TABS = [
    {id:'overview',label:'Overview',icon:FiHome},
    {id:'users',label:`Users (${users.length})`,icon:FiUsers},
    {id:'assignments',label:'Assignments',icon:FiLink},
    {id:'announcements',label:'Announcements',icon:FiBell},
    {id:'register',label:'Register User',icon:FiUserPlus},
    ...(isAdmin ? [{id:'settings',label:'Settings',icon:FiSettings}] : []),
  ];

  return (
    <div className="flex min-h-screen bg-[#F5F9FF]">
      <Sidebar role={user.role||'coordinator'} onLogout={logout} />
      <main className="flex-1 p-5 overflow-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div><h1 className="text-2xl font-bold text-[#003399]">{isAdmin?'Admin':'Coordinator'} Dashboard</h1><p className="text-gray-500 text-sm">Welcome, {user.firstName} {user.lastName}</p></div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/coordinator/forms')} className="flex items-center gap-2 bg-[#003399] hover:bg-[#001F3F] text-white px-3 py-2 rounded-lg text-sm font-semibold">
              <FiBookOpen /> Forms
            </button>
            <Link to="/profile" className="w-9 h-9 rounded-full bg-[#003399] text-white font-bold text-sm flex items-center justify-center overflow-hidden">
              {user.profilePicture ? <img src={`/${user.profilePicture}`} className="w-full h-full object-cover" alt="" /> : `${user.firstName?.[0]||''}${user.lastName?.[0]||''}`}
            </Link>
            <button onClick={logout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold"><FiLogOut/> Logout</button>
          </div>
        </div>

        {msg && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2"><FiCheckCircle/> {msg}</div>}

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl shadow p-1 mb-5 flex-wrap">
          {TABS.map(t => { const I=t.icon; return <button key={t.id} onClick={()=>setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${tab===t.id?'bg-[#003399] text-white shadow':'text-gray-600 hover:bg-gray-100'}`}><I/> {t.label}</button>; })}
        </div>

        {/* OVERVIEW */}
        {tab==='overview' && stats && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[{l:'Total Users',v:stats.totalUsers,c:'from-[#003399] to-[#001F3F]'},{l:'Total Docs',v:stats.totalDocuments,c:'from-[#87CEEB] to-sky-400'},{l:'Pending',v:stats.pendingDocuments,c:'from-yellow-400 to-amber-400'},{l:'Approved',v:stats.approvedDocuments,c:'from-green-400 to-emerald-500'},{l:'Rejected',v:stats.rejectedDocuments,c:'from-red-400 to-rose-500'}].map(c=>(
                <div key={c.l} className={`bg-gradient-to-br ${c.c} rounded-xl p-4 text-white shadow`}><p className="text-xs opacity-80 mb-1">{c.l}</p><p className="text-3xl font-bold">{c.v||0}</p></div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="font-bold text-[#003399] mb-4 text-sm">Users by Role</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(byRole).map(([r,c])=>(
                  <div key={r} className="flex justify-between items-center p-3 bg-[#F5F9FF] rounded-lg"><span className="font-medium text-gray-700 text-sm">{r}</span><span className="text-xl font-bold text-[#003399]">{c}</span></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab==='users' && (
          <div className="bg-white rounded-xl shadow">
            <div className="p-4 border-b flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-48"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="text" placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} className="w-full border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]"/></div>
              <select value={rf} onChange={e=>setRf(e.target.value)} className="border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none">
                <option value="all">All Roles</option><option value="student">Students</option><option value="mentor">Mentors</option><option value="supervisor">Supervisors</option><option value="coordinator">Coordinators</option>
              </select>
              <span className="text-sm text-gray-500">{fu.length} users</span>
            </div>
            {loading ? <div className="p-8 text-center text-gray-400">Loading...</div> : fu.length===0 ? <div className="p-8 text-center text-gray-400">No users found</div> : (
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {fu.map(u=>(
                  <div key={u.id} className="p-4 hover:bg-gray-50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#003399] text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                      {u.profile_picture?<img src={`/${u.profile_picture}`} alt="" className="w-full h-full object-cover"/>:`${u.first_name?.[0]}${u.last_name?.[0]}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-[#001F3F] text-sm">{u.first_name} {u.last_name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RC[u.role]}`}>{u.role}</span>
                        {!u.is_active && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">Inactive</span>}
                      </div>
                      <p className="text-xs text-gray-500">{u.email}{u.student_id?` · ${u.student_id}`:''}{u.school?` · 🏫 ${u.school}`:''}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={()=>doToggleActive(u)} title={u.is_active?'Deactivate':'Activate'} className={`p-1.5 rounded-lg transition ${u.is_active?'text-green-500 hover:bg-green-50':'text-gray-400 hover:bg-gray-100'}`}>{u.is_active?<FiToggleRight className="text-xl"/>:<FiToggleLeft className="text-xl"/>}</button>
                      <button onClick={()=>{setResetT(u);setResetP('');setShowRP(false);}} title="Reset Password" className="p-1.5 text-[#87CEEB] hover:text-[#003399] hover:bg-blue-50 rounded-lg"><FiKey/></button>
                      {u.role !== 'admin' && (
                        <button
                          onClick={()=>doDeleteUser(u)}
                          title={u.role==='supervisor' && !isAdmin ? 'Only admin can delete supervisors with assigned students' : 'Delete user'}
                          className={`p-1.5 rounded-lg transition ${u.role==='supervisor' && !isAdmin ? 'text-gray-300 cursor-not-allowed' : 'text-red-400 hover:text-red-600 hover:bg-red-50'}`}
                          disabled={u.role==='supervisor' && !isAdmin}
                        ><FiTrash2/></button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ASSIGNMENTS */}
        {tab==='assignments' && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="font-bold text-[#003399] mb-4 flex items-center gap-2 text-sm"><FiLink/> Assign Student to Mentor / Supervisor</h2>
              <form onSubmit={doAssign} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Student *</label>
                  <select value={af.studentId} onChange={e=>setAf(p=>({...p,studentId:e.target.value}))} className={IC} required>
                    <option value="">-- Select Student --</option>
                    {studs.map(s=><option key={s.id} value={s.id}>{s.first_name} {s.last_name}{s.student_id?` (${s.student_id})`:''}</option>)}
                  </select></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Mentor</label>
                  <select value={af.mentorId} onChange={e=>setAf(p=>({...p,mentorId:e.target.value}))} className={IC}>
                    <option value="">-- No Mentor --</option>
                    {mentors.map(m=><option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}
                  </select></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Supervisor</label>
                  <select value={af.supervisorId} onChange={e=>setAf(p=>({...p,supervisorId:e.target.value}))} className={IC}>
                    <option value="">-- No Supervisor --</option>
                    {supers.map(s=><option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                  </select></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">School</label>
                  <input type="text" value={af.school} onChange={e=>setAf(p=>({...p,school:e.target.value}))} placeholder="Teaching school name" className={IC}/></div>
                {aMsg && <div className={`md:col-span-2 p-3 rounded-xl text-sm ${aMsg.startsWith('✓')?'bg-green-50 text-green-700':'bg-red-50 text-red-700'}`}>{aMsg}</div>}
                <div className="md:col-span-2"><button type="submit" disabled={aL} className="w-full bg-[#003399] hover:bg-[#001F3F] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm">{aL?'Saving...':'Save Assignment'}</button></div>
              </form>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <h2 className="font-bold text-[#003399] text-sm">Current Assignments ({assigns.length})</h2>
                <button onClick={loadAssigns} className="text-gray-400 hover:text-[#003399] p-1"><FiRefreshCw className="text-sm"/></button>
              </div>
              {assigns.length===0 ? <div className="p-8 text-center text-gray-400 text-sm">No assignments yet.</div> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                      <tr><th className="text-left px-4 py-3">Student</th><th className="text-left px-4 py-3">Mentor</th><th className="text-left px-4 py-3">Supervisor</th><th className="text-left px-4 py-3">School</th><th className="px-4 py-3"></th></tr>
                    </thead>
                    <tbody className="divide-y">
                      {assigns.map(a=>(
                        <tr key={a.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3"><p className="font-semibold text-[#001F3F]">{a.student_name}</p><p className="text-xs text-gray-400">{a.student_email}</p></td>
                          <td className="px-4 py-3 text-sm">{a.mentor_name||<span className="text-gray-300 italic text-xs">None</span>}</td>
                          <td className="px-4 py-3 text-sm">{a.supervisor_name||<span className="text-gray-300 italic text-xs">None</span>}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{a.school||'—'}</td>
                          <td className="px-4 py-3"><button onClick={()=>delAssign(a.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2/></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS */}
        {tab==='announcements' && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="font-bold text-[#003399] mb-4 flex items-center gap-2 text-sm"><FiBell/> Send Announcement</h2>
              <form onSubmit={doAnn} className="space-y-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label><input type="text" value={annF.title} onChange={e=>setAnnF(p=>({...p,title:e.target.value}))} placeholder="Announcement title" className={IC} required/></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Message *</label><textarea value={annF.message} onChange={e=>setAnnF(p=>({...p,message:e.target.value}))} rows={4} placeholder="Write announcement..." className={IC} required/></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Send To</label>
                  <select value={annF.targetRole} onChange={e=>setAnnF(p=>({...p,targetRole:e.target.value}))} className={IC}>
                    <option value="all">Everyone</option><option value="student">Students Only</option><option value="mentor">Mentors Only</option><option value="supervisor">Supervisors Only</option>
                  </select></div>
                {annMsg && <div className={`p-3 rounded-xl text-sm ${annMsg.startsWith('✓')?'bg-green-50 text-green-700':'bg-red-50 text-red-700'}`}>{annMsg}</div>}
                <button type="submit" disabled={annL} className="w-full bg-[#003399] hover:bg-[#001F3F] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm">{annL?'Sending...':'📢 Send Announcement'}</button>
              </form>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <h2 className="font-bold text-[#003399] text-sm">Sent ({anns.length})</h2>
                <button onClick={loadAnns} className="text-gray-400 hover:text-[#003399] p-1"><FiRefreshCw className="text-sm"/></button>
              </div>
              {anns.length===0 ? <div className="p-8 text-center text-gray-400 text-sm">No announcements yet.</div> : (
                <div className="divide-y max-h-96 overflow-y-auto">
                  {anns.map(a=>(
                    <div key={a.id} className="p-4 flex items-start gap-3 hover:bg-gray-50">
                      <div className="flex-1"><div className="flex items-center gap-2 mb-1"><p className="font-semibold text-[#001F3F] text-sm">{a.title}</p><span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">→ {a.target_role}</span></div><p className="text-xs text-gray-600">{a.message}</p><p className="text-xs text-gray-400 mt-1">{new Date(a.created_at).toLocaleString()}</p></div>
                      <button onClick={()=>delAnn(a.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"><FiTrash2/></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* REGISTER */}
        {tab==='register' && (
          <div className="bg-white rounded-xl shadow p-6 max-w-2xl">
            <h2 className="font-bold text-[#003399] mb-5 flex items-center gap-2 text-sm"><FiUserPlus/> Register New User</h2>
            {regOk && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm flex items-center gap-2"><FiCheckCircle/> {regOk}</div>}
            {regErr && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm flex items-center gap-2"><FiXCircle/> {regErr}</div>}
            <form onSubmit={doRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[{l:'First Name',k:'firstName',t:'text',r:true},{l:'Last Name',k:'lastName',t:'text',r:true},{l:'Email',k:'email',t:'email',r:true},{l:'Temporary Password',k:'password',t:'password',r:true},{l:'Student ID (optional)',k:'studentId',t:'text'},{l:'Phone',k:'phone',t:'tel'},{l:'School',k:'school',t:'text'}].map(f=>(
                <div key={f.k}><label className="block text-sm font-semibold text-gray-700 mb-1">{f.l}</label><input type={f.t} value={reg[f.k]} onChange={e=>setReg(p=>({...p,[f.k]:e.target.value}))} required={f.r} className={IC} placeholder={f.l}/></div>
              ))}
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Role *</label>
                <select value={reg.role} onChange={e=>setReg(p=>({...p,role:e.target.value}))} className={IC} required>
                  <option value="student">Student Teacher</option><option value="mentor">Mentor</option><option value="supervisor">Supervisor</option>
                  {isAdmin && <option value="coordinator">TP Coordinator</option>}
                </select></div>
              <div className="md:col-span-2"><button type="submit" disabled={regL} className="w-full bg-[#003399] hover:bg-[#001F3F] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2"><FiUserPlus/> {regL?'Registering...':'Register User'}</button></div>
            </form>
          </div>
        )}

        {/* SETTINGS (Admin) */}
        {tab==='settings' && isAdmin && (
          <div className="space-y-5 max-w-2xl">
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="font-bold text-[#003399] mb-4 flex items-center gap-2 text-sm"><FiSettings/> System Settings</h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div><p className="font-semibold text-[#001F3F] text-sm">Self-Registration</p><p className="text-xs text-gray-500">Allow users to register using a token</p></div>
                <button onClick={()=>doToggleSetting('self_register_enabled', settings.self_register_enabled||'0')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition ${settings.self_register_enabled==='1'?'bg-green-100 text-green-700 hover:bg-green-200':'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                  {settings.self_register_enabled==='1'?<><FiToggleRight className="text-xl"/> ON</>:<><FiToggleLeft className="text-xl"/> OFF</>}
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="font-bold text-[#003399] mb-4 flex items-center gap-2 text-sm"><FiKey/> Registration Tokens</h2>
              <p className="text-xs text-gray-500 mb-4">Generate a one-time token (expires in 48hrs). Give the token to the user to self-register.</p>
              <div className="flex gap-3 mb-4">
                <select value={tRole} onChange={e=>setTRole(e.target.value)} className="border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none flex-1">
                  <option value="student">Student Token</option><option value="mentor">Mentor Token</option><option value="supervisor">Supervisor Token</option>
                </select>
                <button onClick={doGenToken} disabled={tL} className="bg-[#003399] hover:bg-[#001F3F] disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
                  <FiKey/> {tL?'Generating...':'Generate'}
                </button>
              </div>
              {newTok && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <p className="text-sm font-semibold text-green-700 mb-2">✓ Token Generated! Share this with the user:</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold tracking-widest text-[#003399] font-mono bg-white px-4 py-2 rounded-lg border border-[#003399]">{newTok.token}</span>
                    <button onClick={()=>copy(newTok.token)} className="p-2 text-gray-500 hover:text-[#003399] bg-white rounded-lg border hover:border-[#003399] transition"><FiCopy/></button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Role: <strong>{newTok.role}</strong> · Expires: {new Date(newTok.expires_at).toLocaleString()}</p>
                </div>
              )}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {tokens.length===0 ? <p className="text-sm text-gray-400 text-center py-4">No tokens yet</p>
                  : tokens.map(t=>(
                    <div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl border ${t.used?'bg-gray-50 border-gray-200 opacity-60':'bg-white border-gray-200'}`}>
                      <span className={`font-mono font-bold text-lg tracking-widest ${t.used?'text-gray-400':'text-[#003399]'}`}>{t.token}</span>
                      <div className="flex-1 text-xs text-gray-500">
                        <span className={`px-2 py-0.5 rounded-full font-medium mr-2 ${t.used?'bg-gray-100 text-gray-500':'bg-green-100 text-green-700'}`}>{t.used?'Used':'Available'}</span>
                        {t.role} · {new Date(t.created_at).toLocaleDateString()}
                      </div>
                      {!t.used && <button onClick={()=>copy(t.token)} className="p-1 text-gray-400 hover:text-[#003399]"><FiCopy/></button>}
                      <button onClick={()=>delToken(t.id)} className="p-1 text-red-400 hover:text-red-600"><FiTrash2/></button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Reset Password Modal */}
      {resetT && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-[#003399]">Reset Password</h3><button onClick={()=>setResetT(null)}><FiX className="text-gray-400"/></button></div>
            <p className="text-sm text-gray-600 mb-4">Set new password for <strong>{resetT.first_name} {resetT.last_name}</strong></p>
            <div className="relative mb-4">
              <input type={showRP?'text':'password'} value={resetP} onChange={e=>setResetP(e.target.value)} placeholder="New password (min 6 chars)" className={`${IC} pr-10`}/>
              <button type="button" onClick={()=>setShowRP(!showRP)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#003399]">{showRP?<FiEyeOff/>:<FiEye/>}</button>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setResetT(null)} className="flex-1 py-2.5 border rounded-xl text-gray-700 text-sm font-semibold hover:bg-gray-50">Cancel</button>
              <button onClick={doResetPw} disabled={resetL} className="flex-1 py-2.5 bg-[#003399] text-white rounded-xl text-sm font-semibold disabled:opacity-60">{resetL?'Resetting...':'Reset Password'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
