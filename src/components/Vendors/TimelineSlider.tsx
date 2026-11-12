import { memo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Slider } from '@/components/ui/slider';

interface TimelineSliderProps {
  openingTime: string;
  closeTime: string;
  onTimeChange: (type: 'open' | 'close', time: string) => void;
  disabled?: boolean;
}

const TimelineSlider = memo(({ openingTime, closeTime, onTimeChange, disabled }: TimelineSliderProps) => {
  const { t } = useTranslation('vendors');
  if (!openingTime || !closeTime) return null;

  const [openHour, openMin] = openingTime.split(':').map(Number);
  const [closeHour, closeMin] = closeTime.split(':').map(Number);
  
  // Convert times to minutes from midnight
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  // Local state for smooth dragging
  const [localValue, setLocalValue] = useState([openMinutes, closeMinutes]);

  // Sync with props when not dragging
  useEffect(() => {
    setLocalValue([openMinutes, closeMinutes]);
  }, [openMinutes, closeMinutes]);
  
  const totalMinutes = closeMinutes - openMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const getScheduleLabel = () => {
    if (openHour < 12 && closeHour <= 14) return t('timeline.morningHours');
    if (openHour < 12 && closeHour >= 17) return t('timeline.allDayService');
    if (openHour >= 17) return t('timeline.eveningHours');
    if (openHour >= 12 && closeHour < 17) return t('timeline.afternoonHours');
    return t('timeline.customSchedule');
  };

  const minutesToTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const handleSliderChange = (values: number[]) => {
    // Update local state for smooth visual feedback
    setLocalValue(values);
    
    // Update parent in real-time for display
    const [newOpenMinutes, newCloseMinutes] = values;
    const newOpenTime = minutesToTime(newOpenMinutes);
    const newCloseTime = minutesToTime(newCloseMinutes);
    onTimeChange('open', newOpenTime);
    onTimeChange('close', newCloseTime);
  };

  const handleSliderCommit = (values: number[]) => {
    // Final update when dragging is complete (already updated via onChange)
    setLocalValue(values);
  };

  return (
    <div className='p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20'>
      <div className='flex items-center justify-between mb-3'>
        <p className='text-sm font-semibold text-primary'>{t('timeline.businessSchedule')}</p>
        {totalMinutes > 0 && (
          <span className='text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded'>
            {hours}h {minutes > 0 ? `${minutes}m` : ''} {t('timeline.open')}
          </span>
        )}
      </div>

      {/* 24-hour timeline */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between text-xs text-muted-foreground mb-1 px-1'>
          <span className='font-medium'>12 AM</span>
          <span>6 AM</span>
          <span className='font-medium'>12 PM</span>
          <span>6 PM</span>
          <span className='font-medium'>11 PM</span>
        </div>

        {/* Slider */}
        <div className='px-2'>
          <Slider
            value={localValue}
            onValueChange={handleSliderChange}
            onValueCommit={handleSliderCommit}
            min={0}
            max={1439} // 23:59 (23 hours * 60 + 59 minutes)
            step={1} // 1-minute intervals for precise control
            disabled={disabled}
            className='w-full'
            minStepsBetweenThumbs={4} // Minimum 1 hour between times
          />
        </div>
        
        {/* Time labels with enhanced styling */}
        <div className='flex items-center justify-between text-xs pt-1'>
          <div className='flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800'>
            <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></div>
            <span className='font-semibold text-emerald-700 dark:text-emerald-400'>{openingTime}</span>
            <span className='text-emerald-600 dark:text-emerald-500 text-[10px]'>{t('timeline.openLabel').toUpperCase()}</span>
          </div>
          <div className='flex items-center gap-2 bg-orange-50 dark:bg-orange-950/30 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-800'>
            <span className='text-orange-600 dark:text-orange-500 text-[10px]'>{t('timeline.closeLabel').toUpperCase()}</span>
            <span className='font-semibold text-orange-700 dark:text-orange-400'>{closeTime}</span>
            <div className='w-2 h-2 rounded-full bg-orange-500 animate-pulse'></div>
          </div>
        </div>
      </div>
      
      {/* Additional info */}
      <div className='mt-3 pt-3 border-t border-primary/20'>
        <p className='text-xs text-muted-foreground'>
          {getScheduleLabel()}
        </p>
      </div>
    </div>
  );
});

TimelineSlider.displayName = 'TimelineSlider';

export default TimelineSlider;
