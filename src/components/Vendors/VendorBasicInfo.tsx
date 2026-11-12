import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { vendorTypes } from '@/constants/vendorTypes';

interface VendorBasicInfoProps {
  name: string;
  description: string;
  type: string;
  vendorId: string;
  onInputChange: (field: string, value: string) => void;
  disabled?: boolean;
}

const VendorBasicInfo = ({
  name,
  description,
  type,
  vendorId,
  onInputChange,
  disabled,
}: VendorBasicInfoProps) => {
  const { t } = useTranslation('vendors');
  
  return (
    <div className='flex-1 space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='name'>
          {t('createVendor.basicInfo.businessName')} <span className='text-destructive'>*</span>
        </Label>
        <Input
          id='name'
          value={name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder={t('createVendor.basicInfo.businessNamePlaceholder')}
          disabled={disabled}
          className='text-lg font-semibold'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='type'>
          {t('createVendor.basicInfo.businessType')} <span className='text-destructive'>*</span>
        </Label>
        <Select
          value={type}
          onValueChange={(value) => onInputChange('type', value)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('createVendor.basicInfo.selectType')} />
          </SelectTrigger>
          <SelectContent>
            {vendorTypes.map((type) => (
              <SelectItem key={type.value} value={String(type.value)}>
                {t(`types.${type.label.toLowerCase()}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>
          {t('createVendor.basicInfo.description')} <span className='text-destructive'>*</span>
        </Label>
        <Textarea
          id='description'
          value={description}
          onChange={(e) => onInputChange('description', e.target.value)}
          rows={6}
          placeholder={t('createVendor.basicInfo.descriptionPlaceholder')}
          disabled={disabled}
        />
      </div>

      <div className='pt-2'>
        <span className='text-xs text-muted-foreground'>
          {t('createVendor.basicInfo.id')}: {vendorId}
        </span>
      </div>
    </div>
  );
};

export default VendorBasicInfo;
