/**
 * ProfileForm - Example form showing all form component types
 */

import { FiUser, FiPhone, FiHome } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useForm } from '../../hooks/useForm';
import { profileSchema } from '../../schemas/auth.schema';
import {
  FormContainer,
  FormInput,
  FormTextarea,
  FormSelect,
  FormSubmit,
} from './index';
import { authService } from '../../services/authService';

const LEVEL_OPTIONS = [
  { value: '1st', label: '1st Year' },
  { value: '2nd', label: '2nd Year' },
  { value: '3rd', label: '3rd Year' },
  { value: '4th', label: '4th Year' },
];

const PROGRAM_OPTIONS = [
  { value: 'primary', label: 'Primary Education' },
  { value: 'secondary', label: 'Secondary Education' },
  { value: 'special', label: 'Special Education' },
];

export default function ProfileForm({ initialData, onSuccess }) {
  /**
   * Form submission handler
   */
  const handleSubmit = async (values) => {
    try {
      await authService.updateProfile(values);
      toast.success('Profile updated successfully!');
      if (onSuccess) onSuccess(values);
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to update profile';
      toast.error(message);
      throw err;
    }
  };

  /**
   * Initialize form with profile schema
   */
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: onSubmit,
  } = useForm(profileSchema, initialData || {}, handleSubmit);

  return (
    <FormContainer
      title="Edit Profile"
      description="Update your personal information"
      onSubmit={onSubmit}
      className="w-full max-w-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="firstName"
          label="First Name"
          type="text"
          placeholder="John"
          value={values.firstName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.firstName}
          touched={touched.firstName}
          required
          icon={FiUser}
        />

        <FormInput
          name="lastName"
          label="Last Name"
          type="text"
          placeholder="Doe"
          value={values.lastName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.lastName}
          touched={touched.lastName}
          required
          icon={FiUser}
        />

        <FormInput
          name="phone"
          label="Phone Number"
          type="tel"
          placeholder="+263 (1) 234-5678"
          value={values.phone || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phone}
          touched={touched.phone}
          icon={FiPhone}
        />

        <FormInput
          name="school"
          label="School / Institution"
          type="text"
          placeholder="Your school name"
          value={values.school || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.school}
          touched={touched.school}
          icon={FiHome}
        />

        <FormSelect
          name="program"
          label="Program"
          value={values.program || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.program}
          touched={touched.program}
          placeholder="Select your program"
          options={PROGRAM_OPTIONS}
        />

        <FormSelect
          name="level"
          label="Level / Year"
          value={values.level || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.level}
          touched={touched.level}
          placeholder="Select your year"
          options={LEVEL_OPTIONS}
        />

        <FormInput
          name="title"
          label="Title / Position"
          type="text"
          placeholder="e.g., Student Teacher"
          value={values.title || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.title}
          touched={touched.title}
          className="md:col-span-2"
        />

        <FormInput
          name="teachingSubject"
          label="Teaching Subject"
          type="text"
          placeholder="e.g., Mathematics"
          value={values.teachingSubject || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.teachingSubject}
          touched={touched.teachingSubject}
          className="md:col-span-2"
        />

        <FormTextarea
          name="topic"
          label="Topic / Focus Area"
          placeholder="What are you focusing on in your TP?"
          value={values.topic || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.topic}
          touched={touched.topic}
          rows={3}
          className="md:col-span-2"
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <FormSubmit loading={isSubmitting} fullWidth={false} className="flex-1">
          Save Changes
        </FormSubmit>
      </div>
    </FormContainer>
  );
}
