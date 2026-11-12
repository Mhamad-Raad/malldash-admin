import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Store, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { showValidationErrors } from '@/lib/utils';
import TimelineSlider from '@/components/Vendors/TimelineSlider';
import VendorPhotoUpload from '@/components/Vendors/VendorPhotoUpload';
import VendorBasicInfo from '@/components/Vendors/VendorBasicInfo';
import VendorUserAssignment from '@/components/Vendors/VendorUserAssignment';

import { vendorTypes } from '@/constants/vendorTypes';
import { createVendor } from '@/data/Vendor';
import { convertToUTCFormat } from '@/lib/timeUtils';
import { compressImage } from '@/lib/imageCompression';

const CreateVendor = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('vendors');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    openingTime: '09:00',
    closeTime: '17:00',
    type: '1',
    userId: '',
    userName: '',
    photo: null as File | null,
  });

  useEffect(() => {
    if (formData.photo instanceof File) {
      const url = URL.createObjectURL(formData.photo);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview('');
    }
  }, [formData.photo]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTimeChange = (type: 'open' | 'close', time: string) => {
    setFormData((prev) => ({
      ...prev,
      [type === 'open' ? 'openingTime' : 'closeTime']: time,
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
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!', formData);

    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the data to send to API with UTC time format
      const vendorData = {
        name: formData.name,
        description: formData.description,
        openingTime: convertToUTCFormat(formData.openingTime),
        closeTime: convertToUTCFormat(formData.closeTime),
        type: parseInt(formData.type),
        userId: formData.userId,
        ...(formData.photo ? { ProfileImageUrl: formData.photo } : {}),
      };

      console.log('Sending vendor data:', vendorData);
      const res = await createVendor(vendorData);
      console.log('Response:', res);

      if (res.error || res.errors?.length > 0) {
        showValidationErrors(
          t('createVendor.error.title'),
          res.errors?.length > 0 ? res.errors : res.error,
          t('createVendor.error.description')
        );
      } else {
        toast.success(t('createVendor.success.title'), {
          description: t('createVendor.success.description', { name: formData.name }),
        });
        navigate('/vendors');
      }
    } catch (error) {
      console.error('Error creating vendor:', error);
      toast.error(t('createVendor.error.title'), {
        description: t('createVendor.error.unexpected'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/vendors');
  };

  return (
    <div className='w-full h-full flex flex-col gap-6 p-6 overflow-y-auto'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button
          variant='outline'
          size='icon'
          onClick={handleCancel}
          className='h-10 w-10'
        >
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            {t('createVendor.title')}
          </h1>
          <p className='text-muted-foreground'>
            {t('createVendor.subtitle')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Main Form */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Store className='h-5 w-5' />
                  {t('createVendor.basicInfo.title')}
                </CardTitle>
                <CardDescription>
                  {t('createVendor.basicInfo.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='flex flex-col md:flex-row gap-6'>
                  <VendorPhotoUpload
                    preview={preview}
                    onPhotoChange={handlePhotoChange}
                    onPhotoRemove={handlePhotoRemove}
                    disabled={isSubmitting}
                  />
                  <VendorBasicInfo
                    name={formData.name}
                    description={formData.description}
                    type={formData.type}
                    vendorId=""
                    onInputChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card className="overflow-hidden">
              <CardHeader className="border-b">
                <CardTitle className='flex items-center gap-2'>
                  <Clock className='h-5 w-5 text-primary' />
                  <div>
                    <div className="text-lg font-semibold">{t('createVendor.workingHours.title')}</div>
                    <div className="text-xs font-normal text-muted-foreground">{t('createVendor.workingHours.subtitle')}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6 pt-6'>
                {/* Time Inputs with Icons */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='openingTime' className='text-sm font-medium'>
                      {t('createVendor.workingHours.openingTime')} <span className='text-destructive'>*</span>
                    </Label>
                    <div className='relative'>
                      <Input
                        id='openingTime'
                        type='time'
                        value={formData.openingTime}
                        onChange={(e) => handleInputChange('openingTime', e.target.value)}
                        disabled={isSubmitting}
                        className='pl-10 h-11 text-base'
                        required
                      />
                      <Clock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='closeTime' className='text-sm font-medium'>
                      {t('createVendor.workingHours.closingTime')} <span className='text-destructive'>*</span>
                    </Label>
                    <div className='relative'>
                      <Input
                        id='closeTime'
                        type='time'
                        value={formData.closeTime}
                        onChange={(e) => handleInputChange('closeTime', e.target.value)}
                        disabled={isSubmitting}
                        className='pl-10 h-11 text-base'
                        required
                      />
                      <Clock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
                    </div>
                  </div>
                </div>

                {/* Visual Schedule Display */}
                {formData.openingTime && formData.closeTime && (
                  <TimelineSlider
                    openingTime={formData.openingTime}
                    closeTime={formData.closeTime}
                    onTimeChange={handleTimeChange}
                    disabled={isSubmitting}
                  />
                )}

                {/* Validation message */}
                {formData.openingTime && formData.closeTime && formData.openingTime >= formData.closeTime && (
                  <div className='p-3 rounded-lg bg-destructive/10 border border-destructive/20'>
                    <p className='text-sm text-destructive font-medium'>
                      {t('createVendor.workingHours.validationError')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Assignment */}
            <VendorUserAssignment
              userId={formData.userId}
              userName={formData.userName}
              onUserSelect={(userId, userName) => {
                setFormData((prev) => ({
                  ...prev,
                  userId,
                  userName,
                }));
              }}
            />
          </div>

          {/* Sidebar - Preview & Actions */}
          <div className='space-y-6'>
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <FileText className='h-5 w-5' />
                  {t('createVendor.preview.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {t('createVendor.preview.vendorName')}
                  </p>
                  <p className='text-sm font-semibold'>
                    {formData.name || t('createVendor.preview.notSet')}
                  </p>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {t('createVendor.preview.type')}
                  </p>
                  <p className='text-sm'>
                    {(() => {
                      const typeObj = vendorTypes.find((vt) => vt.value === parseInt(formData.type));
                      return typeObj ? t(`types.${typeObj.label.toLowerCase()}`) : t('createVendor.preview.notSelected');
                    })()}
                  </p>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {t('createVendor.preview.hours')}
                  </p>
                  <p className='text-sm'>
                    {formData.openingTime && formData.closeTime
                      ? `${formData.openingTime} - ${formData.closeTime}`
                      : t('createVendor.preview.notSet')}
                  </p>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {t('createVendor.preview.assignedUser')}
                  </p>
                  <p className='text-sm'>
                    {formData.userName || t('createVendor.preview.notAssigned')}
                  </p>
                  {formData.userId && (
                    <p className='text-xs font-mono text-muted-foreground'>
                      ID: {formData.userId}
                    </p>
                  )}
                </div>
                {formData.photo && (
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      {t('createVendor.preview.logoImage')}
                    </p>
                    <div className='w-full h-32 rounded-lg bg-muted flex items-center justify-center border overflow-hidden'>
                      <img
                        src={preview}
                        alt='Vendor preview'
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className='pt-6 space-y-3'>
                <Button
                  type='submit'
                  className='w-full'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('createVendor.actions.creating') : t('createVendor.actions.create')}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full'
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  {t('createVendor.actions.cancel')}
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className='bg-muted/50'>
              <CardContent className='pt-6'>
                <p className='text-sm text-muted-foreground'>
                  <span className='font-medium'>{t('createVendor.note')}</span> {t('createVendor.noteMessage')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateVendor;
