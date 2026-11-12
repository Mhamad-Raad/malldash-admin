import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, Lock, Image as ImageIcon, X } from 'lucide-react';
import roles from '@/constants/roles';
import { compressImage } from '@/lib/imageCompression';

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
};

type CustomerFormProps = {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    role: number;
    buildingId: string;
    floorId: string;
    apartmentId: string;
    photo?: File | null;
  };
  onInputChange: (field: string, value: unknown) => void;
  errors?: FieldErrors;
};

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className='text-sm text-destructive mt-1'>{message}</p>;
};

export default function CustomerForm({
  formData,
  onInputChange,
  errors = {},
}: CustomerFormProps) {
  const { t } = useTranslation('users');
  const [preview, setPreview] = useState<string>('');

  const translateRole = (role: string): string => {
    const roleMap: { [key: string]: string } = {
      SuperAdmin: t('roles.superAdmin'),
      Admin: t('roles.admin'),
      Vendor: t('roles.vendor'),
      Tenant: t('roles.tenant'),
      Driver: t('roles.driver'), // Assuming driver is added to translation or fallback
    };
    return roleMap[role] || role;
  };

  useEffect(() => {
    if (formData.photo instanceof File) {
      const url = URL.createObjectURL(formData.photo);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview('');
    }
  }, [formData.photo]);

  return (
    <div className='space-y-8'>
      {/* Profile Picture & Name Section */}
      <div className='flex flex-col md:flex-row items-start gap-6 p-6 bg-muted/30 rounded-lg border'>
        <div className='w-32 h-32 md:w-36 md:h-36 rounded-full shrink-0 self-center md:self-start relative'>
          <input
            id='customer-photo'
            type='file'
            accept='image/*'
            className='hidden'
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  const compressed = await compressImage(file);
                  onInputChange('photo', compressed);
                } catch (error) {
                  console.error('Image compression failed:', error);
                  onInputChange('photo', file);
                }
              } else {
                onInputChange('photo', null);
              }
            }}
          />
          <label
            htmlFor='customer-photo'
            className='w-full h-full rounded-full bg-background flex items-center justify-center border-2 border-dashed border-muted-foreground/25 overflow-hidden cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all group'
          >
            {preview ? (
              <img
                src={preview}
                alt='Preview'
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='flex flex-col items-center gap-2'>
                <ImageIcon className='size-12 text-muted-foreground/50 group-hover:text-primary/70 transition-colors' />
                <span className='text-xs text-muted-foreground'>
                  {t('forms.uploadPhoto')}
                </span>
              </div>
            )}
          </label>
          {preview && (
            <button
              type='button'
              onClick={(e) => {
                e.preventDefault();
                onInputChange('photo', null);
              }}
              className='absolute top-1 right-1 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-lg z-10'
            >
              <X className='size-4' />
            </button>
          )}
        </div>
        <div className='flex-1 space-y-4 w-full'>
          <div className='space-y-2'>
            <Label htmlFor='customer-firstname' className='text-sm font-medium'>
              {t('forms.firstName')} <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='customer-firstname'
              placeholder={t('forms.firstNamePlaceholder')}
              value={formData.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              className='h-11'
              aria-invalid={!!errors.firstName}
            />
            <FieldError message={errors.firstName} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='customer-lastname' className='text-sm font-medium'>
              {t('forms.lastName')} <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='customer-lastname'
              placeholder={t('forms.lastNamePlaceholder')}
              value={formData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              className='h-11'
              aria-invalid={!!errors.lastName}
            />
            <FieldError message={errors.lastName} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='customer-role' className='text-sm font-medium'>
              {t('forms.userRole')} <span className='text-destructive'>*</span>
            </Label>
            <Select
              value={formData.role.toString()}
              onValueChange={(value) => onInputChange('role', parseInt(value))}
            >
              <SelectTrigger id='customer-role' className='h-11'>
                <SelectValue placeholder={t('forms.selectRole')} />
              </SelectTrigger>
              <SelectContent>
                {roles.slice(3, 5).map((role, index) => (
                  <SelectItem key={index + 3} value={(index + 3).toString()}>
                    {translateRole(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {formData.photo && (
            <p className='text-xs text-muted-foreground'>
              ✓ {formData.photo.name}
            </p>
          )}
        </div>
      </div>

      <Separator />

      {/* Contact Information */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2 pb-2'>
          <Mail className='size-5 text-primary' />
          <h3 className='text-base font-semibold'>
            {t('forms.contactInformation')}
          </h3>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='customer-email' className='text-sm font-medium'>
              {t('forms.emailAddress')}{' '}
              <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='customer-email'
              type='email'
              placeholder={t('forms.emailPlaceholder')}
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              className='h-11'
              aria-invalid={!!errors.email}
            />
            <FieldError message={errors.email} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='customer-phone' className='text-sm font-medium'>
              {t('forms.phoneNumber')}{' '}
              <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='customer-phone'
              type='tel'
              placeholder={t('forms.phonePlaceholder')}
              value={formData.phoneNumber}
              onChange={(e) => onInputChange('phoneNumber', e.target.value)}
              className='h-11'
              aria-invalid={!!errors.phoneNumber}
            />
            <FieldError message={errors.phoneNumber} />
          </div>
        </div>
      </div>

      <Separator />

      {/* Security */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2 pb-2'>
          <Lock className='size-5 text-primary' />
          <h3 className='text-base font-semibold'>{t('forms.security')}</h3>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label htmlFor='customer-password' className='text-sm font-medium'>
              {t('forms.password')} <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='customer-password'
              type='password'
              placeholder={t('forms.passwordPlaceholder')}
              value={formData.password}
              onChange={(e) => onInputChange('password', e.target.value)}
              className='h-11'
              aria-invalid={!!errors.password}
            />
            <FieldError message={errors.password} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='customer-confirm' className='text-sm font-medium'>
              {t('forms.confirmPassword')}{' '}
              <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='customer-confirm'
              type='password'
              placeholder={t('forms.passwordPlaceholder')}
              value={formData.confirmPassword}
              onChange={(e) => onInputChange('confirmPassword', e.target.value)}
              className='h-11'
              aria-invalid={!!errors.confirmPassword}
            />
            <FieldError message={errors.confirmPassword} />
          </div>
        </div>

        {/* Password Strength Indicator */}
        <PasswordStrengthIndicator
          password={formData.password}
          className='mt-4'
        />
      </div>
    </div>
  );
}
