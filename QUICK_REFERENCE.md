# Quick Reference: Frontend Architecture Cheat Sheet

## Import Patterns

```javascript
// Form Components
import { FormInput, FormSelect, FormSubmit } from '../components/forms';

// UI Components  
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

// Hooks
import { useAuth, useApi, useForm, useModal } from '../hooks';

// Services
import { authService, documentService } from '../services';

// Utils
import { formatDate, validateEmail } from '../utils';

// Constants
import { ROLES, PERMISSIONS } from '../constants';
```

## Common Code Patterns

### 1. Authentication Page
```javascript
import { useForm } from '../hooks/useForm';
import { loginSchema } from '../schemas/auth.schema';
import { FormContainer, FormInput, FormSubmit } from '../components/forms';
import { authService } from '../services';
import { useAuth } from '../hooks';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values) => {
    try {
      const { token, user } = await authService.login(values);
      login(token, user, user.role);
      toast.success('Logged in!');
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
      throw err;
    }
  };

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit: onSubmit } = useForm(
    loginSchema,
    { email: '', password: '' },
    handleSubmit
  );

  return (
    <FormContainer title="Login" onSubmit={onSubmit}>
      <FormInput name="email" label="Email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} touched={touched.email} required />
      <FormInput name="password" label="Password" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} touched={touched.password} required />
      <FormSubmit loading={isSubmitting}>Login</FormSubmit>
    </FormContainer>
  );
}
```

### 2. Data List with Loading & Empty States
```javascript
import { useApi } from '../hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { FiFile } from 'react-icons/fi';

export default function DocumentList() {
  const { data: documents, isLoading } = useApi.get('/api/documents');

  if (isLoading) return <LoadingSpinner message="Loading documents..." />;
  if (!documents?.length) return <EmptyState icon={FiFile} title="No documents" description="Upload your first document" />;

  return (
    <div className="grid gap-4">
      {documents.map(doc => (
        <div key={doc.id} className="p-4 border rounded-lg">{doc.title}</div>
      ))}
    </div>
  );
}
```

### 3. Confirmation Dialog
```javascript
import ConfirmDialog from '../components/ConfirmDialog';
import { useModal } from '../hooks';
import toast from 'react-hot-toast';

export default function DocumentCard({ document, onDelete }) {
  const confirm = useModal();

  const handleDelete = async () => {
    try {
      await documentService.delete(document.id);
      toast.success('Deleted!');
      onDelete();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <>
      <button onClick={confirm.open} className="text-red-600">Delete</button>
      
      <ConfirmDialog
        isOpen={confirm.isOpen}
        onClose={confirm.close}
        onConfirm={handleDelete}
        title="Delete Document?"
        message={`Are you sure you want to delete "${document.title}"?`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </>
  );
}
```

### 4. Form Modal
```javascript
import Modal from '../components/Modal';
import { useModal } from '../hooks';
import { FormContainer, FormInput, FormSubmit } from '../components/forms';
import { useForm } from '../hooks/useForm';
import { profileSchema } from '../schemas/auth.schema';

export default function EditProfileButton({ onSuccess }) {
  const modal = useModal();

  const handleSubmit = async (values) => {
    await authService.updateProfile(values);
    onSuccess();
    modal.close();
  };

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit: onSubmit } = useForm(
    profileSchema,
    { firstName: '', lastName: '' },
    handleSubmit
  );

  return (
    <>
      <button onClick={modal.open}>Edit Profile</button>
      
      <Modal isOpen={modal.isOpen} onClose={modal.close} title="Edit Profile">
        <FormContainer onSubmit={onSubmit}>
          <FormInput name="firstName" label="First Name" value={values.firstName} onChange={handleChange} onBlur={handleBlur} error={errors.firstName} touched={touched.firstName} required />
          <FormSubmit loading={isSubmitting}>Save</FormSubmit>
        </FormContainer>
      </Modal>
    </>
  );
}
```

### 5. Protected Route
```javascript
import ProtectedRoute from '../components/ProtectedRoute';
import { ROLES } from '../constants';

// In App.jsx
<Routes>
  <Route path="/" element={<Navigate to="/dashboard" />} />
  <Route path="/login" element={<LoginPage />} />
  
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  
  <Route
    path="/student/*"
    element={
      <ProtectedRoute requiredRole={ROLES.STUDENT}>
        <StudentDashboard />
      </ProtectedRoute>
    }
  />
  
  <Route
    path="/admin/*"
    element={
      <ProtectedRoute requiredRole={[ROLES.COORDINATOR, ROLES.ADMIN]} requiredPermission="manage_users">
        <AdminDashboard />
      </ProtectedRoute>
    }
  />
</Routes>
```

