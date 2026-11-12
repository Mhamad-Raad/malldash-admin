import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TimelineSlider from './TimelineSlider';

interface VendorWorkingHoursProps {
  openingTime: string;
  closeTime: string;
  onInputChange: (field: string, value: string) => void;
  onTimeChange: (type: 'open' | 'close', time: string) => void;
  disabled?: boolean;
}

const VendorWorkingHours = ({
  openingTime,
  closeTime,
  onInputChange,
  onTimeChange,
  disabled,
}: VendorWorkingHoursProps) => {
  const { t } = useTranslation('vendors');
  const hasInvalidTime = openingTime && closeTime && openingTime >= closeTime;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Clock className='h-5 w-5' />
          {t('vendorDetail.workingHours.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Time Inputs with Icons */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label htmlFor='openingTime' className='text-sm font-medium'>
              {t('createVendor.workingHours.openingTime')} <span className='text-destructive'>*</span>
            </Label>
            <div className='relative'>
              <Input
                id='openingTime'
                type='time'
                value={openingTime}
                onChange={(e) => onInputChange('openingTime', e.target.value)}
                disabled={disabled}
                className='pl-10 h-11 text-base'
              />
              <Clock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='closeTime' className='text-sm font-medium'>
              {t('createVendor.workingHours.closingTime')} <span className='text-destructive'>*</span>
            </Label>
            <div className='relative'>
              <Input
                id='closeTime'
                type='time'
                value={closeTime}
                onChange={(e) => onInputChange('closeTime', e.target.value)}
                disabled={disabled}
                className='pl-10 h-11 text-base'
              />
              <Clock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
            </div>
          </div>
        </div>

        {/* Visual Schedule Display */}
        {openingTime && closeTime && (
          <TimelineSlider
            openingTime={openingTime}
            closeTime={closeTime}
            onTimeChange={onTimeChange}
            disabled={disabled}
          />
        )}

        {/* Validation message */}
        {hasInvalidTime && (
          <div className='p-3 rounded-lg bg-destructive/10 border border-destructive/20'>
            <p className='text-sm text-destructive font-medium'>
              {t('createVendor.workingHours.validationError')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorWorkingHours;
