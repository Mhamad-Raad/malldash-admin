import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Ghost } from 'lucide-react';

const NotFound = () => (
  <div className='flex flex-col min-h-screen items-center justify-center bg-background'>
    <Card className='w-full max-w-md shadow-lg border-0 text-center animate-fade-in bg-card text-card-foreground'>
      <CardContent className='py-12'>
        <Ghost className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
        <h2 className='text-2xl font-bold mb-2'>404 - Not Found</h2>
        <p className='mb-6 text-muted-foreground'>
          This page doesn’t exist or has been moved.
        </p>
        <Button asChild size='lg' className='w-full'>
          <Link to='/'>Go Home</Link>
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default NotFound;
