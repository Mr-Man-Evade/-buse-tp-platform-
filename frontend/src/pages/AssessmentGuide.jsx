import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiCheckCircle, FiFileText, FiUsers, FiClipboard } from 'react-icons/fi';

export default function AssessmentGuide() {
  const navigate = useNavigate();

  const sections = [
    {
      title: '1. Teaching Practice Overview',
      icon: FiBookOpen,
      body: 'This portal helps student teachers, mentors, supervisors, and coordinators manage teaching practice submissions, review progress, and finalize assessments in a clear university-style workflow.'
    },
    {
      title: '2. Student Teacher Responsibilities',
      icon: FiFileText,
      body: 'Students should upload required documents, track their progress, and keep their profile information up to date so supervisors can review the correct records.'
    },
    {
      title: '3. Supervisor Review Process',
      icon: FiUsers,
      body: 'Supervisors can inspect submitted documents, leave feedback, and submit a final mark for each student teacher after reviewing evidence and progress.'
    },
    {
      title: '4. Coordinator Coordination',
      icon: FiClipboard,
      body: 'Coordinators manage assignments, monitor grade entries, and ensure each student has the correct mentor, supervisor, and registration record for assessment.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      <div className="bg-[#002080] text-white px-6 py-4 flex items-center gap-4 shadow-lg">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg"><FiArrowLeft /></button>
        <div>
          <p className="text-xs text-[#87CEEB]">BUSE TP Portal</p>
          <p className="font-bold text-sm">Teaching Practice Assessment Guide</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-5">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#E3EAFD]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-2xl bg-[#F0F4FF] text-[#003399]">
              <FiBookOpen size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#001F3F]">Assessment Guide</h2>
              <p className="text-sm text-gray-500">A simple summary of the teaching practice workflow for all users</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <div key={idx} className="rounded-xl border border-[#E3EAFD] p-4 bg-[#F9FBFF]">
                  <div className="flex items-center gap-2 mb-2 text-[#003399] font-semibold">
                    <Icon />
                    <span>{section.title}</span>
                  </div>
                  <p className="text-sm text-gray-600">{section.body}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#003399] to-[#002080] text-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><FiCheckCircle /> Ready for Assessment</h3>
          <p className="text-sm text-[#DCE8FF]">Every student teacher should ensure that the registration number, profile details, and required documents are complete before final review.</p>
        </div>
      </div>
    </div>
  );
}
