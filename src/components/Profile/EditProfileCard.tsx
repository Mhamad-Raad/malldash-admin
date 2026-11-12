import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Loader2, Save, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface EditProfileCardProps {
  formData: FormData;
  loading: boolean;
  hasChanges: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditProfileCard = ({
  formData,
  loading,
  hasChanges,
  onChange,
  onSave,
  onCancel,
}: EditProfileCardProps) => {
  const { t } = useTranslation('profile');
  
  return (
    <Card className='lg:col-span-2 flex flex-col'>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <div className='p-2 rounded-lg bg-primary/10'>
            <User className='h-5 w-5 text-primary' />
          </div>
          <div>
            <CardTitle className='text-lg'>{t('personalInfo.title')}</CardTitle>
            <CardDescription>
              {t('personalInfo.description')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-6 flex-1 flex flex-col'>
        {/* Name Fields */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='firstName' className='text-sm font-medium'>
              {t('fields.firstName')} <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='firstName'
              placeholder={t('placeholders.firstName')}
              value={formData.firstName}
              onChange={onChange}
              className='h-11'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='lastName' className='text-sm font-medium'>
              {t('fields.lastName')} <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='lastName'
              placeholder={t('placeholders.lastName')}
              value={formData.lastName}
              onChange={onChange}
              className='h-11'
            />
          </div>
        </div>

        {/* Email */}
        <div className='space-y-2'>
          <Label htmlFor='email' className='text-sm font-medium'>
            {t('fields.email')}
          </Label>
          <div className='relative'>
            <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              id='email'
              type='email'
              placeholder={t('placeholders.email')}
              value={formData.email}
              onChange={onChange}
              disabled
              className='h-11 pl-10 bg-muted/50'
            />
          </div>
          <p className='text-xs text-muted-foreground'>
            {t('messages.emailCannotChange')}
          </p>
        </div>

        {/* Phone */}
        <div className='space-y-2'>
          <Label htmlFor='phoneNumber' className='text-sm font-medium'>
            {t('fields.phone')}
          </Label>
          <div className='relative'>
            <Phone className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              id='phoneNumber'
              type='tel'
              placeholder={t('placeholders.phone')}
              value={formData.phoneNumber}
              onChange={onChange}
              className='h-11 pl-10'
            />
          </div>
        </div>

        <div className='flex-1' />

        <Separator />

        {/* Action Buttons */}
        <div className='flex flex-col-reverse sm:flex-row justify-end gap-3'>
          <Button
            variant='outline'
            onClick={onCancel}
            disabled={loading || !hasChanges}
            className='gap-2'
          >
            <X className='h-4 w-4' />
            {t('actions.cancel')}
          </Button>
          <Button
            onClick={onSave}
            disabled={loading || !hasChanges}
            className='gap-2'
          >
            {loading ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                {t('actions.saving')}
              </>
            ) : (
              <>
                <Save className='h-4 w-4' />
                {t('actions.save')}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditProfileCard;
