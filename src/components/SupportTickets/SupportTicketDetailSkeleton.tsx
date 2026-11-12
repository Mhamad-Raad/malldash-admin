import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SupportTicketDetailSkeleton = () => {
  return (
    <section className='w-full h-full flex flex-col gap-6 overflow-hidden'>
      <div className='flex items-center gap-4'>
        <Skeleton className='h-10 w-10 rounded-full' />
        <div className='space-y-2 flex-1'>
          <Skeleton className='h-7 w-48' />
          <Skeleton className='h-4 w-72' />
        </div>
        <Skeleton className='h-9 w-36' />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardContent className='p-6 space-y-4'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-5/6' />
              <Skeleton className='h-32 w-full' />
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-6 space-y-4'>
              <Skeleton className='h-5 w-32' />
              <Skeleton className='h-24 w-full' />
            </CardContent>
          </Card>
        </div>
        <div className='space-y-6'>
          <Card>
            <CardContent className='p-6 space-y-3'>
              <Skeleton className='h-12 w-12 rounded-full' />
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-48' />
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-6 space-y-3'>
              <Skeleton className='h-5 w-24' />
              <div className='grid grid-cols-2 gap-2'>
                <Skeleton className='h-20 w-full rounded-lg' />
                <Skeleton className='h-20 w-full rounded-lg' />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SupportTicketDetailSkeleton;
