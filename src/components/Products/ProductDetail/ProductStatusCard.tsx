import { CheckCircle, XCircle, Scale } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

interface ProductStatusCardProps {
  inStock: boolean;
  isWeightable: boolean;
  onInStockChange: (inStock: boolean) => void;
  onWeightableChange: (isWeightable: boolean) => void;
}

const ProductStatusCard = ({
  inStock,
  isWeightable,
  onInStockChange,
  onWeightableChange,
}: ProductStatusCardProps) => {
  const { t } = useTranslation('products');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>{t('productDetail.statusCard.title')}</CardTitle>
        <CardDescription>
          {t('productDetail.statusCard.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* In Stock Toggle */}
        <div
          className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
            inStock ? 'bg-accent/50' : 'bg-muted'
          }`}
        >
          <div className='flex items-center gap-3'>
            {inStock ? (
              <CheckCircle className='w-5 h-5 text-accent-foreground' />
            ) : (
              <XCircle className='w-5 h-5 text-muted-foreground' />
            )}
            <div>
              <p className='font-medium'>{t('productDetail.statusCard.inStock')}</p>
              <p className='text-xs text-muted-foreground'>
                {t('productDetail.statusCard.inStockDescription')}
              </p>
            </div>
          </div>
          <Switch checked={inStock} onCheckedChange={onInStockChange} />
        </div>

        <Separator />

        {/* Weightable Toggle */}
        <div
          className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
            isWeightable ? 'bg-primary/10' : 'bg-muted'
          }`}
        >
          <div className='flex items-center gap-3'>
            <Scale
              className={`w-5 h-5 ${
                isWeightable ? 'text-primary' : 'text-muted-foreground'
              }`}
            />
            <div>
              <p className='font-medium'>{t('productDetail.statusCard.soldByWeight')}</p>
              <p className='text-xs text-muted-foreground'>
                {t('productDetail.statusCard.soldByWeightDescription')}
              </p>
            </div>
          </div>
          <Switch
            checked={isWeightable}
            onCheckedChange={onWeightableChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductStatusCard;
