/**
 * App - Main application component with routing and auth
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import SupervisorFinalMark from './pages/SupervisorFinalMark';
import SupervisorSubmissions from './pages/SupervisorSubmissions';
import StudentFinalMark from './pages/StudentFinalMark';
import StudentProgress from './pages/StudentProgress';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import CoordinatorGradebook from './pages/CoordinatorGradebook';
import BulkAssignmentUpload from './pages/BulkAssignmentUpload';
import Reports from './pages/Reports';
import ManageUsers from './pages/ManageUsers';
import Chat from './pages/Chat';
import DocumentUpload from './pages/DocumentUpload';
import Profile from './pages/Profile';
import AssessmentGuide from './pages/AssessmentGuide';
import AssessmentForms from './pages/AssessmentForms';
import Unauthorized from './pages/Unauthorized';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import { ROLES } from './constants/roles';

// Styles
import './App.css';

/**
 * AppRoutes - Routes component (must be inside AuthProvider)
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected routes - accessible by all authenticated users */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guide"
        element={
          <ProtectedRoute>
            <AssessmentGuide />
          </ProtectedRoute>
        }
      />

      {/* Student routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute requiredRole={[ROLES.STUDENT, ROLES.ADMIN]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/final-mark"
        element={
          <ProtectedRoute requiredRole={[ROLES.STUDENT, ROLES.ADMIN]}>
            <StudentFinalMark />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/progress"
        element={
          <ProtectedRoute requiredRole={[ROLES.STUDENT, ROLES.ADMIN]}>
            <StudentProgress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/forms"
        element={
          <ProtectedRoute requiredRole={[ROLES.STUDENT, ROLES.ADMIN]}>
            <AssessmentForms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/forms/:studentId"
        element={
          <ProtectedRoute requiredRole={[ROLES.STUDENT, ROLES.ADMIN]}>
            <AssessmentForms />
          </ProtectedRoute>
        }
      />

      {/* Mentor routes - Supervisors also have all mentor capabilities */}
      <Route
        path="/mentor"
        element={
          <ProtectedRoute requiredRole={[ROLES.MENTOR, ROLES.SUPERVISOR, ROLES.ADMIN]}>
            <MentorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/forms"
        element={
          <ProtectedRoute requiredRole={[ROLES.MENTOR, ROLES.SUPERVISOR, ROLES.ADMIN]}>
            <AssessmentForms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/forms/:studentId"
        element={
          <ProtectedRoute requiredRole={[ROLES.MENTOR, ROLES.SUPERVISOR, ROLES.ADMIN]}>
            <AssessmentForms />
          </ProtectedRoute>
        }
      />

      {/* Supervisor routes */}
      <Route
        path="/supervisor"
        element={
          <ProtectedRoute requiredRole={[ROLES.SUPERVISOR, ROLES.ADMIN]}>
            <SupervisorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supervisor/submissions"
        element={
          <ProtectedRoute requiredRole={[ROLES.SUPERVISOR, ROLES.ADMIN]}>
            <SupervisorSubmissions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supervisor/final-mark"
        element={
          <ProtectedRoute requiredRole={[ROLES.SUPERVISOR, ROLES.ADMIN]}>
            <AssessmentForms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supervisor/official-replica"
        element={
          <ProtectedRoute requiredRole={[ROLES.SUPERVISOR, ROLES.ADMIN]}>
            <AssessmentForms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supervisor/forms"
        element={
          <ProtectedRoute requiredRole={[ROLES.SUPERVISOR, ROLES.ADMIN]}>
            <AssessmentForms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supervisor/forms/:studentId"
        element={
          <ProtectedRoute requiredRole={[ROLES.SUPERVISOR, ROLES.ADMIN]}>
            <AssessmentForms />
          </ProtectedRoute>
        }
      />

      {/* Coordinator routes */}
      <Route
        path="/coordinator"
        element={
          <ProtectedRoute requiredRole={[ROLES.COORDINATOR, ROLES.ADMIN]}>
            <CoordinatorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coordinator/gradebook"
        element={
          <ProtectedRoute requiredRole={[ROLES.COORDINATOR, ROLES.ADMIN]}>
            <CoordinatorGradebook />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coordinator/bulk-assign"
        element={
          <ProtectedRoute requiredRole={[ROLES.COORDINATOR, ROLES.ADMIN]}>
            <BulkAssignmentUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coordinator/reports"
        element={
          <ProtectedRoute requiredRole={[ROLES.COORDINATOR, ROLES.ADMIN]}>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coordinator/manage-users"
        element={
          <ProtectedRoute requiredRole={[ROLES.COORDINATOR, ROLES.ADMIN]}>
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coordinator/forms"
        element={
          <ProtectedRoute requiredRole={[ROLES.COORDINATOR, ROLES.ADMIN]}>
            <AssessmentForms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coordinator/forms/:studentId"
        element={
          <ProtectedRoute requiredRole={[ROLES.COORDINATOR, ROLES.ADMIN]}>
            <AssessmentForms />
          </ProtectedRoute>
        }
      />

      {/* Admin routes (alias for coordinator) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole={[ROLES.COORDINATOR, ROLES.ADMIN]}>
            <CoordinatorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Document upload (multi-role) */}
      <Route
        path="/upload"
        element={
          <ProtectedRoute requiredRole={[ROLES.STUDENT, ROLES.MENTOR, ROLES.SUPERVISOR, ROLES.ADMIN]}>
            <DocumentUpload />
          </ProtectedRoute>
        }
      />

      {/* Catch-all routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

/**
 * App - Main application component
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
