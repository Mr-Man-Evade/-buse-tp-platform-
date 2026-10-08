/**
 * FORM SYSTEM GUIDE - How to create forms with Zod validation
 *
 * The form system consists of:
 * 1. Zod Schemas (frontend/src/schemas/) - Define data validation
 * 2. useForm Hook - Manage form state and validation
 * 3. Form Components - Reusable UI components for inputs
 * 4. Services - API calls for form submission
 *
 * ============================================================================
 * STEP 1: Define Zod Schema (in frontend/src/schemas/yourFeature.schema.js)
 * ============================================================================
 */

// Example schema:
// import { z } from 'zod';
// 
// export const feedbackSchema = z.object({
//   documentId: z
//     .number('Document ID is required')
//     .min(1, 'Document ID is required'),
//   comment: z
//     .string()
//     .max(2000, 'Comment too long')
//     .optional()
//     .nullable(),
//   rating: z
//     .number('Rating is required')
//     .min(1, 'Rating must be between 1 and 5')
//     .max(5, 'Rating must be between 1 and 5'),
// });
//
// export type FeedbackData = z.infer<typeof feedbackSchema>;

/**
 * ============================================================================
 * STEP 2: Create API Service (in frontend/src/services/yourFeature.js)
 * ============================================================================
 */

// Example service:
// import apiClient from './api';
// 
// export const feedbackService = {
//   submitFeedback: async (data) => {
//     const response = await apiClient.post('/feedback/submit', data);
//     return response.data;
//   },
// };

/**
 * ============================================================================
 * STEP 3: Create Form Component (in frontend/src/components/forms/YourForm.jsx)
 * ============================================================================
 */

// Example form component:
// import { useForm } from '../../hooks/useForm';
// import { feedbackSchema } from '../../schemas/yourFeature.schema';
// import {
//   FormContainer,
//   FormInput,
//   FormSelect,
//   FormSubmit,
// } from './index';
// import { feedbackService } from '../../services/yourFeature';
// import toast from 'react-hot-toast';
//
// export default function FeedbackForm({ documentId, onSuccess }) {
//   const handleSubmit = async (values) => {
//     try {
//       await feedbackService.submitFeedback({
//         ...values,
//         documentId,
//       });
//       toast.success('Feedback submitted successfully!');
//       if (onSuccess) onSuccess();
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Failed to submit feedback');
//       throw err;
//     }
//   };
//
//   const {
//     values,
//     errors,
//     touched,
//     isSubmitting,
//     handleChange,
//     handleBlur,
//     handleSubmit: onSubmit,
//   } = useForm(feedbackSchema, {
//     comment: '',
//     rating: 5,
//   }, handleSubmit);
//
//   return (
//     <FormContainer
//       title="Submit Feedback"
//       description="Provide feedback on this document"
//       onSubmit={onSubmit}
//     >
//       <FormInput
//         name="comment"
//         label="Your Feedback"
//         type="text"
//         value={values.comment}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         error={errors.comment}
//         touched={touched.comment}
//       />
//
//       <FormSelect
//         name="rating"
//         label="Rating"
//         value={values.rating}
//         onChange={handleChange}
//         options={[
//           { value: 5, label: '5 - Excellent' },
//           { value: 4, label: '4 - Good' },
//           { value: 3, label: '3 - Satisfactory' },
//           { value: 2, label: '2 - Fair' },
//           { value: 1, label: '1 - Poor' },
//         ]}
//       />
//
//       <FormSubmit loading={isSubmitting}>
//         Submit Feedback
//       </FormSubmit>
//     </FormContainer>
//   );
// }

