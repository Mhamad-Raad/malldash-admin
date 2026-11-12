import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserDetailHeader from '@/components/Users/UserDetail/UserDetailHeader';
import UserProfileCard from '@/components/Users/UserDetail/UserProfileCard';
import ContactInfoCard from '@/components/Users/UserDetail/ContactInfoCard';
import LocationRoleCard from '@/components/Users/UserDetail/LocationRoleCard';
import SecurityCard from '@/components/Users/UserDetail/SecurityCard';
import UserDetailSkeleton from '@/components/Users/UserDetail/UserDetailSkeloton';
import UserErrorCard from '@/components/Users/UserDetail/UserErrorCard';
import ConfirmModal, {
  type ChangeDetail,
} from '@/components/ui/Modals/ConfirmModal';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import {
  fetchUserById,
  clearUser,
  updateUser,
  deleteUser,
} from '@/store/slices/userSlice';
import { toast } from 'sonner';
import { showValidationErrors } from '@/lib/utils';
import { initialUser } from '@/constants/Users';
import roles from '@/constants/roles';

import type { UserFormData } from '@/interfaces/Users.interface';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {
    user,
    luser: loading,
    euser: error,
    updating,
    updatingError,
    updatingErrors,
    deleting,
    deletingError,
    deletingErrors,
  } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<UserFormData>({
    ...initialUser,
    imageFile: undefined,
  });

  // Track if any changes have been made
  const hasChanges = useMemo(() => {
    if (!user || !user._id) return false;

    // Check if password is being changed
    if (password && confirmPassword && password === confirmPassword)
      return true;

    // Check if image file was added
    if (formData.imageFile instanceof File) return true;

    // Check if image was removed (user had an image, but now it's cleared)
    if (
      user.profileImageUrl &&
      !formData.profileImageUrl &&
      !formData.imageFile
    )
      return true;

    // Check other fields for changes
    return (
      user.firstName !== formData.firstName ||
      user.lastName !== formData.lastName ||
      user.email !== formData.email ||
      user.phoneNumber !== formData.phoneNumber ||
      user.role !== formData.role
    );
  }, [user, formData, password, confirmPassword]);

  const changes = useMemo((): ChangeDetail[] => {
    if (!user || !user._id) return [];
    const changesList: ChangeDetail[] = [];
    const fieldLabels: Record<string, string> = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phoneNumber: 'Phone Number',
      role: 'Role',
    };

    // Check for image change
    if (formData.imageFile instanceof File) {
      changesList.push({
        field: 'Profile Image',
        oldValue: user.profileImageUrl ? 'Current image' : 'No image',
        newValue: formData.imageFile.name,
      });
    } else if (user.profileImageUrl && !formData.profileImageUrl) {
      // Image was removed
      changesList.push({
        field: 'Profile Image',
        oldValue: 'Current image',
        newValue: 'Removed',
      });
    }

    // Check password change
    if (password && confirmPassword && password === confirmPassword) {
      changesList.push({
        field: 'Password',
        oldValue: '••••••••',
        newValue: 'New password set',
      });
    }

    // Check other fields
    (
      ['firstName', 'lastName', 'email', 'phoneNumber', 'role'] as const
    ).forEach((key) => {
      if (user[key] !== formData[key]) {
        let oldVal = user[key];
        let newVal = formData[key];
        if (
          key === 'role' &&
          typeof oldVal === 'number' &&
          typeof newVal === 'number'
        ) {
          oldVal = roles[oldVal] || `Role ${oldVal}`;
          newVal = roles[newVal] || `Role ${newVal}`;
        }
        changesList.push({
          field: fieldLabels[key],
          oldValue: String(oldVal ?? ''),
          newValue: String(newVal ?? ''),
        });
      }
    });
    return changesList;
  }, [user, formData, password, confirmPassword]);

  const handleInputChange = (
    field: keyof UserFormData,
    value: string | number | File
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
    return () => {
      dispatch(clearUser());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.email ?? '',
        phoneNumber: user.phoneNumber ?? '',
        buildingName: user.buildingName ?? '',
        profileImageUrl: user.profileImageUrl ?? '',
        imageFile: undefined, // Always clear file on user load
      });
    }
  }, [user]);

  useEffect(() => {
    if (updatingError) {
      showValidationErrors(
        'Failed to update user',
        updatingErrors?.length > 0 ? updatingErrors : updatingError,
        'An error occurred while updating the user'
      );
      setShowUpdateModal(false);
    }
    if (!updating && showUpdateModal && !updatingError) {
      setShowUpdateModal(false);
      toast.success('User updated successfully!');
      // Clear password fields after successful update
      setPassword('');
      setConfirmPassword('');
    }
  }, [updating, updatingError, updatingErrors]);

  useEffect(() => {
    if (deletingError) {
      showValidationErrors(
        'Failed to delete user',
        deletingErrors?.length > 0 ? deletingErrors : deletingError,
        'An error occurred while deleting the user'
      );
    }
    if (!deleting && showDeleteModal && !deletingError) {
      setShowDeleteModal(false);
      toast.success('User deleted!');
      navigate('/users');
    }
  }, [deleting, deletingError, deletingErrors, navigate]);

  const handletoggleUpdateModal = () => {
    if (!hasChanges) return;
    setShowUpdateModal((v) => !v);
  };
  const handletoggleDeleteModal = () => setShowDeleteModal((v) => !v);

  const handleUpdateUser = async () => {
    // Include password in update if it's set and matches confirmation
    const updateData = {
      ...formData,
      ...(password && confirmPassword && password === confirmPassword
        ? { password }
        : {}),
    };
    await dispatch(updateUser({ id: id || user._id, update: updateData }));
  };

  const handleDeleteUser = async () => {
    await dispatch(deleteUser(id || user._id));
  };

  if (error) return <UserErrorCard error={error} />;
  if (loading) return <UserDetailSkeleton />;

  return (
    <div className='w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] h-full flex flex-col -m-4 md:-m-6'>
      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24'>
        <UserDetailHeader onBack={() => navigate(-1)} hasChanges={hasChanges} />
        <UserProfileCard
          formData={formData}
          onInputChange={handleInputChange}
        />
        <div className='grid gap-6 lg:grid-cols-2'>
          <ContactInfoCard
            formData={formData}
            onInputChange={handleInputChange}
          />
          <LocationRoleCard
            formData={formData}
            onInputChange={handleInputChange}
          />
        </div>
        <SecurityCard
          password={password}
          confirmPassword={confirmPassword}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
        />
      </div>

      {/* Sticky Footer with Action Buttons */}
      <div className='sticky bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 px-4 md:px-6'>
        <div className='flex gap-2 justify-end'>
          <button
            onClick={handletoggleDeleteModal}
            className='px-4 py-2 rounded-md border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors'
          >
            Delete User
          </button>
          <button
            onClick={handletoggleUpdateModal}
            disabled={!hasChanges}
            className='px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Save Changes
          </button>
        </div>
      </div>

      <ConfirmModal
        open={showUpdateModal}
        title='Update User'
        description='Are you sure you want to update this user?'
        userName={`${user.firstName} ${user.lastName}`}
        confirmType='warning'
        confirmLabel='Update'
        cancelLabel='Cancel'
        onCancel={handletoggleUpdateModal}
        onConfirm={handleUpdateUser}
        changes={changes}
      />
      <ConfirmModal
        open={showDeleteModal}
        title='Delete User'
        description='Are you sure you want to delete this user?'
        userName={`${user.firstName} ${user.lastName}`}
        warning='WARNING! This action cannot be undone.'
        confirmType='danger'
        confirmLabel='Delete'
        cancelLabel='Cancel'
        onCancel={handletoggleDeleteModal}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};

export default UserDetail;
