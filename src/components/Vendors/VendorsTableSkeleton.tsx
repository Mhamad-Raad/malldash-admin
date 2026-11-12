import { TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

const VendorsTableSkeleton = () => (
  <TableRow className='border-b'>
    {/* Business Info Skeleton - matches Avatar + Name + Description */}
    <TableCell className='py-4'>
      <div className='flex items-center gap-3'>
        <Skeleton className='h-11 w-11 rounded-full shrink-0 border-2 border-transparent' />
        <div className='flex flex-col gap-0.5'>
          <Skeleton className='h-4 w-32' /> {/* Business name - text-sm height */}
          <Skeleton className='h-3 w-24' /> {/* Description - text-[11px] height */}
        </div>
      </div>
    </TableCell>

    {/* Owner Name Skeleton */}
    <TableCell className='py-4'>
      <Skeleton className='h-4 w-28' /> {/* text-sm height */}
    </TableCell>

    {/* Type Skeleton - matches Badge */}
    <TableCell className='py-4'>
      <Skeleton className='h-7 w-20 rounded-md' />
    </TableCell>

    {/* Contact Info Skeleton - matches Email + Phone */}
    <TableCell className='py-4'>
      <div className='flex flex-col gap-2 min-w-[180px]'>
        <div className='flex items-center gap-2.5'>
          <Skeleton className='h-6 w-6 rounded-md' /> {/* Mail icon container */}
          <Skeleton className='h-3 w-36' /> {/* Email - text-xs */}
        </div>
        <div className='flex items-center gap-2.5'>
          <Skeleton className='h-6 w-6 rounded-md' /> {/* Phone icon container */}
          <Skeleton className='h-3 w-28' /> {/* Phone number - text-xs */}
        </div>
      </div>
    </TableCell>

    {/* Working Hours Skeleton - matches Clock icon + Hours */}
    <TableCell className='py-4'>
      <div className='flex items-center gap-2.5 min-w-[120px]'>
        <Skeleton className='h-6 w-6 rounded-md' /> {/* Clock icon container */}
        <Skeleton className='h-3 w-24' /> {/* Hours - text-xs */}
      </div>
    </TableCell>
    
    {/* ChevronRight Skeleton */}
    <TableCell className='py-4'>
      <Skeleton className='h-4 w-4 rounded' />
    </TableCell>
  </TableRow>
);

export default VendorsTableSkeleton;
