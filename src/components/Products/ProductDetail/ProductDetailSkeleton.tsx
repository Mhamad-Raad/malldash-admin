import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ProductDetailSkeleton = () => (
  <div className='flex flex-col gap-6 p-4 md:p-6'>
    {/* Header */}
    <div className='flex items-center justify-between mb-6'>
      <Button variant='ghost' disabled>
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back to Products
      </Button>
      <div className='flex gap-2'>
        <Skeleton className='h-10 w-32 rounded-md' />
        <Skeleton className='h-10 w-32 rounded-md' />
      </div>
    </div>

    {/* Product card */}
    <div className='mb-6'>
      <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
        <Skeleton className='h-36 w-36 rounded-xl mb-2' />
        <div className='flex-1 w-full flex flex-col gap-3 mb-2'>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='h-11 w-full max-w-md' />
          <Skeleton className='h-6 w-32 rounded-full' />
        </div>
      </div>
    </div>

    {/* Information grid */}
    <div className='grid gap-6 lg:grid-cols-2'>
      {/* Pricing skeleton */}
      <div>
        <Skeleton className='h-6 w-1/2 mb-4' />
        <Skeleton className='h-11 w-full mb-4' />
        <Skeleton className='h-11 w-full' />
      </div>
      {/* Status skeleton */}
      <div>
        <Skeleton className='h-6 w-2/3 mb-4' />
        <Skeleton className='h-16 w-full mb-4 rounded-lg' />
        <Skeleton className='h-16 w-full rounded-lg' />
      </div>
      {/* Category skeleton */}
      <div className='lg:col-span-2'>
        <Skeleton className='h-6 w-1/2 mb-4' />
        <Skeleton className='h-11 w-full mb-4' />
        <Skeleton className='h-24 w-full' />
      </div>
    </div>
  </div>
);

export default ProductDetailSkeleton;