## Hook Usage Examples

### useAuth
```javascript
const { user, token, userRole, isAuthenticated, login, logout, hasRole, updateUser } = useAuth();

if (!isAuthenticated) return <Navigate to="/login" />;
if (!user.hasRole(ROLES.STUDENT)) return <Navigate to="/unauthorized" />;
```

### useForm
```javascript
const { values, errors, touched, isSubmitting, isDirty, handleChange, handleBlur, handleSubmit, resetForm, setFieldValue } = useForm(
  schema,
  initialValues,
  onSubmit
);

// Use in form
<FormInput value={values.email} onChange={handleChange} error={errors.email} touched={touched.email} />
<button onClick={() => setFieldValue('field', 'value')}>Set Field</button>
<button onClick={resetForm}>Reset</button>
```

### useApi
```javascript
// GET request
const { data, isLoading, error, refetch } = useApi.get('/api/documents');

// POST request
const { mutate: createDoc, isLoading } = useApi.post('/api/documents', {
  onSuccess: () => toast.success('Created!'),
  onError: () => toast.error('Failed!'),
});

// Trigger mutation
<button onClick={() => createDoc({ title: 'New Doc' })}>Create</button>

// Convenience wrappers
const { data: docs } = useGet('/api/documents');
const { mutate: postFeedback } = usePost('/api/feedback');
const { mutate: updateUser } = usePut('/api/users/me');
const { mutate: deleteDoc } = useDelete('/api/documents/:id');
```

### useModal
```javascript
const { isOpen, open, close, toggle } = useModal();

<button onClick={open}>Open Modal</button>
<Modal isOpen={isOpen} onClose={close}>Content</Modal>
```

## Quick Constants Reference

```javascript
// Roles
import { ROLES } from '../constants';
// ROLES.STUDENT, ROLES.MENTOR, ROLES.SUPERVISOR, ROLES.COORDINATOR, ROLES.ADMIN

// Permissions
import { PERMISSIONS } from '../constants';
// PERMISSIONS[ROLES.STUDENT].read_documents, etc.

// Statuses
import { DOCUMENT_STATUSES, MESSAGE_STATUSES } from '../constants/statuses';
// DOCUMENT_STATUSES.PENDING, DOCUMENT_STATUSES.APPROVED, etc.

// Routes
import { ROUTES } from '../constants/routes';
// ROUTES.LOGIN, ROUTES.DASHBOARD, etc.

// API
import { API_ENDPOINTS } from '../constants/api';
// API_ENDPOINTS.AUTH.LOGIN, API_ENDPOINTS.DOCUMENTS.UPLOAD, etc.
```

## Common Utilities

```javascript
import { formatDate, formatFileSize, capitalizeWords, getInitials } from '../utils/formatters';
import { validateEmail, validatePassword, validateFileSize } from '../utils/validators';
import { deepClone, mergeObjects, isEmpty } from '../utils';

formatDate(new Date(), 'MMM DD, YYYY')                    // 'Jan 15, 2024'
formatFileSize(1048576)                                   // '1 MB'
capitalizeWords('hello world')                            // 'Hello World'
getInitials('John Doe')                                   // 'JD'
validateEmail('test@example.com')                         // true/false
validatePassword('P@ssw0rd')                              // { isValid, strength, errors }
validateFileSize(file, 10 * 1024 * 1024)                  // true/false
deepClone({ a: { b: 1 } })                                // { a: { b: 1 } }
isEmpty({})                                               // true
```

## Error Handling

```javascript
import { AppError, ValidationError, AuthError } from '../utils/errors';
import { parseApiError, getUserErrorMessage } from '../utils/errors';

try {
  await authService.login(values);
} catch (err) {
  const userMessage = getUserErrorMessage(err);
  toast.error(userMessage);
}

// In services
if (!response.ok) {
  throw new AppError('Failed to fetch', response.status);
}
```

---

**For more details, see**: 
- FORM_GUIDE.md - Form creation patterns
- PHASE_6_QUICK_START.md - Component creation
- PHASE_6_PLAN.md - Overall Phase 6 strategy
- PHASE_5_COMPLETION_SUMMARY.md - Architecture overview
