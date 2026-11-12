import { TableRow, TableCell } from '@/components/ui/table';

const BuildingsTableSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={`skeleton-${index}`} className='border-b'>
        <TableCell className='py-4'>
          <div className='flex items-center gap-3'>
            <div className='h-11 w-11 bg-muted rounded-lg animate-pulse' />
            <div className='flex flex-col gap-2 flex-1'>
              <div className='h-4 bg-muted rounded w-32 animate-pulse' />
            </div>
          </div>
        </TableCell>
        <TableCell className='text-center'>
          <div className='flex items-center justify-center gap-2'>
            <div className='h-4 w-4 bg-muted rounded animate-pulse' />
            <div className='h-4 bg-muted rounded w-8 animate-pulse' />
          </div>
        </TableCell>
        <TableCell className='text-center'>
          <div className='flex items-center justify-center gap-2'>
            <div className='h-4 w-4 bg-muted rounded animate-pulse' />
            <div className='h-4 bg-muted rounded w-8 animate-pulse' />
          </div>
        </TableCell>
        <TableCell className='text-center'>
          <div className='flex items-center justify-center gap-2'>
            <div className='h-4 w-4 bg-muted rounded animate-pulse' />
            <div className='h-4 bg-muted rounded w-8 animate-pulse' />
          </div>
        </TableCell>
        <TableCell>
          <div className='h-4 w-4 bg-muted rounded animate-pulse' />
        </TableCell>
      </TableRow>
    ))}
  </>
);

export default BuildingsTableSkeleton;
