import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

const ProductsTableSkeleton = () => (
  <TableRow className='border-b'>
    {/* Product Info Skeleton - matches Image + Name */}
    <TableCell className='font-medium py-4'>
      <div className='flex items-center gap-3 h-11'>
        <Skeleton className='h-11 w-11 rounded-lg shrink-0 border-2 border-transparent' />
        <div className='flex flex-col gap-0.5 justify-center'>
          <Skeleton className='h-3.5 w-32' />
          <Skeleton className='h-3 w-20' />
        </div>
      </div>
    </TableCell>

    {/* Price Skeleton */}
    <TableCell className='py-4'>
      <Skeleton className='h-4 w-20' />
    </TableCell>

    {/* Category Skeleton */}
    <TableCell className='py-4'>
      <Skeleton className='h-6 w-24 rounded-md' />
    </TableCell>

    {/* Vendor Skeleton */}
    <TableCell className='py-4'>
      <Skeleton className='h-4 w-32' />
    </TableCell>

    {/* Stock Status Skeleton */}
    <TableCell className='py-4'>
      <Skeleton className='h-6 w-20 rounded-md' />
    </TableCell>
    
    {/* Actions Skeleton */}
    <TableCell className='py-4 w-12'>
      <Skeleton className='h-4 w-4 rounded' />
    </TableCell>
  </TableRow>
);

export default ProductsTableSkeleton;
