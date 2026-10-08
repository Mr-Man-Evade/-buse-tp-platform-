/**
 * DocumentUploadForm - Example of file upload with validation
 */

import { FiFile } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useForm } from '../../hooks/useForm';
import { documentUploadSchema } from '../../schemas/document.schema';
import {
  FormContainer,
  FormInput,
  FormTextarea,
  FormSelect,
  FormFile,
  FormSubmit,
} from './index';
import { documentService } from '../../services/documentService';
import { DOCUMENT_CATEGORIES } from '../../constants/statuses';

const CATEGORY_OPTIONS = [
  { value: DOCUMENT_CATEGORIES.RETURN_SLIP, label: 'Return Slip' },
  { value: DOCUMENT_CATEGORIES.SCHEME_OF_WORK, label: 'Scheme of Work' },
  { value: DOCUMENT_CATEGORIES.DAILY_LESSON_PLAN, label: 'Daily Lesson Plan' },
  { value: DOCUMENT_CATEGORIES.EVIDENCE, label: 'Evidence' },
  { value: DOCUMENT_CATEGORIES.REFLECTION, label: 'Reflection' },
  { value: DOCUMENT_CATEGORIES.GENERAL, label: 'General' },
];

export default function DocumentUploadForm({ onSuccess, onCancel }) {
  /**
   * Form submission handler
   */
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description || '');
      formData.append('category', values.category);
      if (values.dueDate) {
        formData.append('dueDate', values.dueDate);
      }
      formData.append('file', values.file);

      await documentService.upload(formData);
      toast.success('Document uploaded successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to upload document';
      toast.error(message);
      throw err;
    }
  };

  /**
   * Initialize form with document schema
   */
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: onSubmit,
  } = useForm(documentUploadSchema, {
    title: '',
    description: '',
    category: '',
    dueDate: '',
    file: null,
  }, handleSubmit);

  return (
    <FormContainer
      title="Upload Document"
      description="Upload a teaching practice document"
      onSubmit={onSubmit}
      className="w-full max-w-2xl"
    >
      <FormInput
        name="title"
        label="Document Title"
        type="text"
        placeholder="e.g., Lesson Plan - Chapter 5"
        value={values.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.title}
        touched={touched.title}
        required
        hint="Give your document a descriptive title"
      />

      <FormSelect
        name="category"
        label="Document Category"
        value={values.category}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.category}
        touched={touched.category}
        placeholder="Select a category"
        options={CATEGORY_OPTIONS}
        required
      />

      <FormTextarea
        name="description"
        label="Description"
        placeholder="Add any additional notes or context about this document"
        value={values.description || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description}
        touched={touched.description}
        rows={3}
        maxLength={1000}
      />

      <FormInput
        name="dueDate"
        label="Due Date (Optional)"
        type="date"
        value={values.dueDate || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.dueDate}
        touched={touched.dueDate}
      />

      <FormFile
        name="file"
        label="Select File"
        value={values.file}
        onChange={handleChange}
        error={errors.file}
        touched={touched.file}
        required
        icon={FiFile}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
        hint="PDF, Word, Excel, or Image files (max 10MB)"
      />

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <FormSubmit loading={isSubmitting} fullWidth={false} className="flex-1">
          Upload Document
        </FormSubmit>
      </div>
    </FormContainer>
  );
}
