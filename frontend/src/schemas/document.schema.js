/**
 * Document Schemas
 */

import { z } from 'zod';
import { DOCUMENT_CATEGORIES, DOCUMENT_STATUS } from '../constants/statuses';

export const documentUploadSchema = z.object({
  title: z
    .string('Document title is required')
    .min(1, 'Document title is required')
    .max(255, 'Title too long'),
  description: z
    .string()
    .max(1000, 'Description too long')
    .optional()
    .nullable(),
  category: z.enum(
    [
      DOCUMENT_CATEGORIES.RETURN_SLIP,
      DOCUMENT_CATEGORIES.SCHEME_OF_WORK,
      DOCUMENT_CATEGORIES.DAILY_LESSON_PLAN,
      DOCUMENT_CATEGORIES.EVIDENCE,
      DOCUMENT_CATEGORIES.REFLECTION,
      DOCUMENT_CATEGORIES.GENERAL,
    ],
    { errorMap: () => ({ message: 'Please select a valid category' }) }
  ),
  dueDate: z
    .string()
    .optional()
    .nullable(),
  file: z
    .instanceof(File, { message: 'File is required' })
    .refine(file => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      file =>
        [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'image/jpeg',
          'image/png',
        ].includes(file.type),
      'File type not supported'
    ),
});

export const documentUpdateSchema = z.object({
  title: z
    .string()
    .min(1, 'Document title is required')
    .max(255, 'Title too long')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description too long')
    .optional()
    .nullable(),
  status: z.enum([DOCUMENT_STATUS.PENDING, DOCUMENT_STATUS.APPROVED, DOCUMENT_STATUS.REJECTED, DOCUMENT_STATUS.REVIEWED]).optional(),
  category: z
    .enum([
      DOCUMENT_CATEGORIES.RETURN_SLIP,
      DOCUMENT_CATEGORIES.SCHEME_OF_WORK,
      DOCUMENT_CATEGORIES.DAILY_LESSON_PLAN,
      DOCUMENT_CATEGORIES.EVIDENCE,
      DOCUMENT_CATEGORIES.REFLECTION,
      DOCUMENT_CATEGORIES.GENERAL,
    ])
    .optional(),
});
