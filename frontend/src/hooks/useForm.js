/**
 * useForm Hook - Form state management with Zod validation
 */

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook for form handling with Zod validation
 * Usage: const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(schema, initialValues, onSubmit);
 */
export const useForm = (schema, initialValues, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  /**
   * Validate form with Zod schema
   */
  const validateForm = useCallback(async (valuesToValidate) => {
    try {
      await schema.parseAsync(valuesToValidate);
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      if (error.errors) {
        error.errors.forEach(err => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  }, [schema]);

  /**
   * Validate single field
   */
  const validateField = useCallback(async (name, value) => {
    try {
      // Create a partial object for field validation
      const fieldSchema = schema.pick({ [name]: true });
      await fieldSchema.parseAsync({ [name]: value });
      
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error.errors) {
        setErrors(prev => ({
          ...prev,
          [name]: error.errors[0].message,
        }));
      }
      return false;
    }
  }, [schema]);

  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({
      ...prev,
      [name]: newValue,
    }));

    setIsDirty(true);
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate field on change (if already touched)
    if (touched[name]) {
      validateField(name, newValue);
    }
  }, [touched, validateField]);

  /**
   * Handle field blur
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, values[name]);
  }, [values, validateField]);

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsDirty(false);
  }, [initialValues]);

  /**
   * Set field value
   */
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);
  }, []);

  /**
   * Set field error
   */
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  /**
   * Set multiple errors
   */
  const setFormErrors = useCallback((formErrors) => {
    setErrors(formErrors);
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate entire form
      const isValid = await validateForm(values);

      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      // Call submission handler
      await onSubmit(values);

      // Reset dirty flag on successful submit
      setIsDirty(false);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFormErrors,
    resetForm,
    validateForm,
    validateField,
  };
};

export default useForm;
