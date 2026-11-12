import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  altPrefix: string;
}

const ImageLightbox = ({
  images,
  initialIndex,
  open,
  onOpenChange,
  altPrefix,
}: ImageLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) setCurrentIndex(initialIndex);
  }, [open, initialIndex]);

  const handlePrev = useCallback(
    () => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1)),
    [images.length]
  );

  const handleNext = useCallback(
    () => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1)),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, handlePrev, handleNext]);

  if (images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className='max-w-none w-screen h-screen p-0 gap-0 bg-black/95 border-none overflow-hidden rounded-none sm:max-w-none'
      >
        <DialogTitle className='sr-only'>
          {altPrefix} {currentIndex + 1}
        </DialogTitle>

        {/* Top bar */}
        <div className='absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent'>
          <span className='text-white/80 text-sm font-medium'>
            {currentIndex + 1} / {images.length}
          </span>
          <div className='flex items-center gap-1'>
            <button
              onClick={() => onOpenChange(false)}
              className='inline-flex items-center justify-center h-8 w-8 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors'
            >
              <X className='h-4 w-4' />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className='flex items-center justify-center w-full h-full p-12'>
          <img
            src={images[currentIndex]}
            alt={`${altPrefix} ${currentIndex + 1}`}
            className='max-w-full max-h-full object-contain select-none rounded-lg'
            draggable={false}
          />
        </div>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className='absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 flex items-center justify-center transition-all'
            >
              <ChevronLeft className='h-5 w-5' />
            </button>
            <button
              onClick={handleNext}
              className='absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 flex items-center justify-center transition-all'
            >
              <ChevronRight className='h-5 w-5' />
            </button>
          </>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className='absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-t from-black/60 to-transparent'>
            {images.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-12 w-12 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                  idx === currentIndex
                    ? 'border-white scale-110 shadow-lg'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={url}
                  alt={`${altPrefix} ${idx + 1}`}
                  className='w-full h-full object-cover'
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;
