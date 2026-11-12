import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

const SupportTicketsTableSkeleton = () => (
  <TableRow className='border-b'>
    {/* Ticket # */}
    <TableCell className='py-4'>
      <div className='flex items-center gap-2.5'>
        <Skeleton className='h-7 w-7 rounded-lg shrink-0' />
        <Skeleton className='h-4 w-16' />
      </div>
    </TableCell>
    {/* Subject */}
    <TableCell className='py-4'>
      <div className='flex items-center gap-2.5'>
        <Skeleton className='h-6 w-6 rounded-md shrink-0' />
        <Skeleton className='h-4 w-40' />
      </div>
    </TableCell>
    {/* User */}
    <TableCell className='py-4'>
      <div className='flex items-center gap-2.5'>
        <Skeleton className='h-6 w-6 rounded-md shrink-0' />
        <Skeleton className='h-4 w-28' />
      </div>
    </TableCell>
    {/* Status */}
    <TableCell className='py-4'>
      <Skeleton className='h-6 w-24 rounded-md' />
    </TableCell>
    {/* Priority */}
    <TableCell className='py-4'>
      <Skeleton className='h-6 w-20 rounded-md' />
    </TableCell>
    {/* Created */}
    <TableCell className='py-4'>
      <div className='flex items-center gap-2.5'>
        <Skeleton className='h-6 w-6 rounded-md shrink-0' />
        <Skeleton className='h-4 w-32' />
      </div>
    </TableCell>
    {/* Chevron */}
    <TableCell className='py-4 w-12'>
      <Skeleton className='h-4 w-4 rounded' />
    </TableCell>
  </TableRow>
);

export default SupportTicketsTableSkeleton;
