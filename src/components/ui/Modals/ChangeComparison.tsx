import { ArrowRight } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { ChangeDetail } from './ConfirmModal';

interface ChangeComparisonProps {
  changes: ChangeDetail[];
}

const ChangeItem = ({ change }: { change: ChangeDetail }) => (
  <div className='px-4 py-3 hover:bg-muted/30 transition-colors'>
    <p className='text-xs font-medium text-muted-foreground mb-2'>
      {change.field}
    </p>
    <div className='flex flex-col md:flex-row items-stretch md:items-center gap-3 text-sm'>
      <div className='flex-1 min-w-0 group'>
        <div className='relative bg-gradient-to-br from-muted/30 to-muted/60 border border-border/50 rounded-lg px-4 py-3 transition-all hover:border-border'>
          <div className='flex items-center gap-1.5 mb-2'>
            <div className='h-1 w-1 rounded-full bg-muted-foreground/40'></div>
            <p className='text-[11px] font-medium text-muted-foreground'>Previous</p>
          </div>
          <p className='text-foreground font-medium break-all'>
            {change.oldValue || <span className='italic text-muted-foreground/60'>Not set</span>}
          </p>
        </div>
      </div>
      <div className='flex justify-center items-center shrink-0'>
        <div className='bg-primary/10 rounded-full p-1.5'>
          <ArrowRight className='h-3.5 w-3.5 text-primary rotate-90 md:rotate-0' />
        </div>
      </div>
      <div className='flex-1 min-w-0 group'>
        <div className='relative bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/30 rounded-lg px-4 py-3 transition-all hover:border-primary/50 hover:shadow-sm'>
          <div className='flex items-center gap-1.5 mb-2'>
            <div className='h-1 w-1 rounded-full bg-primary'></div>
            <p className='text-[11px] font-medium text-primary'>Updated</p>
          </div>
          <p className='text-primary font-semibold break-all'>
            {change.newValue || <span className='italic text-primary/50'>Not set</span>}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const ChangeComparison = ({ changes }: ChangeComparisonProps) => {
  if (changes.length === 0) return null;

  return (
    <div className='bg-card rounded-lg border border-border text-left'>
      <div className='bg-muted/50 px-4 py-2 border-b border-border'>
        <p className='text-sm font-semibold text-foreground'>
          Changes Summary ({changes.length} field{changes.length > 1 ? 's' : ''})
        </p>
      </div>
      {changes.length > 4 ? (
        <ScrollArea className='h-[400px]'>
          <div className='divide-y divide-border'>
            {changes.map((change, index) => (
              <ChangeItem key={index} change={change} />
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      ) : (
        <div className='divide-y divide-border'>
          {changes.map((change, index) => (
            <ChangeItem key={index} change={change} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChangeComparison;
