import { Image as ImageIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VendorPhotoUploadProps {
  preview: string;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove: () => void;
  disabled?: boolean;
}

const VendorPhotoUpload = ({ preview, onPhotoChange, onPhotoRemove, disabled }: VendorPhotoUploadProps) => {
  const { t } = useTranslation('vendors');
  
  return (
    <div className='flex-shrink-0'>
      <div className='relative w-full md:w-56 aspect-square'>
        <input
          id='vendor-photo'
          type='file'
          accept='image/*'
          onChange={onPhotoChange}
          disabled={disabled}
          className='hidden'
        />
        <label
          htmlFor='vendor-photo'
          className='w-full h-full rounded-lg bg-background flex items-center justify-center border-2 border-dashed border-muted-foreground/25 overflow-hidden cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all group'
        >
          {preview ? (
            <img
              src={preview}
              alt={t('photoUpload.title')}
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='flex flex-col items-center gap-3 text-muted-foreground'>
              <ImageIcon className='h-20 w-20 group-hover:text-primary/70 transition-colors' />
              <div className='text-center'>
                <p className='text-sm font-medium'>{t('photoUpload.uploadNew')}</p>
                <p className='text-xs mt-1'>{preview ? t('photoUpload.changePhoto') : t('photoUpload.uploadNew')}</p>
              </div>
            </div>
          )}
        </label>
        {preview && (
          <button
            type='button'
            onClick={(e) => {
              e.preventDefault();
              onPhotoRemove();
            }}
            disabled={disabled}
            className='absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-lg z-10 disabled:opacity-50'
            title={t('photoUpload.removePhoto')}
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>
    </div>
  );
};

export default VendorPhotoUpload;
