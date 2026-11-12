import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, ArrowLeft, Pencil, Check, X, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { showValidationErrors } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ConfirmModal, {
  type ChangeDetail,
} from '@/components/ui/Modals/ConfirmModal';
import { putBuildingName } from '@/store/slices/buildingSlice';
import type { RootState, AppDispatch } from '@/store/store';
interface BuildingHeaderProps {
  onDeleteBuilding?: () => void;
}

const BuildingHeader = ({ onDeleteBuilding }: BuildingHeaderProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('buildings');
  const { building, loading, error } = useSelector(
    (state: RootState) => state.building
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(building?.name || '');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleBackNavigation = () => navigate('/buildings');

  const handleEditClick = () => {
    setIsEditing(true);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(building?.name || '');
    setSuccess(null);
  };

  // After modal confirms, dispatch the redux thunk
  const handleModalConfirm = async () => {
    setShowConfirmModal(false);
    if (!building?.id) return;
    const resultAction = await dispatch(
      putBuildingName({ id: building.id, name: editedName.trim() })
    );
    if (putBuildingName.fulfilled.match(resultAction)) {
      setIsEditing(false);
      setSuccess(t('detail.nameUpdated'));
      toast.success(t('detail.nameUpdated'));
    } else if (putBuildingName.rejected.match(resultAction)) {
      const payload = resultAction.payload as { error: string; errors: string[] } | undefined;
      showValidationErrors(
        t('detail.nameUpdateFailed') || 'Failed to update building name',
        payload?.errors?.length ? payload.errors : payload?.error,
        'An error occurred while updating the building name'
      );
    }
  };

  const handleShowModal = () => {
    setShowConfirmModal(true);
  };

  // Only allow confirming when the name is not empty and actually changed
  const confirmEnabled =
    !loading &&
    !!editedName.trim() &&
    editedName.trim() !== (building?.name?.trim() || '');

  // Changes summary for the modal
  const changes: ChangeDetail[] = [
    {
      field: t('detail.fieldBuildingName'),
      oldValue: building?.name || '',
      newValue: editedName.trim(),
    },
  ];

  return (
    <div>
      <Button
        variant='ghost'
        onClick={handleBackNavigation}
        className='mb-4 hover:bg-muted/50'
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        {t('detail.backToBuildings')}
      </Button>

      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div className='flex items-center gap-4 flex-1'>
          <div className='p-4 rounded-xl bg-primary/10 border-2 border-primary/20'>
            <Building2 className='h-10 w-10 text-primary' />
          </div>
          <div className='flex-1 flex items-center gap-3'>
            {!isEditing ? (
              <div className='flex items-center gap-2'>
                <span className='text-3xl md:text-4xl font-bold'>
                  {building?.name}
                </span>
              </div>
            ) : (
              <TooltipProvider>
                <div className='flex items-center gap-2'>
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className='text-3xl md:text-4xl font-bold h-auto py-2 px-3 max-w-md'
                    autoFocus
                    disabled={loading}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size='icon'
                        onClick={handleShowModal}
                        onMouseDown={(e) => e.preventDefault()}
                        disabled={!confirmEnabled}
                        className={
                          'ml-2 bg-green-600 hover:bg-green-700 text-white'
                        }
                        type='button'
                      >
                        <Check className='w-5 h-5' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {!confirmEnabled
                        ? !editedName.trim()
                          ? t('detail.nameRequired')
                          : t('detail.nameMustBeChanged')
                        : t('detail.confirmNameChange')}
                    </TooltipContent>
                  </Tooltip>
                  <Button
                    size='icon'
                    variant='ghost'
                    onClick={handleCancel}
                    disabled={loading}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <X className='w-5 h-5 text-destructive' />
                  </Button>
                </div>
                {(error || success) && (
                  <div
                    className={`mt-2 text-sm ${
                      error ? 'text-destructive' : 'text-green-500'
                    }`}
                  >
                    {error || success}
                  </div>
                )}
                {/* Confirmation Modal for changing name */}
                <ConfirmModal
                  open={showConfirmModal}
                  title={t('detail.confirmNameChangeTitle')}
                  description={t('detail.confirmNameChangeDescription')}
                  warning={t('detail.confirmNameChangeWarning')}
                  confirmType='warning'
                  confirmLabel={t('detail.confirm')}
                  cancelLabel={t('modal.cancel')}
                  changes={changes}
                  onCancel={() => setShowConfirmModal(false)}
                  onConfirm={handleModalConfirm}
                />
              </TooltipProvider>
            )}
          </div>
        </div>

        {/* Actions section - only show when not editing */}
        {!isEditing && (
          <div className='flex items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>{t('detail.actionsLabel')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleEditClick}
                  className='cursor-pointer'
                >
                  <Pencil className='mr-2 h-4 w-4' />
                  {t('detail.editBuildingName')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDeleteBuilding}
                  className='text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer'
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  {t('detail.deleteBuilding')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildingHeader;
