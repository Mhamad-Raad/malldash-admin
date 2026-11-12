import { Home, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Apartment, Occupant } from '@/interfaces/Building.interface';
import { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ObjectAutoComplete } from '@/components/ObjectAutoComplete';
import { fetchUsers } from '@/data/Users';

export interface UserResult {
  id: number | string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface EditApartmentDialogProps {
  apartment: Apartment | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (occupant: any, name: string) => void;
  onDelete?: (apartmentId: number) => void;
  apartmentName: string;
  setApartmentName: (name: string) => void;
}

const EditApartmentDialog = ({
  apartment,
  isOpen,
  onClose,
  onSave,
  apartmentName,
  setApartmentName,
  onDelete,
}: EditApartmentDialogProps) => {
  const { t } = useTranslation('buildings');
  const [pendingOccupant, setPendingOccupant] = useState<
    UserResult | null | 'remove'
  >(null);

  useEffect(() => {
    setApartmentName(apartment?.apartmentName ?? '');
    setPendingOccupant(apartment?.occupant ? null : 'remove');
  }, [
    apartment?.apartmentName,
    apartment?.id,
    setApartmentName,
    isOpen,
    apartment?.occupant,
  ]);

  const fetchUserObjects = useCallback(
    async (query: string): Promise<UserResult[]> => {
      const result = await fetchUsers({ searchTerm: query, limit: 5 });
      const users = Array.isArray(result?.data)
        ? result.data
            .filter((u: any) => !u.buildingName)
            .map((u: any) => ({
              id: u._id,
              name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
              email: u.email,
              avatarUrl: u.profileImageUrl,
            }))
        : [];
      return users;
    },
    []
  );

  // Final occupant preview logic:
  let occupant: UserResult | Occupant | null = null;
  if (pendingOccupant === 'remove') {
    occupant = null;
  } else if (pendingOccupant) {
    occupant = pendingOccupant;
  } else if (apartment?.occupant) {
    occupant = apartment.occupant;
  }

  const handleSave = () => {
    let userId: string | number | null = null;
    if (pendingOccupant === 'remove') {
      userId = null;
    } else if (
      pendingOccupant &&
      typeof pendingOccupant === 'object' &&
      'id' in pendingOccupant
    ) {
      userId = pendingOccupant.id;
    } else if (apartment?.occupant) {
      userId = apartment.occupant.id;
    }
    onSave(userId, apartmentName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[85vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Home className='h-5 w-5 text-primary' />
            {t('detail.apartment.editApartment')} {apartment?.apartmentName}
          </DialogTitle>
          <DialogDescription>
            {t('detail.apartment.manageOccupants')}
          </DialogDescription>
        </DialogHeader>

        <div className='mb-4'>
          <Label htmlFor='apartment-name' className='text-xs font-semibold'>
            {t('detail.apartment.apartmentNameLabel')}
          </Label>
          <Input
            id='apartment-name'
            value={apartmentName}
            onChange={(e) => setApartmentName(e.target.value)}
            placeholder={t('detail.apartment.apartmentNamePlaceholder')}
            className='mt-1'
          />
        </div>

        <div className='mb-4'>
          {occupant === null && (
            <ObjectAutoComplete<UserResult>
              fetchOptions={fetchUserObjects}
              getOptionLabel={(user) => `${user.name} (${user.email})`}
              onSelectOption={(user) => setPendingOccupant(user)}
              placeholder={t('detail.apartment.searchUserPlaceholder')}
              debounceMs={250}
            />
          )}
        </div>

        <ScrollArea className='flex-1 overflow-auto pr-4'>
          <div className='space-y-4 py-4'>
            <div className='border-t pt-4 space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-semibold flex items-center gap-2'>
                  <Users className='h-4 w-4' />
                  {t('detail.apartment.occupantLabel')}
                </h3>
              </div>
              {occupant ? (
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex gap-4 items-center'>
                    <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary uppercase overflow-hidden'>
                      {'avatarUrl' in occupant && occupant.avatarUrl ? (
                        <img
                          src={occupant.avatarUrl}
                          alt={occupant.name}
                          className='w-12 h-12 object-cover rounded-full'
                        />
                      ) : (
                        occupant.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('') || '?'
                      )}
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-lg font-medium'>
                        {occupant.name}
                      </span>
                      <span className='text-muted-foreground text-sm'>
                        {occupant.email}
                      </span>
                    </div>
                  </div>
                  {/* Remove/clear buttons */}
                  <Button
                    size='icon'
                    variant='ghost'
                    onClick={() => setPendingOccupant('remove')}
                  >
                    <X className='w-4 h-4' />
                  </Button>
                </div>
              ) : (
                <div className='text-center py-8 border rounded-lg bg-muted/30'>
                  <p className='text-sm text-muted-foreground mb-3'>
                    {t('detail.apartment.noOccupantsAssigned')}
                  </p>
                </div>
              )}
            </div>
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>

        <div className='flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t bg-background shrink-0'>
          <Button
            variant='outline'
            onClick={onClose}
            className='w-full sm:w-auto'
          >
            {t('detail.apartment.cancel')}
          </Button>
          {apartment?.id && onDelete && (
            <Button
              variant='destructive'
              onClick={() => onDelete(apartment.id)}
              className='w-full sm:w-auto'
            >
              {t('detail.apartment.deleteApartment')}
            </Button>
          )}
          <Button onClick={handleSave} className='w-full sm:w-auto'>
            {t('detail.apartment.saveChanges')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditApartmentDialog;
