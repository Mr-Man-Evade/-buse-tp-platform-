import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiBook } from 'react-icons/fi';
import axios from 'axios';

const API_BASE_URL = '/api';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'student',
    studentId: '',
    title: '',
    program: '',
    level: '',
    className: '',
    teachingSubject: '',
    topic: '',
    tpStartDate: '',
    tpEndDate: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/register`, formData);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-page flex items-center justify-center p-4">
      <div className="portal-panel p-8 w-full max-w-5xl grid lg:grid-cols-[0.95fr_1.05fr] gap-6">
        <div className="portal-hero rounded-[24px] p-8 text-white flex flex-col justify-between">
          <div>
            <span className="portal-badge bg-white/10 text-white border-white/20">University Registration</span>
            <h1 className="text-3xl font-bold mt-4">Create your teaching practice account</h1>
            <p className="mt-3 text-sm text-slate-200 leading-6">Register with your academic details to begin submitting work, tracking progress, and collaborating with your TP team.</p>
          </div>
          <div className="space-y-2 text-sm text-slate-200">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#FFD700]" /> Complete and accurate student registration</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#87CEEB]" /> Clear role-based access for staff and students</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#FFD700]" /> Easy coordination with supervisors and coordinators</div>
          </div>
        </div>

        <div className="w-full max-w-lg mx-auto">
          <div className="text-center mb-8">
            <img src="/buse-logo.png" alt="BUSE Logo" className="w-20 h-20 object-contain mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-[#003399] mb-1">Create Your Account</h2>
            <p className="text-gray-500 text-sm">Bindura University of Science Education</p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#001F3F] mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="input-field text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001F3F] mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="input-field text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#001F3F] mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#001F3F] mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="student">Student Teacher</option>
              <option value="mentor">Mentor</option>
              <option value="supervisor">Supervisor</option>
              <option value="coordinator">Coordinator</option>
            </select>
          </div>

          {formData.role === 'student' && (
            <div>
              <label className="block text-sm font-semibold text-[#001F3F] mb-1">
                Registration Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="e.g., B123432B"
                className="input-field"
                required={formData.role === 'student'}
                pattern="[A-Z0-9]+"
                title="Registration number (uppercase letters and numbers)"
              />
              <p className="text-xs text-gray-500 mt-1">Your unique registration number assigned by the TP Coordinator</p>
            </div>
          )}
          {formData.role !== 'student' && (
            <div>
              <label className="block text-sm font-semibold text-[#001F3F] mb-1">Staff ID (Optional)</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Optional"
                className="input-field"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#001F3F] mb-1">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Mr / Mrs / Dr" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001F3F] mb-1">Level</label>
              <input type="text" name="level" value={formData.level} onChange={handleChange} placeholder="2.2 / 1.1" className="input-field" />
            </div>
          </div>

          {formData.role === 'student' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-[#001F3F] mb-1">Class / Grade</label>
                <input type="text" name="className" value={formData.className} onChange={handleChange} placeholder="e.g. Form 2A" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#001F3F] mb-1">Teaching Subject</label>
                <input type="text" name="teachingSubject" value={formData.teachingSubject} onChange={handleChange} placeholder="e.g. Mathematics" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#001F3F] mb-1">TP Topic</label>
                <input type="text" name="topic" value={formData.topic} onChange={handleChange} placeholder="e.g. Fractions" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#001F3F] mb-1">TP Start Date</label>
                <input type="date" name="tpStartDate" value={formData.tpStartDate} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#001F3F] mb-1">TP End Date</label>
                <input type="date" name="tpEndDate" value={formData.tpEndDate} onChange={handleChange} className="input-field" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#001F3F] mb-1">Programme</label>
            <input type="text" name="program" value={formData.program} onChange={handleChange} placeholder="e.g. BSc Educational Management" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#001F3F] mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-field"
              required
            />
          </div>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#003399] to-[#001F3F] hover:from-[#002266] hover:to-[#001040] text-white font-semibold py-3 mt-6 rounded-xl shadow-sm"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account? <a href="/login" className="text-[#003399] font-semibold hover:underline">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
