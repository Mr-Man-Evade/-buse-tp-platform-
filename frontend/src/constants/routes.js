/**
 * Frontend Routes - Centralized route definitions
 */

export const PUBLIC_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
};

export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  CHAT: '/chat',
};

// Role-specific routes
export const STUDENT_ROUTES = {
  DASHBOARD: '/student',
  UPLOAD: '/upload',
  PROGRESS: '/student/progress',
  FINAL_MARK: '/student/final-mark',
  FORMS: '/student/forms',
};

export const MENTOR_ROUTES = {
  DASHBOARD: '/mentor',
  FORMS: '/mentor/forms',
  ASSESSMENT_FORMS: '/mentor/forms/:studentId',
};

export const SUPERVISOR_ROUTES = {
  DASHBOARD: '/supervisor',
  SUBMISSIONS: '/supervisor/submissions',
  FINAL_MARK: '/supervisor/final-mark',
  FORMS: '/supervisor/forms',
  ASSESSMENT_FORMS: '/supervisor/forms/:studentId',
  OFFICIAL_REPLICA: '/supervisor/official-replica',
};

export const COORDINATOR_ROUTES = {
  DASHBOARD: '/coordinator',
  GRADEBOOK: '/coordinator/gradebook',
  BULK_ASSIGN: '/coordinator/bulk-assign',
  REPORTS: '/coordinator/reports',
  MANAGE_USERS: '/coordinator/manage-users',
  FORMS: '/coordinator/forms',
};

export const ADMIN_ROUTES = {
  ...COORDINATOR_ROUTES,
  DASHBOARD: '/admin',  // Override coordinator dashboard with admin dashboard
};

// Role to Dashboard mapping
export const ROLE_DASHBOARDS = {
  student: STUDENT_ROUTES.DASHBOARD,
  mentor: MENTOR_ROUTES.DASHBOARD,
  supervisor: SUPERVISOR_ROUTES.DASHBOARD,
  coordinator: COORDINATOR_ROUTES.DASHBOARD,
  admin: ADMIN_ROUTES.DASHBOARD,
};

// Assessment routes
export const ASSESSMENT_ROUTES = {
  GUIDE: '/guide',
  FORMS: '/forms',
  FORMS_BY_STUDENT: '/forms/:studentId',
};

export const getRouteForRole = (role) => ROLE_DASHBOARDS[role] || PROTECTED_ROUTES.DASHBOARD;
