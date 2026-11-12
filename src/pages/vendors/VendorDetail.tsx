import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { showValidationErrors } from '@/lib/utils';
import type { AppDispatch, RootState } from '@/store/store';
import {
  fetchVendorById,
  updateVendor,
  clearVendor,
  deleteVendor,
} from '@/store/slices/vendorSlice';
import { vendorTypes } from '@/constants/vendorTypes';
import { convertToUTCFormat } from '@/lib/timeUtils';
import ConfirmModal from '@/components/ui/Modals/ConfirmModal';
import VendorDetailSkeleton from '@/components/Vendors/VendorDetailSkeleton';
import VendorDetailError from '@/components/Vendors/VendorDetailError';
import VendorPhotoUpload from '@/components/Vendors/VendorPhotoUpload';
import VendorBasicInfo from '@/components/Vendors/VendorBasicInfo';
import VendorWorkingHours from '@/components/Vendors/VendorWorkingHours';
import VendorUserAssignment from '@/components/Vendors/VendorUserAssignment';
import { compressImage } from '@/lib/imageCompression';

const VendorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('vendors');

  const {
    vendor,
    loading,
    error,
    errors,
    updating,
    updateError,
    updateErrors,
  } = useSelector((state: RootState) => state.vendor);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    openingTime: '',
    closeTime: '',
    type: '1',
    userId: '',
    userName: '',
    photo: null as File | null,
  });
  const [preview, setPreview] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Track if any changes have been made
  const hasChanges = useMemo(() => {
    if (!vendor) return false;

    // Check if photo was added
    if (formData.photo instanceof File) return true;

    // Check if photo was removed
    if (vendor.logo && !preview) return true;

    // Check other fields for changes
    return (
      vendor.businessName !== formData.name ||
      vendor.description !== (formData.description || '') ||
      vendor.workingHours.open !== formData.openingTime ||
      vendor.workingHours.close !== formData.closeTime ||
      String(vendorTypes.find((t) => t.label === vendor.type)?.value || '1') !==
        formData.type ||
      (vendor.userId || '') !== formData.userId
    );
  }, [vendor, formData, preview]);

  // Fetch vendor on mount only
  useEffect(() => {
    if (id && !hasFetched) {
      dispatch(fetchVendorById(id));
      setHasFetched(true);
    }
  }, [dispatch, id, hasFetched]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearVendor());
    };
  }, [dispatch]);

  // Update form data when vendor is loaded
  useEffect(() => {
    if (vendor && !isInitialized) {
      setFormData({
        name: vendor.businessName,
        description: vendor.description || '',
        openingTime: vendor.workingHours.open,
        closeTime: vendor.workingHours.close,
        type: String(
          vendorTypes.find((t) => t.label === vendor.type)?.value || '1'
        ),
        userId: vendor.userId || '',
        userName: vendor.ownerName || '',
        photo: null,
      });
      if (vendor.logo) {
        setPreview(vendor.logo);
      }
      setIsInitialized(true);
    }
  }, [vendor, isInitialized]);

  // Show error toast
  useEffect(() => {
    if (error) {
      showValidationErrors(
        'Failed to Load Vendor',
        errors?.length > 0 ? errors : error,
        'An error occurred while loading the vendor'
      );
    }
  }, [error, errors]);

  // Show update error toast
  useEffect(() => {
    if (updateError) {
      showValidationErrors(
        'Failed to Update Vendor',
        updateErrors?.length > 0 ? updateErrors : updateError,
        'An error occurred while updating the vendor'
      );
    }
  }, [updateError, updateErrors]);

  // Handle photo preview
  useEffect(() => {
    if (formData.photo instanceof File) {
      const url = URL.createObjectURL(formData.photo);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [formData.photo]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      try {
        const compressed = await compressImage(file);
        setFormData((prev) => ({ ...prev, photo: compressed }));
      } catch (error) {
        console.error('Image compression failed:', error);
        setFormData((prev) => ({ ...prev, photo: file }));
      }
    } else {
      setFormData((prev) => ({ ...prev, photo: null }));
    }
  };

  const handlePhotoRemove = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setPreview('');
    // Reset the file input
    const fileInput = document.getElementById(
      'vendor-photo'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleTimeChange = useCallback(
    (type: 'open' | 'close', time: string) => {
      setFormData((prev) => {
        // Only update if the value actually changed
        const currentTime = type === 'open' ? prev.openingTime : prev.closeTime;
        if (currentTime === time) return prev;

        return type === 'open'
          ? { ...prev, openingTime: time }
          : { ...prev, closeTime: time };
      });
    },
    []
  );

  const handleUserSelect = useCallback((userId: string, userName: string) => {
    setFormData((prev) => ({ ...prev, userId, userName }));
  }, []);

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error(t('createVendor.validation.error'), {
        description: t('createVendor.validation.nameRequired'),
      });
      return false;
    }
    if (!formData.description.trim()) {
      toast.error(t('createVendor.validation.error'), {
        description: t('createVendor.validation.descriptionRequired'),
      });
      return false;
    }
    if (!formData.openingTime) {
      toast.error(t('createVendor.validation.error'), {
        description: t('createVendor.validation.openingTimeRequired'),
      });
      return false;
    }
    if (!formData.closeTime) {
      toast.error(t('createVendor.validation.error'), {
        description: t('createVendor.validation.closingTimeRequired'),
      });
      return false;
    }
    if (!formData.userId.trim()) {
      toast.error(t('createVendor.validation.error'), {
        description: t('createVendor.validation.userRequired'),
      });
      return false;
    }

    // Validate time logic
    if (formData.openingTime >= formData.closeTime) {
      toast.error(t('createVendor.validation.error'), {
        description: t('createVendor.validation.timeLogicError'),
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!id) {
      toast.error(t('vendorDetail.error.missingId'), {
        description: t('vendorDetail.error.missingIdDescription'),
      });
      return;
    }

    const vendorData: {
      name: string;
      description: string;
      openingTime: string;
      closeTime: string;
      type: number;
      userId: string;
      ProfileImageUrl?: File;
    } = {
      name: formData.name,
      description: formData.description,
      openingTime: convertToUTCFormat(formData.openingTime),
      closeTime: convertToUTCFormat(formData.closeTime),
      type: parseInt(formData.type),
      userId: formData.userId,
    };

    // Only add ProfileImageUrl if user selected a new image file
    if (formData.photo instanceof File) {
      vendorData.ProfileImageUrl = formData.photo;
    }

    const result = await dispatch(updateVendor({ id, vendorData }));

    if (updateVendor.fulfilled.match(result)) {
      toast.success(t('vendorDetail.success.updated'), {
        description: t('vendorDetail.success.updatedDescription', {
          name: formData.name,
        }),
      });
      navigate('/vendors');
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    if (id) {
      const result = await dispatch(deleteVendor(id));
      if (deleteVendor.rejected.match(result)) {
        const payload = result.payload as
          | { error: string; errors: string[] }
          | undefined;
        showValidationErrors(
          t('vendorDetail.error.deleteFailed') || 'Failed to delete vendor',
          payload?.errors?.length ? payload.errors : payload?.error,
          'An error occurred while deleting the vendor'
        );
      } else {
        toast.success(t('vendorDetail.success.deleted'), {
          description: t('vendorDetail.success.deletedDescription'),
        });
        navigate('/vendors');
      }
    }
  };

  if (loading) {
    return <VendorDetailSkeleton />;
  }

  if (error || !vendor) {
    return (
      <VendorDetailError
        error={error || undefined}
        onBack={() => navigate(-1)}
      />
    );
  }

  return (
    <div className='w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] h-full flex flex-col -m-4 md:-m-6'>
      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24'>
        {/* Header */}
        <div>
          <Button variant='ghost' onClick={() => navigate(-1)}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            {t('vendorDetail.backToVendors')}
          </Button>
        </div>

        {/* Vendor Information Card */}
        <Card>
          <CardContent className='p-6'>
            <div className='flex flex-col md:flex-row gap-6'>
              <VendorPhotoUpload
                preview={preview}
                onPhotoChange={handlePhotoChange}
                onPhotoRemove={handlePhotoRemove}
                disabled={updating}
              />
              <VendorBasicInfo
                name={formData.name}
                description={formData.description}
                type={formData.type}
                vendorId={vendor._id}
                onInputChange={handleInputChange}
                disabled={updating}
              />
            </div>
          </CardContent>
        </Card>

        {/* Working Hours Card */}
        <VendorWorkingHours
          openingTime={formData.openingTime}
          closeTime={formData.closeTime}
          onInputChange={handleInputChange}
          onTimeChange={handleTimeChange}
          disabled={updating}
        />

        {/* User Assignment */}
        <VendorUserAssignment
          userId={formData.userId}
          userName={formData.userName}
          userEmail={vendor?.email}
          userPhone={vendor?.phoneNumber}
          userProfileImage={vendor?.userProfileImageUrl}
          onUserSelect={handleUserSelect}
        />
      </div>

      {/* Sticky Footer with Action Buttons */}
      <div className='sticky bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 px-4 md:px-6'>
        <div className='flex gap-2 justify-end'>
          <button
            onClick={handleDelete}
            className='px-4 py-2 rounded-md border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors'
          >
            {t('vendorDetail.actions.deleteVendor')}
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || updating}
            className='px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {updating
              ? t('vendorDetail.actions.saving')
              : t('vendorDetail.actions.saveChanges')}
          </button>
        </div>
      </div>

      <ConfirmModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={t('vendorDetail.confirmDelete.title')}
        description={t('vendorDetail.confirmDelete.description')}
        confirmLabel={t('vendorDetail.confirmDelete.confirm')}
        confirmType='danger'
        cancelLabel={t('vendorDetail.confirmDelete.cancel')}
        warning={t('vendorDetail.confirmDelete.warning')}
        changes={[
          {
            field: t('vendorDetail.confirmDelete.fieldName'),
            oldValue: vendor?.businessName || '',
            newValue: t('vendorDetail.confirmDelete.willBeDeleted'),
          },
        ]}
      />
    </div>
  );
};

export default VendorDetail;
