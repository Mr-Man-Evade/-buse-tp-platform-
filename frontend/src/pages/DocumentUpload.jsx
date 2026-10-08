import React from 'react';
import DocumentUpload from '../components/DocumentUpload';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

export default function DocumentUploadPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F5F9FF]">
      <Sidebar role={user?.role || 'student'} onLogout={handleLogout} />

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#003399]">Document Upload</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            <FiLogOut /> Logout
          </button>
        </div>

        <DocumentUpload onUploadSuccess={() => navigate('/student')} />
      </main>
    </div>
  );
}
