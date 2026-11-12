import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface UserDetailHeaderProps {
  onBack: () => void;
  hasChanges: boolean;
}

const UserDetailHeader = ({ onBack, hasChanges }: UserDetailHeaderProps) => {
  const { t } = useTranslation('users');

  return (
    <div className='flex items-center gap-3 sm:gap-4'>
      <Button
        variant='outline'
        size='icon'
        onClick={onBack}
        className='h-10 w-10 shrink-0'
      >
        <ArrowLeft className='size-4' />
      </Button>
      <div className='flex items-center gap-2 sm:gap-3'>
        <div className='min-w-0'>
          <h1 className='text-xl sm:text-2xl font-bold tracking-tight'>
            {t('userDetails.title')}
          </h1>
          <p className='text-xs sm:text-sm text-muted-foreground'>
            {t('userDetails.subtitle')}
            {hasChanges && <span className='text-warning ml-2'>{t('userDetails.unsavedChanges')}</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetailHeader;
