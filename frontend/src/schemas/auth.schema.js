/**
 * Zod Schema Definitions - All data validation schemas
 */

import { z } from 'zod';
import { ROLES } from '../constants/roles';

// Auth Schemas
export const loginSchema = z.object({
  email: z
    .string('Email is required')
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z
    .string('Password is required')
    .min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z
    .string('Email is required')
    .email('Invalid email address'),
  password: z
    .string('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])/, 'Password must contain lowercase letters')
    .regex(/^(?=.*[A-Z])/, 'Password must contain uppercase letters')
    .regex(/^(?=.*\d)/, 'Password must contain numbers'),
  confirmPassword: z.string('Please confirm your password'),
  firstName: z
    .string('First name is required')
    .min(1, 'First name is required')
    .max(100, 'First name too long'),
  lastName: z
    .string('Last name is required')
    .min(1, 'Last name is required')
    .max(100, 'Last name too long'),
  role: z.enum([ROLES.STUDENT, ROLES.MENTOR, ROLES.SUPERVISOR, ROLES.COORDINATOR], {
    errorMap: () => ({ message: 'Invalid role selected' })
  }),
  studentId: z
    .string()
    .optional()
    .nullable(),
  phone: z
    .string()
    .optional()
    .nullable(),
  school: z
    .string()
    .optional()
    .nullable(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const tokenRegisterSchema = z.object({
  token: z
    .string('Token is required')
    .min(1, 'Token is required'),
  email: z
    .string('Email is required')
    .email('Invalid email address'),
  password: z
    .string('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  firstName: z
    .string('First name is required')
    .min(1, 'First name is required'),
  lastName: z
    .string('Last name is required')
    .min(1, 'Last name is required'),
  studentId: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  school: z.string().optional().nullable(),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string('Current password is required')
    .min(1, 'Current password is required'),
  newPassword: z
    .string('New password is required')
    .min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string('Please confirm your new password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z
    .string('Email is required')
    .email('Invalid email address'),
});

// User Profile Schema
export const profileSchema = z.object({
  firstName: z
    .string('First name is required')
    .min(1, 'First name is required')
    .max(100, 'First name too long'),
  lastName: z
    .string('Last name is required')
    .min(1, 'Last name is required')
    .max(100, 'Last name too long'),
  phone: z
    .string()
    .optional()
    .nullable(),
  school: z
    .string()
    .optional()
    .nullable(),
  title: z
    .string()
    .optional()
    .nullable(),
  program: z
    .string()
    .optional()
    .nullable(),
  level: z
    .string()
    .optional()
    .nullable(),
  className: z
    .string()
    .optional()
    .nullable(),
  teachingSubject: z
    .string()
    .optional()
    .nullable(),
  topic: z
    .string()
    .optional()
    .nullable(),
  tpStartDate: z.string().optional().nullable(),
  tpEndDate: z.string().optional().nullable(),
});
