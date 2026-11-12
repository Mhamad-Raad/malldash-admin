import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, Paperclip, ZoomIn } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AttachmentsCardProps {
  imageUrls: string[];
  onImageClick: (index: number) => void;
}

const AttachmentsCard = ({ imageUrls, onImageClick }: AttachmentsCardProps) => {
  const { t } = useTranslation('supportTickets');

  return (
    <Card className='shadow-sm'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-base'>
          <Paperclip className='h-4 w-4 text-muted-foreground' />
          {t('detail.attachments.title')}
          {imageUrls.length > 0 && (
            <span className='text-xs font-normal text-muted-foreground'>
              ({imageUrls.length})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {imageUrls.length > 0 ? (
          <div className='grid grid-cols-2 gap-2.5'>
            {imageUrls.map((url, index) => (
              <button
                key={index}
                type='button'
                onClick={() => onImageClick(index)}
                className='relative group rounded-lg overflow-hidden border bg-muted/30 aspect-square focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all hover:shadow-md'
              >
                <img
                  src={url}
                  alt={t('detail.attachments.alt', { index: index + 1 })}
                  className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center'>
                  <ZoomIn className='h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg' />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center gap-2.5 text-sm text-muted-foreground py-8 border border-dashed rounded-lg bg-muted/10'>
            <ImageIcon className='h-8 w-8 opacity-40' />
            <span>{t('detail.attachments.empty')}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttachmentsCard;
