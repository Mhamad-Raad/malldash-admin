import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

const UsersTableSkeleton = () => (
  <TableRow className='border-b'>
    {/* User Info Skeleton - matches Avatar + Name + ID */}
    <TableCell className='font-medium py-4'>
      <div className='flex items-center gap-3 h-11'>
        <Skeleton className='h-11 w-11 rounded-full shrink-0 border-2 border-transparent' />
        <div className='flex flex-col gap-0.5 justify-center'>
          <Skeleton className='h-3.5 w-28' />
          <Skeleton className='h-3 w-20' />
        </div>
      </div>
    </TableCell>

    {/* Contact Info Skeleton - matches Email + Phone */}
    <TableCell className='py-4'>
      <div className='flex flex-col gap-2 min-w-[200px]'>
        <div className='flex items-center gap-2.5 h-6'>
          <Skeleton className='h-6 w-6 rounded-md shrink-0' />
          <Skeleton className='h-3.5 w-40' />
        </div>
        <div className='flex items-center gap-2.5 h-6'>
          <Skeleton className='h-6 w-6 rounded-md shrink-0' />
          <Skeleton className='h-3.5 w-28' />
        </div>
      </div>
    </TableCell>

    {/* Role Skeleton - matches Badge */}
    <TableCell className='py-4'>
      <Skeleton className='h-6 w-16 rounded-md' />
    </TableCell>

    {/* Location Skeleton - matches Building icon + Name */}
    <TableCell className='py-4'>
      <div className='flex items-center gap-2.5 min-w-[150px] h-7'>
        <Skeleton className='h-7 w-7 rounded-lg shrink-0' />
        <Skeleton className='h-4 w-32' />
      </div>
    </TableCell>
    
    {/* ChevronRight Skeleton */}
    <TableCell className='py-4 w-12'>
      <Skeleton className='h-4 w-4 rounded' />
    </TableCell>
  </TableRow>
);

export default UsersTableSkeleton;
