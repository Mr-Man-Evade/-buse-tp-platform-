/**
 * Login Page - Authentication entry point
 * Supports: standard login, token-based registration, password reset
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiX, FiKey } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { ROLE_DASHBOARDS } from '../constants/routes';
import { getUserRole } from '../utils/storage';
import LoginForm from '../components/forms/LoginForm';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState('login');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Token register state
  const [tokenForm, setTokenForm] = useState({
    token: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    studentId: '',
    phone: '',
    school: '',
  });
  const [tokenStep, setTokenStep] = useState(1);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(false);

  // Redirect if already authenticated - check both context and localStorage
  const { userRole } = useAuth();
  useEffect(() => {
    const effectiveRole = userRole || getUserRole();
    if (isAuthenticated && effectiveRole) {
      const dashboard = ROLE_DASHBOARDS[effectiveRole] || '/dashboard';
      navigate(dashboard, { replace: true });
    }
  }, [isAuthenticated, userRole, navigate]);

  /**
   * Handle forgot password
   */
  const handleForgot = async (e) => {
    e.preventDefault();
    setForgotLoading(true);

    try {
      await authService.forgotPassword(forgotEmail);
      toast.success(
        'If that email is registered, a reset link has been sent. Please contact your coordinator for assistance.'
      );
      setShowForgot(false);
      setForgotEmail('');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  /**
   * Handle validate token
   */
  const handleValidateToken = async () => {
    if (!tokenForm.token.trim()) {
      toast.error('Please enter your registration token');
      return;
    }

    setTokenLoading(true);
    try {
      const response = await authService.validateRegistrationToken(tokenForm.token.trim().toUpperCase());
      setTokenInfo(response);
      setTokenStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid token');
    } finally {
      setTokenLoading(false);
    }
  };

  /**
   * Handle token registration
   */
  const handleTokenRegister = async (e) => {
    e.preventDefault();
    setTokenLoading(true);

    try {
      await authService.tokenRegister(tokenForm.token.toUpperCase(), {
        email: tokenForm.email,
        password: tokenForm.password,
        firstName: tokenForm.firstName,
        lastName: tokenForm.lastName,
        studentId: tokenForm.studentId || null,
        phone: tokenForm.phone || null,
        school: tokenForm.school || null,
      });

      toast.success('Registration successful! Please log in.');
      setTimeout(() => {
        setMode('login');
        setTokenForm({
          token: '',
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          studentId: '',
          phone: '',
          school: '',
        });
        setTokenStep(1);
        setTokenInfo(null);
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setTokenLoading(false);
    }
  };

  const inputClass = 'w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399] transition';

  return (
    <div className="portal-page flex items-center justify-center p-4 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="portal-panel p-8 w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] gap-6 bg-white rounded-2xl shadow-xl">
        {/* Hero Section */}
        <div className="portal-hero rounded-[24px] p-8 bg-gradient-to-br from-[#003399] to-[#001F3F] text-white flex flex-col justify-between">
          <div>
            <span className="portal-badge bg-white/10 text-white border border-white/20 px-3 py-1 rounded-full text-xs font-semibold">
              BUSE Academic Portal
            </span>
            <h1 className="text-3xl font-bold mt-4">Teaching Practice Management System</h1>
            <p className="mt-3 text-sm text-slate-200 leading-6">
              A secure, university-style workspace for student teachers, mentors, supervisors, and coordinators to manage progress,
              submissions, and assessment records.
            </p>
          </div>
          <div className="space-y-2 text-sm text-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFD700]" />
              Student submission tracking
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#87CEEB]" />
              Supervisor review and final marking
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFD700]" />
              Coordinator assignment and reporting
            </div>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-7">
            <img
              src="/buse-logo.png"
              alt="BUSE"
              className="w-24 h-24 object-contain mx-auto mb-3"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <h2 className="text-2xl font-bold text-[#003399]">Welcome Back</h2>
            <p className="text-gray-500 text-sm">Sign in to continue your teaching practice journey</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                mode === 'login' ? 'bg-white text-[#003399] shadow' : 'text-gray-500'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('token-register')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                mode === 'token-register' ? 'bg-white text-[#003399] shadow' : 'text-gray-500'
              }`}
            >
              Register with Token
            </button>
          </div>

          {/* Login Form - Using LoginForm Component */}
          {mode === 'login' && (
            <LoginForm onForgot={() => setShowForgot(true)} />
          )}

          {/* Token Register */}
          {mode === 'token-register' && (
            <div>
              {tokenStep === 1 ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
                    <FiKey className="inline mr-1" /> You need a registration token from your coordinator or admin to register.
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Your Registration Token</label>
                    <div className="relative">
                      <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={tokenForm.token}
                        onChange={(e) =>
                          setTokenForm((p) => ({
                            ...p,
                            token: e.target.value.toUpperCase(),
                          }))
                        }
                        placeholder="e.g. A3F9BC12"
                        className={`${inputClass} font-mono tracking-widest uppercase`}
                        maxLength={8}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleValidateToken}
                    disabled={tokenLoading}
                    className="w-full bg-gradient-to-r from-[#003399] to-[#001F3F] hover:from-[#002266] hover:to-[#001040] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm shadow-sm"
                  >
                    {tokenLoading ? 'Validating...' : 'Validate Token'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTokenRegister} className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-700 flex items-center gap-2">
                    <FiKey /> Token valid! Role: <strong className="capitalize">{tokenInfo?.role}</strong>. Fill in your details.
                  </div>
                  {[
                    { label: 'First Name', key: 'firstName', type: 'text', required: true },
                    { label: 'Last Name', key: 'lastName', type: 'text', required: true },
                    { label: 'Email Address', key: 'email', type: 'email', required: true },
                    { label: 'Password', key: 'password', type: 'password', required: true },
                    { label: 'Student ID (if applicable)', key: 'studentId', type: 'text', required: false },
                    { label: 'Phone Number', key: 'phone', type: 'tel', required: false },
                    { label: 'School / Institution', key: 'school', type: 'text', required: false },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">{field.label}</label>
                      <input
                        type={field.type}
                        value={tokenForm[field.key]}
                        onChange={(e) =>
                          setTokenForm((p) => ({
                            ...p,
                            [field.key]: e.target.value,
                          }))
                        }
                        required={field.required}
                        className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]"
                      />
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setTokenStep(1);
                        setTokenInfo(null);
                      }}
                      className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 text-sm font-semibold hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={tokenLoading}
                      className="flex-1 py-2.5 bg-gradient-to-r from-[#003399] to-[#001F3F] text-white rounded-xl text-sm font-semibold disabled:opacity-60 shadow-sm"
                    >
                      {tokenLoading ? 'Registering...' : 'Register'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          <p className="text-center text-gray-400 text-xs mt-5">
            BUSE Teaching Practice Management System · <span className="text-[#003399]">v2.0</span>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#003399]">Reset Password</h3>
              <button onClick={() => setShowForgot(false)} className="text-gray-400 hover:text-gray-600">
                <FiX />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Enter your email. Your TP coordinator can also reset your password from the dashboard.
            </p>
            <form onSubmit={handleForgot} className="space-y-3">
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full bg-[#003399] hover:bg-[#001F3F] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm"
              >
                {forgotLoading ? 'Sending...' : 'Send Reset Request'}
              </button>
            </form>
            <button
              onClick={() => setShowForgot(false)}
              className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
