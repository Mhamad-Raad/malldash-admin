import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { showValidationErrors } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import ApartmentCard from './ApartmentCard';
import ConfirmModal from '@/components/ui/Modals/ConfirmModal';
import AddApartmentModal from './AddApartmentModal';

import {
  postBuildingFloor,
  removeBuildingFloor,
  addApartmentToFloorThunk,
  getBuildingById,
} from '@/store/slices/buildingSlice';
import type { RootState, AppDispatch } from '@/store/store';

const BuildingFloors = ({ onApartmentEdit }: { onApartmentEdit: any }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('buildings');
  const { building, loading, error } = useSelector(
    (state: RootState) => state.building
  );

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showAddApartmentModal, setShowAddApartmentModal] = useState(false);
  const [addAptTargetFloor, setAddAptTargetFloor] = useState<any>(null);

  const floors = Array.isArray(building?.floors) ? building.floors : [];

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFloor, setDeleteFloor] = useState<any>(null);

  // ---- ADD FLOOR ----
  const handleAddFloorClick = () => setShowAddModal(true);

  const handleAddFloorConfirm = async () => {
    setShowAddModal(false);
    if (building?.id) {
      const result = await dispatch(postBuildingFloor(building.id));
      if (postBuildingFloor.rejected.match(result)) {
        const payload = result.payload as { error: string; errors: string[] } | undefined;
        showValidationErrors(
          t('detail.floors.failedToAddFloor') || 'Failed to add floor',
          payload?.errors?.length ? payload.errors : payload?.error,
          'An error occurred while adding the floor'
        );
      } else {
        toast.success(t('detail.floors.floorAdded') || 'Floor added successfully!');
        await dispatch(getBuildingById(building.id));
      }
    }
  };

  // ---- DELETE FLOOR ----
  const handleDeleteFloorClick = (floor: any) => {
    setDeleteFloor(floor);
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  const handleDeleteFloorConfirm = async () => {
    setDeleteError(null);
    if (deleteFloor?.id) {
      const result = await dispatch(removeBuildingFloor(deleteFloor.id));
      if (removeBuildingFloor.rejected.match(result)) {
        const payload = result.payload as { error?: string; errors?: string[] } | undefined;
        const errMsg = payload?.error ?? t('detail.floors.failedToDeleteFloor');
        setDeleteError(errMsg);
        showValidationErrors(
          t('detail.floors.failedToDeleteFloor') || 'Failed to delete floor',
          payload?.errors?.length ? payload.errors : errMsg,
          'An error occurred while deleting the floor'
        );
      } else {
        setShowDeleteModal(false);
        setDeleteFloor(null);
        setDeleteError(null);
        toast.success(t('detail.floors.floorDeleted') || 'Floor deleted successfully!');
      }
    }
  };

  const addApartmnet = async (apartmentName: string) => {
    setShowAddApartmentModal(false);
    if (addAptTargetFloor?.id) {
      const result = await dispatch(
        addApartmentToFloorThunk({
          floorId: addAptTargetFloor.id,
          apartmentName,
        })
      );
      if (addApartmentToFloorThunk.rejected.match(result)) {
        const payload = result.payload as { error: string; errors: string[] } | undefined;
        showValidationErrors(
          t('detail.floors.failedToAddApartment') || 'Failed to add apartment',
          payload?.errors?.length ? payload.errors : payload?.error,
          'An error occurred while adding the apartment'
        );
      } else {
        toast.success(t('detail.floors.apartmentAdded') || 'Apartment added successfully!');
        if (building?.id) {
          await dispatch(getBuildingById(building.id));
        }
      }
    }
    setAddAptTargetFloor(null);
  };

  return (
    <div className='space-y-4'>
      {/* Title & Add */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-lg bg-primary/10 border border-primary/20'>
            <Layers className='h-5 w-5 text-primary' />
          </div>
          <div>
            <h2 className='text-xl font-bold'>{t('detail.floors.title')}</h2>
            <p className='text-sm text-muted-foreground'>{floors.length} {floors.length !== 1 ? t('detail.floors.totalFloorsPlural') : t('detail.floors.totalFloors')} {t('detail.floors.total')}</p>
          </div>
        </div>
        <Button
          variant='default'
          size='sm'
          onClick={handleAddFloorClick}
          className='gap-2'
          disabled={loading}
        >
          <Plus className='w-4 h-4' />
          {t('detail.floors.addFloor')}
        </Button>
      </div>
      {error && (
        <div className='bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-3 text-sm text-center'>
          {error}
        </div>
      )}
      <Card className='border shadow-md overflow-hidden'>
        <Accordion type='multiple' className='w-full'>
          {[...floors]
            .sort((a, b) => a.floorNumber - b.floorNumber)
            .map((floor) => (
              <AccordionItem key={floor?.id} value={`floor-${floor?.id}`} className='border-b last:border-0'>
                <AccordionTrigger className='px-6 py-4 hover:no-underline hover:bg-muted/30 transition-colors group'>
                  <div className='flex items-center justify-between w-full pr-4'>
                    <div className='flex items-center gap-4'>
                      <div className='p-2.5 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors'>
                        <Layers className='h-5 w-5 text-primary' />
                      </div>
                      <div className='text-left'>
                        <p className='text-lg font-semibold'>
                          {t('detail.floors.floor')} {floor?.floorNumber}
                        </p>
                        <p className='text-sm text-muted-foreground font-normal'>
                          {floor?.apartments?.length || 0} {floor?.apartments?.length !== 1 ? t('detail.floors.unitsPlural') : t('detail.floors.unit')}
                        </p>
                      </div>
                    </div>
                    <div
                      role='button'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFloorClick(floor);
                      }}
                      className='p-2 rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive transition-all cursor-pointer'
                      title='Delete Floor'
                    >
                      <Trash2 className='w-4 h-4' />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='px-6 pb-6 bg-muted/20'>
                  <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-4'>
                    {[...(floor?.apartments ?? [])].map((apartment) => (
                      <ApartmentCard
                        key={apartment?.id}
                        apartment={apartment}
                        onEdit={() => onApartmentEdit(apartment)}
                      />
                    ))}
                    <Card 
                      className='border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg group bg-card hover:bg-primary/5'
                      onClick={() => {
                        setAddAptTargetFloor(floor);
                        setShowAddApartmentModal(true);
                      }}
                    >
                      <div className='p-5 flex flex-col items-center justify-center h-full min-h-[140px]'>
                        <div className='p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors mb-2'>
                          <Plus className='w-6 h-6 text-primary' />
                        </div>
                        <span className='font-semibold text-sm text-primary'>{t('detail.floors.addApartment')}</span>
                      </div>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </Card>

      {/* Add Floor Modal */}
      <ConfirmModal
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onConfirm={handleAddFloorConfirm}
        title={t('detail.floors.addFloorTitle')}
        description={t('detail.floors.addFloorDescription')}
        confirmType='success'
        confirmLabel={t('detail.floors.addFloorConfirm')}
        cancelLabel={t('modal.cancel')}
        changes={[]}
      />

      {/* Delete Floor Modal */}
      <ConfirmModal
        open={showDeleteModal}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteFloor(null);
          setDeleteError(null);
        }}
        onConfirm={handleDeleteFloorConfirm}
        title={t('detail.floors.deleteFloorTitle')}
        description={t('detail.floors.deleteFloorDescription', { floorNumber: deleteFloor?.floorNumber || '' })}
        warning={
          deleteError ||
          t('detail.floors.deleteFloorWarning')
        }
        confirmType='danger'
        confirmLabel={t('detail.floors.deleteFloorConfirm')}
        cancelLabel={t('modal.cancel')}
        changes={
          deleteFloor
            ? [
                {
                  field: t('detail.floors.floorNumberField'),
                  oldValue: deleteFloor.floorNumber,
                  newValue: t('detail.floors.willBeDeleted'),
                },
              ]
            : []
        }
      />

      <AddApartmentModal
        open={showAddApartmentModal}
        floorNumber={addAptTargetFloor?.floorNumber || 0}
        onCancel={() => {
          setShowAddApartmentModal(false);
          setAddAptTargetFloor(null);
        }}
        onConfirm={addApartmnet}
      />
    </div>
  );
};

export default BuildingFloors;
