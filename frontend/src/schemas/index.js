/**
 * Feedback & Assignment Schemas
 */

import { z } from 'zod';

// Feedback Schema
export const feedbackSchema = z.object({
  documentId: z
    .number('Document ID is required')
    .min(1, 'Document ID is required'),
  comment: z
    .string()
    .max(2000, 'Comment too long')
    .optional()
    .nullable(),
  rating: z
    .number('Rating is required')
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
});

// Assignment Schema
export const assignmentSchema = z.object({
  studentId: z
    .number('Student ID is required')
    .min(1, 'Student ID is required'),
  mentorId: z
    .number()
    .optional()
    .nullable(),
  supervisorId: z
    .number()
    .optional()
    .nullable(),
  school: z
    .string()
    .optional()
    .nullable(),
});

export const bulkAssignmentSchema = z.object({
  assignments: z.array(assignmentSchema).min(1, 'At least one assignment is required'),
});

// Final Marks Schema
export const finalMarksSchema = z.object({
  studentId: z
    .number('Student ID is required')
    .min(1, 'Student ID is required'),
  supervisorId: z
    .number('Supervisor ID is required')
    .min(1, 'Supervisor ID is required'),
  lessonPlanning: z
    .number()
    .min(0)
    .max(100)
    .optional(),
  scheming: z
    .number()
    .min(0)
    .max(100)
    .optional(),
  assessment: z
    .number()
    .min(0)
    .max(100)
    .optional(),
  reflection: z
    .number()
    .min(0)
    .max(100)
    .optional(),
  totalMarks: z
    .number()
    .min(0)
    .max(100)
    .optional(),
  markAwarded: z
    .number()
    .min(0)
    .max(100)
    .optional(),
  overallComments: z
    .string()
    .max(2000, 'Comments too long')
    .optional()
    .nullable(),
});

// Announcement Schema
export const announcementSchema = z.object({
  title: z
    .string('Title is required')
    .min(1, 'Title is required')
    .max(255, 'Title too long'),
  content: z
    .string('Content is required')
    .min(1, 'Content is required')
    .max(5000, 'Content too long'),
  targetRole: z
    .enum(['all', 'student', 'mentor', 'supervisor', 'coordinator'], {
      errorMap: () => ({ message: 'Select a valid target role' })
    }),
});

// Message Schema
export const messageSchema = z.object({
  recipientId: z
    .number('Recipient ID is required')
    .min(1, 'Recipient ID is required'),
  content: z
    .string('Message content is required')
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message too long'),
  replyTo: z
    .number()
    .optional()
    .nullable(),
});
