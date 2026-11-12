import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const BuildingDetailError = ({
  error,
  onBack,
}: {
  error: string;
  onBack: () => void;
}) => {
  const { t } = useTranslation('buildings');
  
  return (
    <div className='container mx-auto p-6 max-w-6xl'>
      <Button variant='ghost' className='mb-6' onClick={onBack}>
        <ArrowLeft className='mr-2 h-4 w-4' />
        {t('detail.backToBuildings')}
      </Button>
      <Card className='p-12 text-center'>
        <CardTitle className='text-2xl mb-2'>{t('detail.notFound')}</CardTitle>
        <CardDescription>{error}</CardDescription>
      </Card>
    </div>
  );
};

export default BuildingDetailError;
