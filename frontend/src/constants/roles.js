/**
 * User Roles & Permissions
 * Single source of truth for all role-related constants
 */

export const ROLES = {
  STUDENT: 'student',
  MENTOR: 'mentor',
  SUPERVISOR: 'supervisor',
  COORDINATOR: 'coordinator',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  [ROLES.STUDENT]: 'Student',
  [ROLES.MENTOR]: 'Mentor',
  [ROLES.SUPERVISOR]: 'Supervisor',
  [ROLES.COORDINATOR]: 'Coordinator',
  [ROLES.ADMIN]: 'Administrator',
};

// Permission matrix
export const PERMISSIONS = {
  [ROLES.ADMIN]: ['*'], // All permissions
  [ROLES.COORDINATOR]: [
    'view_users',
    'manage_users',
    'create_assignments',
    'view_all_documents',
    'view_reports',
    'manage_announcements',
    'view_gradebook',
    'manage_system_settings',
  ],
  [ROLES.SUPERVISOR]: [
    'view_assigned_students',
    'view_student_documents',
    'grade_documents',
    'submit_final_marks',
    'view_own_profile',
  ],
  [ROLES.MENTOR]: [
    'view_assigned_students',
    'view_student_documents',
    'submit_feedback',
    'fill_assessment_forms',
    'view_own_profile',
  ],
  [ROLES.STUDENT]: [
    'upload_documents',
    'view_own_documents',
    'view_feedback',
    'view_announcements',
    'view_own_profile',
    'view_messages',
    'send_messages',
  ],
};

export const hasPermission = (userRole, permission) => {
  const userPermissions = PERMISSIONS[userRole] || [];
  return userPermissions.includes('*') || userPermissions.includes(permission);
};

export const hasAnyPermission = (userRole, permissions = []) => {
  return permissions.some(perm => hasPermission(userRole, perm));
};

export const hasAllPermissions = (userRole, permissions = []) => {
  return permissions.every(perm => hasPermission(userRole, perm));
};
