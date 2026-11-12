import { ShoppingCart, SearchX, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmptyState = () => {
  return (
    <div className='flex flex-col items-center justify-center h-full text-center p-8 rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-gradient-to-b from-muted/30 to-transparent'>
      <div className='relative mb-6'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-2xl scale-150' />
        <div className='relative p-6 rounded-full bg-gradient-to-br from-muted to-muted/50 border border-border/50'>
          <ShoppingCart className='w-12 h-12 text-muted-foreground' />
        </div>
        <div className='absolute -bottom-1 -right-1 p-2 rounded-full bg-background border shadow-lg'>
          <SearchX className='w-4 h-4 text-muted-foreground' />
        </div>
      </div>

      <h2 className='text-2xl font-bold mb-2'>No orders found</h2>
      <p className='text-muted-foreground max-w-sm mb-6'>
        We couldn't find any orders matching your criteria.
      </p>

      <div className='flex flex-col sm:flex-row items-center gap-3'>
        <Button
          variant='outline'
          onClick={() => window.location.reload()}
          className='gap-2'
        >
          <RefreshCcw className='size-4' />
          Refresh Page
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
