import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface VendorDetailErrorProps {
  error?: string;
  onBack: () => void;
}

const VendorDetailError = ({ error, onBack }: VendorDetailErrorProps) => {
  const { t } = useTranslation('vendors');
  
  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      <div className='flex items-center gap-4'>
        <Button variant='ghost' onClick={onBack}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          {t('vendorDetail.backToVendors')}
        </Button>
      </div>

      <div className='flex items-center justify-center min-h-[400px]'>
        <Card className='max-w-md w-full'>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center text-center space-y-4'>
              <div className='rounded-full bg-destructive/10 p-3'>
                <AlertCircle className='h-10 w-10 text-destructive' />
              </div>
              <div className='space-y-2'>
                <h3 className='text-xl font-semibold'>{t('vendorDetail.notFound')}</h3>
                <p className='text-sm text-muted-foreground'>
                  {error || t('vendorDetail.notFoundDescription')}
                </p>
              </div>
              <Button onClick={onBack} className='w-full'>
                {t('vendorDetail.backToVendors')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDetailError;