/**
 * ============================================================================
 * AVAILABLE FORM COMPONENTS
 * ============================================================================
 *
 * All components have these common props:
 * - name: String - Field name for form state
 * - label: String - Display label
 * - error: String - Error message from validation
 * - touched: Boolean - Whether field has been touched
 * - required: Boolean - Mark as required
 * - disabled: Boolean - Disable the input
 *
 * FormInput
 * - type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'url'
 * - placeholder: String
 * - value: String | Number
 * - onChange, onBlur: Event handlers
 * - icon: React Component (optional - icon from react-icons)
 * - hint: String (helper text below input)
 * - maxLength: Number
 *
 * FormTextarea
 * - rows: Number (default: 4)
 * - maxLength: Number (shows character count)
 * - All other props same as FormInput
 *
 * FormSelect
 * - options: Array of { value, label }
 * - placeholder: String
 * - icon: React Component (optional)
 * - All other base props
 *
 * FormCheckbox
 * - value: Boolean
 * - Similar to FormInput
 *
 * FormFile
 * - accept: String (MIME types or file extensions)
 * - multiple: Boolean (allow multiple files)
 * - icon: React Component
 * - Shows drag & drop area
 *
 * FormSubmit
 * - loading: Boolean (shows spinner and disables button)
 * - disabled: Boolean
 * - variant: 'primary' | 'secondary' | 'danger' | 'success'
 * - size: 'sm' | 'md' | 'lg'
 * - icon: React Component
 * - fullWidth: Boolean
 *
 * FormContainer
 * - title: String
 * - description: String
 * - onSubmit: Function
 * - children: Form components
 */

/**
 * ============================================================================
 * USEFORM HOOK - Advanced Features
 * ============================================================================
 *
 * The useForm hook returns:
 * - values: Object with current form values
 * - errors: Object with validation errors
 * - touched: Object tracking which fields have been touched
 * - isSubmitting: Boolean indicating if form is being submitted
 * - isDirty: Boolean indicating if form has unsaved changes
 * - handleChange: Function to update field value and validate
 * - handleBlur: Function to mark field as touched
 * - handleSubmit: Function to submit form (prevents default, validates, calls onSubmit)
 * - setFieldValue: Function to set single field value
 * - setFieldError: Function to set field error manually
 * - setFormErrors: Function to set multiple errors at once
 * - resetForm: Function to reset form to initial values
 * - validateForm: Function to validate entire form
 * - validateField: Function to validate single field
 *
 * Example usage:
 * const {
 *   values,
 *   errors,
 *   touched,
 *   isSubmitting,
 *   handleChange,
 *   handleBlur,
 *   handleSubmit,
 *   resetForm,
 * } = useForm(schema, initialValues, onSubmit);
 */

/**
 * ============================================================================
 * COMPLETE EXAMPLE - FEEDBACK FORM
 * ============================================================================
 */

import toast from 'react-hot-toast';
import { useForm } from '../../hooks/useForm';
import { z } from 'zod';
import {
  FormContainer,
  FormTextarea,
  FormSelect,
  FormSubmit,
} from './index';

const exampleFeedbackSchema = z.object({
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

export default function ExampleFeedbackForm({ onSuccess }) {
  const handleSubmit = async (values) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Feedback submitted successfully!');
    if (onSuccess) onSuccess();
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: onSubmit,
    resetForm,
  } = useForm(exampleFeedbackSchema, {
    comment: '',
    rating: 5,
  }, handleSubmit);

  return (
    <FormContainer
      title="Submit Feedback"
      description="Share your thoughts on this document"
      onSubmit={onSubmit}
    >
      <FormTextarea
        name="comment"
        label="Your Feedback"
        placeholder="What do you think about this document?"
        value={values.comment || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.comment}
        touched={touched.comment}
        rows={4}
        maxLength={2000}
        hint="Be constructive and specific"
      />

      <FormSelect
        name="rating"
        label="Overall Rating"
        value={values.rating}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.rating}
        touched={touched.rating}
        required
        options={[
          { value: 5, label: '5 - Excellent' },
          { value: 4, label: '4 - Good' },
          { value: 3, label: '3 - Satisfactory' },
          { value: 2, label: '2 - Fair' },
          { value: 1, label: '1 - Poor' },
        ]}
      />

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={resetForm}
          className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
        >
          Clear
        </button>
        <FormSubmit loading={isSubmitting} fullWidth={false} className="flex-1">
          Submit Feedback
        </FormSubmit>
      </div>
    </FormContainer>
  );
}
