import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface SecurityCardProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
}

const SecurityCard = ({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
}: SecurityCardProps) => {
  const { t } = useTranslation('users');
  const passwordsMatch = !password || !confirmPassword || password === confirmPassword;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>{t('userDetails.security')}</CardTitle>
        <CardDescription>
          {t('userDetails.securityDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='password' className='text-sm font-medium flex items-center gap-2'>
            <Lock className='size-4 text-primary' />
            {t('userDetails.newPassword')}
          </Label>
          <Input
            id='password'
            type='password'
            placeholder={t('forms.passwordPlaceholder')}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className='h-11'
          />
        </div>
        <Separator />
        <div className='space-y-2'>
          <Label htmlFor='confirmPassword' className='text-sm font-medium flex items-center gap-2'>
            <Lock className='size-4 text-primary' />
            {t('userDetails.confirmNewPassword')}
          </Label>
          <Input
            id='confirmPassword'
            type='password'
            placeholder={t('forms.passwordPlaceholder')}
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            className='h-11'
          />
          {!passwordsMatch && (
            <p className='text-xs text-destructive'>
              {t('userDetails.passwordsDoNotMatch')}
            </p>
          )}
        </div>
        <p className='text-xs text-muted-foreground'>
          {t('userDetails.passwordNote')}
        </p>
      </CardContent>
    </Card>
  );
};

export default SecurityCard;
