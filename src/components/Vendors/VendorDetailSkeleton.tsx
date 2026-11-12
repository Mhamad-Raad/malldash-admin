import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const VendorDetailSkeleton = () => {
  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <Button variant='ghost' disabled>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Vendors
        </Button>
        <div className='flex gap-2'>
          <Skeleton className='h-10 w-32' />
          <Skeleton className='h-10 w-24' />
        </div>
      </div>

      {/* Vendor Information Card */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col md:flex-row gap-6'>
            {/* Square Image Section */}
            <div className='flex-shrink-0'>
              <Skeleton className='w-full md:w-56 aspect-square rounded-lg' />
              <div className='mt-4 space-y-2'>
                <Skeleton className='h-10 w-full' />
              </div>
            </div>

            {/* Vendor Details Section */}
            <div className='flex-1 space-y-4'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-28' />
                <Skeleton className='h-10 w-full' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-28' />
                <Skeleton className='h-10 w-full' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-32 w-full' />
              </div>
              <Skeleton className='h-3 w-32' />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Working Hours Card */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-5' />
            <Skeleton className='h-6 w-32' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-10 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-10 w-full' />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Owner Information Card */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-5' />
            <Skeleton className='h-6 w-40' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-10 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-10 w-full' />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Section */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-6 w-32' />
            <Skeleton className='h-10 w-32' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='flex items-center justify-between p-4 border rounded-lg'
              >
                <div className='flex items-center gap-3'>
                  <Skeleton className='h-12 w-12 rounded' />
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-32' />
                    <Skeleton className='h-3 w-24' />
                  </div>
                </div>
                <Skeleton className='h-8 w-20' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDetailSkeleton;
