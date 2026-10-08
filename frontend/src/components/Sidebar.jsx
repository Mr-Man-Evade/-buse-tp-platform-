import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiHome, FiFileText, FiMessageSquare, FiLogOut, FiBarChart2, FiUsers, FiCalendar, FiUser, FiBookOpen, FiAward, FiShield } from 'react-icons/fi';

export default function Sidebar({ role, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = {
    student: [
      { label: 'Dashboard', icon: FiHome, path: '/student' },
      { label: 'Upload Documents', icon: FiFileText, path: '/upload' },
      { label: 'Progress', icon: FiCalendar, path: '/student/progress' },
      { label: 'Final Mark', icon: FiAward, path: '/student/final-mark' },
      { label: 'Assessment Forms', icon: FiBookOpen, path: '/student/forms' },
      { label: 'Messages', icon: FiMessageSquare, path: '/chat' },
      { label: 'Assessment Guide', icon: FiBookOpen, path: '/guide' }
    ],
    mentor: [
      { label: 'Dashboard', icon: FiHome, path: '/mentor' },
      { label: 'Messages', icon: FiMessageSquare, path: '/chat' },
      { label: 'Assessment Forms', icon: FiBookOpen, path: '/mentor/forms' },
      { label: 'Assessment Guide', icon: FiBookOpen, path: '/guide' }
    ],
    supervisor: [
      { label: 'Dashboard', icon: FiHome, path: '/supervisor' },
      { label: 'Submissions', icon: FiFileText, path: '/supervisor/submissions' },
      { label: 'Final Mark Entry', icon: FiAward, path: '/supervisor/final-mark' },
      { label: 'Assessment Forms', icon: FiBookOpen, path: '/supervisor/forms' },
      { label: 'Messages', icon: FiMessageSquare, path: '/chat' },
      { label: 'Assessment Guide', icon: FiBookOpen, path: '/guide' }
    ],
    coordinator: [
      { label: 'Dashboard', icon: FiHome, path: '/coordinator' },
      { label: 'Gradebook', icon: FiBarChart2, path: '/coordinator/gradebook' },
      { label: 'Bulk Assign', icon: FiUsers, path: '/coordinator/bulk-assign' },
      { label: 'Reports', icon: FiBarChart2, path: '/coordinator/reports' },
      { label: 'Manage Users', icon: FiUsers, path: '/coordinator/manage-users' },
      { label: 'Assessment Forms', icon: FiBookOpen, path: '/coordinator/forms' },
      { label: 'Messages', icon: FiMessageSquare, path: '/chat' },
      { label: 'Assessment Guide', icon: FiBookOpen, path: '/guide' }
    ],
    admin: [
      { label: 'Dashboard', icon: FiHome, path: '/admin' },
      { label: 'Gradebook', icon: FiBarChart2, path: '/coordinator/gradebook' },
      { label: 'Bulk Assign', icon: FiUsers, path: '/coordinator/bulk-assign' },
      { label: 'Reports', icon: FiBarChart2, path: '/coordinator/reports' },
      { label: 'Manage Users', icon: FiUsers, path: '/coordinator/manage-users' },
      { label: 'Assessment Forms', icon: FiBookOpen, path: '/coordinator/forms' },
      { label: 'Messages', icon: FiMessageSquare, path: '/chat' },
      { label: 'Assessment Guide', icon: FiBookOpen, path: '/guide' }
    ]
  };

  const items = sidebarItems[role] || [];
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  const [profileMenu, setProfileMenu] = useState(false);

  return (
    <>
      <button className="fixed md:hidden top-6 left-6 z-40 bg-[#003399] text-white p-2 rounded" onClick={() => setIsOpen(!isOpen)}>
        <FiMenu size={24} />
      </button>

      <aside className={`fixed md:relative w-64 bg-gradient-to-b from-[#003399] to-[#001F3F] text-white h-screen p-6 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} z-30 flex flex-col overflow-hidden`}>
        <div className="mb-6 text-center shrink-0">
          <img src="/buse-logo.png" alt="BUSE" className="w-16 h-16 object-contain mx-auto mb-2" />
          <h1 className="text-base font-bold text-[#FFD700] leading-tight">Teaching Practice</h1>
          <p className="text-xs text-[#87CEEB]">BUSE Portal</p>
        </div>

        <nav className="flex-1 overflow-y-auto pr-1 space-y-2 py-1">
          {items.map((item, idx) => (
            <Link key={idx} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition ${isActive(item.path) ? 'bg-white/15 border-white/30 text-white shadow-inner' : 'border-transparent text-white/80 hover:bg-white/10 hover:text-white'}`} onClick={() => setIsOpen(false)}>
              <item.icon size={20} />
              <span className="font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-4 pt-4 border-t border-white/10 shrink-0 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs text-[#87CEEB] uppercase tracking-wide">Role</p>
              <p className="text-sm font-semibold capitalize">{role}</p>
            </div>
            <button onClick={() => setProfileMenu((prev) => !prev)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
              <FiUser size={18} />
            </button>
          </div>
          {profileMenu && (
            <div className="bg-white/10 rounded-2xl p-3 space-y-2">
              <button onClick={() => { setProfileMenu(false); navigate('/profile'); }} className="w-full text-left text-sm text-white hover:text-[#FFD700]">Edit Profile</button>
              <button onClick={() => { setProfileMenu(false); onLogout(); navigate('/login'); }} className="w-full text-left text-sm text-red-200 hover:text-white">Logout</button>
            </div>
          )}
        </div>
      </aside>

      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20" onClick={() => setIsOpen(false)} />}
    </>
  );
}
