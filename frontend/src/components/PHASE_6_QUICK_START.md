/**
 * PHASE 6 - QUICK START GUIDE
 * 
 * This guide shows you how to quickly start creating Phase 6 components
 */

/**
 * ============================================================================
 * 1. COMPONENT STRUCTURE TEMPLATE
 * ============================================================================
 */

// File: frontend/src/components/YourComponent.jsx

/**
import { FiIcon } from 'react-icons/fi';
import { useApi } from '../../hooks/useApi';
import toast from 'react-hot-toast';

// Props interface documentation
// ComponentProps:
//   - prop1: string - What this prop does
//   - prop2: boolean - What this prop does
//   - onSuccess: Function - Callback on success

export default function YourComponent({ prop1, prop2 = false, onSuccess }) {
  // API calls
  const { data, isLoading, error } = useApi.get('/api/endpoint');

  // Handle errors
  if (error) {
    return <ErrorState error={error} />;
  }

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show empty state
  if (!data || data.length === 0) {
    return <EmptyState title="No data" />;
  }

  // Render content
  return (
    <div className="container">
      {/* Content */}
    </div>
  );
}
*/

/**
 * ============================================================================
 * 2. IMPORTING COMPONENTS & HOOKS
 * ============================================================================
 */

// Form Components
import {
  FormContainer,
  FormInput,
  FormTextarea,
  FormSelect,
  FormFile,
  FormCheckbox,
  FormSubmit,
} from '../../components/forms';

// UI Components
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';

// Hooks
import {
  useAuth,
  useApi,
  useForm,
  useModal,
  useLocalStorage,
} from '../../hooks';

// Services
import { documentService } from '../../services';

// Utilities
import { formatDate, formatFileSize } from '../../utils/formatters';
import { validateEmail } from '../../utils/validators';

// Constants
import { ROLES, PERMISSIONS } from '../../constants';

/**
 * ============================================================================
 * 3. EXAMPLE: CREATING A SIMPLE LIST COMPONENT
 * ============================================================================
 */

// File: frontend/src/components/DocumentList.jsx

/*
import { FiFile, FiDownload, FiTrash2 } from 'react-icons/fi';
import { useApi } from '../../hooks/useApi';
import { formatDate, formatFileSize } from '../../utils/formatters';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import ConfirmDialog from './ConfirmDialog';
import { useModal } from '../../hooks';
import toast from 'react-hot-toast';
import { documentService } from '../../services';

export default function DocumentList() {
  const { isOpen, open, close } = useModal();
  const [deleteId, setDeleteId] = useState(null);

  // Fetch documents
  const { data: documents, isLoading, refetch } = useApi.get('/api/documents');

  // Delete mutation
  const deleteDocument = async (id) => {
    try {
      await documentService.delete(id);
      toast.success('Document deleted');
      refetch();
      close();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!documents?.length) return <EmptyState title="No documents" />;

  return (
    <>
      <div className="grid gap-4">
        {documents.map(doc => (
          <div key={doc.id} className="p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <FiFile className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">{doc.title}</h3>
                  <p className="text-sm text-gray-600">
                    {formatFileSize(doc.file_size)} • {formatDate(doc.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <FiDownload className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setDeleteId(doc.id);
                    open();
                  }}
                  className="p-2 hover:bg-red-50 rounded"
                >
                  <FiTrash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={close}
        onConfirm={() => deleteDocument(deleteId)}
        title="Delete Document?"
        confirmVariant="danger"
      />
    </>
  );
}
*/

/**
 * ============================================================================
 * 4. EXAMPLE: CREATING A FORM COMPONENT
 * ============================================================================
 */

// File: frontend/src/components/CreateDocumentForm.jsx

/*
import { useForm } from '../../hooks/useForm';
import { documentUploadSchema } from '../../schemas/document.schema';
import { FormContainer, FormInput, FormSelect, FormFile, FormSubmit } from '../forms';
import { documentService } from '../../services';
import toast from 'react-hot-toast';

export default function CreateDocumentForm({ onSuccess }) {
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('category', values.category);
      formData.append('file', values.file);
      
      await documentService.upload(formData);
      toast.success('Document uploaded!');
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
      throw err;
    }
  };

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit: onSubmit } = useForm(
    documentUploadSchema,
    { title: '', category: '', file: null },
    handleSubmit
  );

  return (
    <FormContainer title="Upload Document" onSubmit={onSubmit}>
      <FormInput
        name="title"
        label="Title"
        value={values.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.title}
        touched={touched.title}
        required
      />
      
      <FormSelect
        name="category"
        label="Category"
        value={values.category}
        onChange={handleChange}
        options={[
          { value: 'scheme', label: 'Scheme of Work' },
          { value: 'lesson', label: 'Lesson Plan' },
        ]}
        required
      />

      <FormFile
        name="file"
        label="Select File"
        value={values.file}
        onChange={handleChange}
        error={errors.file}
        touched={touched.file}
        required
      />

      <FormSubmit loading={isSubmitting}>Upload</FormSubmit>
    </FormContainer>
  );
}
*/

/**
 * ============================================================================
 * 5. EXAMPLE: USING MODALS
 * ============================================================================
 */

/*
import { useState } from 'react';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';
import { useModal } from '../../hooks';

export default function MyPage() {
  const editModal = useModal();
  const deleteConfirm = useModal();
  const [selectedId, setSelectedId] = useState(null);

  return (
    <>
      <button onClick={editModal.open}>Edit</button>

      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Edit Item"
      >
        <p>Edit form here</p>
      </Modal>

      <button onClick={() => {
        setSelectedId(123);
        deleteConfirm.open();
      }}>Delete</button>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={deleteConfirm.close}
        onConfirm={() => console.log('Deleting', selectedId)}
        title="Delete?"
        confirmVariant="danger"
      />
    </>
  );
}
*/

/**
 * ============================================================================
 * 6. PHASE 6 QUICK TASKS
 * ============================================================================
 * 
 * START HERE to begin Phase 6:
 * 
 * 1. Wrap App.jsx with ErrorBoundary:
 *    import ErrorBoundary from './components/ErrorBoundary';
 *    
 *    <ErrorBoundary>
 *      <Router>...
 * 
 * 2. Create a StudentStats component (first dashboard component):
 *    - Fetch student stats from /api/statistics/student
 *    - Show pending, approved, rejected, reviewed counts
 *    - Use LoadingSpinner while loading
 *    - Use EmptyState if no stats
 * 
 * 3. Create a DocumentCard component:
 *    - Take document object as prop
 *    - Show title, category, status
 *    - Download and delete buttons
 *    - Use ConfirmDialog for delete
 * 
 * 4. Refactor StudentDashboard to use new components:
 *    <StudentDashboard>
 *      <StudentStats />
 *      <DocumentList />
 *    </StudentDashboard>
 * 
 * 5. Create ProfileHeader component:
 *    - Show user avatar, name, role
 *    - Use from Profile.jsx
 * 
 * 6. Refactor Profile.jsx to use tabs:
 *    - Tab 1: ProfileForm
 *    - Tab 2: ChangePasswordForm
 *    - Tab 3: ProfilePreferences
 */

export default null; // Documentation file
