import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AddApartmentModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (apartmentName: string) => void;
  floorNumber: number;
}

const AddApartmentModal = ({
  open,
  onCancel,
  onConfirm,
  floorNumber,
}: AddApartmentModalProps) => {
  const { t } = useTranslation('buildings');
  const [apartmentName, setApartmentName] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!apartmentName.trim()) {
      setError(t('detail.addApartmentModal.apartmentNameRequired'));
      return;
    }
    setError('');
    onConfirm(apartmentName.trim());
    setApartmentName('');
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle>
            {t('detail.addApartmentModal.title', { floorNumber })}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-2 pt-2'>
          <label htmlFor='apartmentName' className='font-medium text-sm block'>
            {t('detail.addApartmentModal.apartmentNameLabel')}
          </label>
          <Input
            id='apartmentName'
            value={apartmentName}
            onChange={(e) => setApartmentName(e.target.value)}
            placeholder={t('detail.addApartmentModal.apartmentNamePlaceholder')}
            autoFocus
          />
          {error && <div className='text-destructive text-xs'>{error}</div>}
        </div>
        <DialogFooter className='mt-4'>
          <Button variant='outline' onClick={onCancel}>
            {t('detail.addApartmentModal.cancel')}
          </Button>
          <Button onClick={handleConfirm}>{t('detail.addApartmentModal.addApartment')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddApartmentModal;
