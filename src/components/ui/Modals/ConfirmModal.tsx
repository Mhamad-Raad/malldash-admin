import * as React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle2, Info, Loader2, X } from 'lucide-react';
import ChangeComparison from './ChangeComparison';

export interface ChangeDetail {
  field: string;
  oldValue: string | number;
  newValue: string | number;
}

interface ConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<any> | void;
  title: string;
  description: string;
  userName?: string;
  warning?: string;
  confirmType?: 'danger' | 'warning' | 'success';
  confirmLabel?: string;
  cancelLabel?: string;
  changes?: ChangeDetail[];
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  userName,
  warning,
  confirmType = 'success',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  changes = [],
}) => {
  const [loading, setLoading] = useState(false);

  // Define styles and icons based on type
  const getTypeStyles = () => {
    switch (confirmType) {
      case 'danger':
        return {
          iconBg: 'bg-red-100 dark:bg-red-950',
          icon: <AlertTriangle className='h-6 w-6 text-red-600 dark:text-red-400' />,
          buttonClass: 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white',
          ringClass: 'ring-red-600/20',
        };
      case 'warning':
        return {
          iconBg: 'bg-yellow-100 dark:bg-yellow-950',
          icon: <Info className='h-6 w-6 text-yellow-600 dark:text-yellow-400' />,
          buttonClass: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800 text-white',
          ringClass: 'ring-yellow-600/20',
        };
      default:
        return {
          iconBg: 'bg-green-100 dark:bg-green-950',
          icon: <CheckCircle2 className='h-6 w-6 text-green-600 dark:text-green-400' />,
          buttonClass: 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white',
          ringClass: 'ring-green-600/20',
        };
    }
  };

  const styles = getTypeStyles();

  // handle confirm with internal loading state
  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm?.();
    } finally {
      setLoading(false);
    }
  };

  // For safety: reset loading if modal is closed unexpectedly
  React.useEffect(() => {
    if (!open) setLoading(false);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={open ? onCancel : undefined}>
      <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
        {/* Close button */}
        <button
          className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-50'
          onClick={onCancel}
          aria-label='Close'
          type='button'
          disabled={loading}
        >
          <X className='h-4 w-4' />
        </button>

        <DialogTitle className='sr-only'>{title}</DialogTitle>
        <DialogDescription className='sr-only'>{description}</DialogDescription>

        {/* Icon at top */}
        <div className='flex flex-col items-center gap-4 pt-6'>
          <div className={`${styles.iconBg} rounded-full p-3 ring-8 ${styles.ringClass}`}>
            {styles.icon}
          </div>

          <div className='space-y-4 text-center w-full px-4'>
            <h2 className='text-xl font-semibold text-foreground' aria-hidden='true'>
              {title}
            </h2>
            <p className='text-base text-foreground/70 leading-relaxed' aria-hidden='true'>
              {description}
            </p>
            
            {userName && (
              <div className='bg-muted/50 rounded-lg p-4 border border-border'>
                <p className='text-2xl font-bold text-foreground'>
                  {userName}
                </p>
              </div>
            )}

            {/* Changes detail section */}
            <ChangeComparison changes={changes} />

            {warning && (
              <p className='text-sm text-destructive font-medium'>
                {warning}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className='flex flex-col-reverse sm:flex-row gap-3 mt-6 pt-4 border-t'>
          <Button
            variant='outline'
            onClick={onCancel}
            disabled={loading}
            className='flex-1'
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={`${styles.buttonClass} flex-1`}
          >
            {loading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Loading...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
