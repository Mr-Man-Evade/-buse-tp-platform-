/**
 * LoginForm - Example of form system usage with Zod validation
 * Shows how to integrate useForm hook with form components
 */

import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { loginSchema } from '../../schemas/auth.schema';
import { FormContainer, FormInput, FormSubmit } from './index';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { useState } from 'react';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Form submission handler
   */
  const handleSubmit = async (values) => {
    try {
      const response = await authService.login(values.email, values.password);
      const { token, user } = response;

      // Update auth context - Login.jsx will handle redirect via useEffect
      login(token, user, user.role);

      // Show success message
      toast.success('Login successful!');
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed. Please check your credentials.';
      toast.error(message);
      throw err; // Re-throw to show error in form
    }
  };

  /**
   * Initialize form with Zod schema
   */
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: onSubmit,
  } = useForm(loginSchema, { email: '', password: '' }, handleSubmit);

  return (
    <FormContainer
      title="Sign In"
      description="Enter your credentials to access your account"
      onSubmit={onSubmit}
      className="w-full max-w-md"
    >
      <FormInput
        name="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        touched={touched.email}
        required
        icon={FiMail}
      />

      <FormInput
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.password}
        touched={touched.password}
        required
        icon={FiLock}
      />

      <div className="flex items-center justify-between mb-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-blue-600 rounded" />
          <span className="text-gray-600">Remember me</span>
        </label>
        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          Forgot password?
        </button>
      </div>

      <FormSubmit loading={isSubmitting} fullWidth>
        Sign In
      </FormSubmit>

      <p className="text-center text-sm text-gray-600 mt-4">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-blue-600 hover:underline font-medium"
        >
          Create one
        </button>
      </p>
    </FormContainer>
  );
}
