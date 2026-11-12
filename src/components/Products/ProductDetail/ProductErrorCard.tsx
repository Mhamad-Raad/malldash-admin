import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ProductErrorCardProps {
  error: string;
}

const ProductErrorCard = ({ error }: ProductErrorCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('products');

  return (
    <div className='flex items-center justify-center min-h-[400px] p-6'>
      <Card className='max-w-md w-full'>
        <CardContent className='pt-6'>
          <div className='flex flex-col items-center text-center gap-4'>
            <div className='w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center'>
              <AlertCircle className='w-8 h-8 text-destructive' />
            </div>
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold'>{t('productDetail.errorCard.title')}</h3>
              <p className='text-sm text-muted-foreground'>{error}</p>
            </div>
            <Button onClick={() => navigate('/products')} className='mt-2'>
              {t('productDetail.errorCard.backButton')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductErrorCard;
