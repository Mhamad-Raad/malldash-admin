import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ProductDetailHeaderProps {
  onBack: () => void;
  hasChanges: boolean;
  onDelete: () => void;
}

const ProductDetailHeader = ({
  onBack,
  hasChanges,
  onDelete,
}: ProductDetailHeaderProps) => {
  const { t } = useTranslation('products');
  
  return (
    <div className='flex items-center justify-between gap-3 sm:gap-4'>
      <div className='flex items-center gap-3 sm:gap-4'>
        <Button
          variant='outline'
          size='icon'
          onClick={onBack}
          className='h-10 w-10 shrink-0'
        >
          <ArrowLeft className='size-4' />
        </Button>
        <div className='min-w-0'>
          <h1 className='text-xl sm:text-2xl font-bold tracking-tight'>
            {t('productDetail.header.title')}
          </h1>
          <p className='text-xs sm:text-sm text-muted-foreground'>
            {t('productDetail.header.subtitle')}
            {hasChanges && (
              <span className='text-primary font-medium ml-2'>{t('productDetail.header.unsavedChanges')}</span>
            )}
          </p>
        </div>
      </div>
      <Button
        variant='destructive'
        size='sm'
        onClick={onDelete}
        className='gap-2'
      >
        <Trash2 className='size-4' />
        {t('productDetail.header.deleteButton')}
      </Button>
    </div>
  );
};

export default ProductDetailHeader;
