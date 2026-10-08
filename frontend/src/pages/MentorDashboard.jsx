import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiCheckCircle, FiMessageSquare, FiEye, FiBookOpen } from 'react-icons/fi';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = '/api';

export default function MentorDashboard() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDocuments(response.data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      alert('Please enter feedback');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/feedback`, {
        documentId: selectedDoc.id,
        comment: feedback,
        rating
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert('Feedback submitted successfully!');
      setFeedback('');
      setRating(5);
      setSelectedDoc(null);
    } catch (err) {
      alert('Failed to submit feedback');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F5F9FF]">
      <Sidebar role={user?.role || 'mentor'} onLogout={handleLogout} />

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#003399]">Mentor Dashboard</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/mentor/forms')} className="flex items-center gap-2 bg-[#003399] hover:bg-[#001F3F] text-white px-4 py-2 rounded">
              <FiBookOpen /> Open Forms
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold text-[#003399] mb-6 flex items-center gap-2">
                <FiEye /> Student Submissions
              </h2>

              {loading ? (
                <p>Loading documents...</p>
              ) : documents.length === 0 ? (
                <p className="text-gray-600">No documents to review</p>
              ) : (
                <div className="space-y-3">
                  {documents.map(doc => (
                    <div
                      key={doc.id}
                      className="border border-[#87CEEB] p-4 rounded hover:shadow-md transition cursor-pointer"
                      onClick={() => setSelectedDoc(doc)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-[#003399]">{doc.file_name}</h3>
                          <p className="text-sm text-gray-600">{doc.first_name} {doc.last_name}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-sm ${
                          doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                          doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            {selectedDoc ? (
              <div className="card">
                <h3 className="text-xl font-bold text-[#003399] mb-4">Provide Feedback</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-[#001F3F]">{selectedDoc.file_name}</p>
                    <p className="text-sm text-gray-600 mb-4">{selectedDoc.first_name} {selectedDoc.last_name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#001F3F] mb-2">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="input-field"
                    >
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#001F3F] mb-2">Feedback</label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Provide constructive feedback..."
                      className="input-field h-32"
                    />
                  </div>

                  <button
                    onClick={handleSubmitFeedback}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <FiMessageSquare /> Submit Feedback
                  </button>

                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="btn-secondary w-full"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="card bg-[#F5F9FF] text-center">
                <p className="text-gray-600">Select a document to provide feedback</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
