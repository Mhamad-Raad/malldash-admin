import { ArrowRight } from 'lucide-react';
import { formatFieldName } from './auditUtils';

interface ChangeRowProps {
  field: string;
  oldValue: string;
  newValue: string;
  isNew: boolean;
}

const ChangeRow = ({ field, oldValue, newValue, isNew }: ChangeRowProps) => {
  const hasChange = oldValue !== newValue;

  return (
    <div className='group grid grid-cols-[160px_1fr_28px_1fr] gap-3 items-start py-4 px-5 hover:bg-muted/30 transition-colors overflow-hidden'>
      <div className='flex items-center gap-2 min-w-0'>
        <span className='text-base font-medium text-foreground truncate'>
          {formatFieldName(field)}
        </span>
      </div>
      <div className='min-w-0'>
        {isNew ? (
          <span className='text-sm text-muted-foreground italic'>—</span>
        ) : (
          <code className='text-sm bg-muted/50 px-3 py-1.5 rounded block break-all text-muted-foreground'>
            {oldValue || <span className='italic'>empty</span>}
          </code>
        )}
      </div>
      <div className='flex justify-center pt-1.5'>
        {hasChange && (
          <div className='rounded-full bg-primary/10 p-1.5'>
            <ArrowRight className='h-4 w-4 text-primary' />
          </div>
        )}
      </div>
      <div className='min-w-0'>
        <code className='text-sm bg-primary/5 border border-primary/20 px-3 py-1.5 rounded block break-all text-foreground'>
          {newValue || <span className='italic text-muted-foreground'>empty</span>}
        </code>
      </div>
    </div>
  );
};

export default ChangeRow;
