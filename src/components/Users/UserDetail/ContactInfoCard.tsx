import { Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { UserFormData } from '@/interfaces/Users.interface';

interface ContactInfoCardProps {
  formData: UserFormData;
  onInputChange: (field: keyof UserFormData, value: string) => void;
}

const ContactInfoCard = ({ formData, onInputChange }: ContactInfoCardProps) => {
  const { t } = useTranslation('users');

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>{t('userDetails.contactInformation')}</CardTitle>
        <CardDescription>
          {t('userDetails.contactInformationDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='email' className='text-sm font-medium flex items-center gap-2'>
            <Mail className='size-4 text-primary' />
            {t('userDetails.emailAddress')} <span className='text-destructive'>*</span>
          </Label>
          <Input
            id='email'
            type='email'
            placeholder={t('forms.emailPlaceholder')}
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            className='h-11'
          />
        </div>
        <Separator />
        <div className='space-y-2'>
          <Label htmlFor='phone' className='text-sm font-medium flex items-center gap-2'>
            <Phone className='size-4 text-primary' />
            {t('userDetails.phoneNumber')} <span className='text-destructive'>*</span>
          </Label>
          <Input
            id='phone'
            type='tel'
            placeholder={t('forms.phonePlaceholder')}
            value={formData.phoneNumber}
            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
            className='h-11'
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard;
