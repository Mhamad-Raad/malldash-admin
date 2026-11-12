import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export const OrderDisplaySkeleton = () => {
  return (
    <div className='h-full overflow-hidden'>
      <div className='flex flex-col h-full'>
        {/* Header Skeleton */}
        <div className='px-6 py-5 border-b bg-muted/30'>
          <div className='flex items-center justify-between mb-2'>
            <div className='space-y-2'>
              <Skeleton className='h-7 w-32' />
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-4 rounded-full' />
                <Skeleton className='h-4 w-40' />
              </div>
            </div>
            <Skeleton className='h-6 w-20 rounded-full' />
          </div>
        </div>

        {/* Customer & Delivery Skeleton */}
        <div className='px-6 py-5 border-b'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x'>
            {/* Customer Skeleton */}
            <div className='pb-6 md:pb-0 md:pr-6'>
              <Skeleton className='h-3 w-16 mb-3' />
              <div className='flex gap-4'>
                <Skeleton className='h-16 w-16 rounded-full flex-shrink-0' />
                <div className='space-y-2.5 flex-1'>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className='flex items-start gap-3'>
                      <Skeleton className='h-4 w-4 rounded mt-0.5 flex-shrink-0' />
                      <div className='space-y-1 flex-1'>
                        <Skeleton className='h-3 w-12' />
                        <Skeleton className='h-4 w-full max-w-[200px]' />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery Skeleton */}
            <div className='pt-6 md:pt-0 md:pl-6'>
              <div className='flex items-center gap-2 mb-3'>
                <Skeleton className='h-3.5 w-3.5 rounded' />
                <Skeleton className='h-3 w-28' />
              </div>
              <div className='space-y-2.5'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='flex items-start gap-3'>
                    <Skeleton className='h-4 w-4 rounded mt-0.5 flex-shrink-0' />
                    <div className='space-y-1'>
                      <Skeleton className='h-3 w-16' />
                      <Skeleton className='h-4 w-32' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Skeleton */}
        <div className='px-6 py-5 border-b'>
          <Skeleton className='h-3 w-20 mb-4' />
          <div className='space-y-4'>
            {[1, 2].map((i) => (
              <div key={i} className='flex items-center gap-4'>
                <Skeleton className='h-16 w-16 rounded-lg' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-48' />
                  <Skeleton className='h-3 w-32' />
                </div>
                <Skeleton className='h-5 w-16' />
              </div>
            ))}
          </div>
        </div>

        {/* Summary Skeleton */}
        <div className='px-6 py-5 border-b bg-muted/10'>
          <Skeleton className='h-3 w-16 mb-4' />
          <div className='space-y-3'>
            <div className='flex justify-between'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-20' />
            </div>
            <div className='flex justify-between'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-16' />
            </div>
            <Separator className='my-3' />
            <div className='flex justify-between pt-1'>
              <Skeleton className='h-5 w-12' />
              <Skeleton className='h-6 w-24' />
            </div>
          </div>
        </div>

        {/* Activity Skeleton */}
        <div className='px-6 py-5'>
          <Skeleton className='h-3 w-16 mb-4' />
          <div className='flex items-start gap-3'>
            <Skeleton className='h-9 w-9 rounded-full' />
            <div className='space-y-1.5 pt-1.5'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-3 w-40' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
