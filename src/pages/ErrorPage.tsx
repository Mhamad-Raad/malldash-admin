import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouteError } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const ErrorPage = () => {
  const error: any = useRouteError();

  return (
    <div className='flex flex-col min-h-screen items-center justify-center bg-background'>
      <Card className='w-full max-w-md shadow-lg border-0 text-center animate-fade-in bg-card text-card-foreground'>
        <CardContent className='py-12'>
          <AlertTriangle className='mx-auto h-12 w-12 text-destructive mb-4' />
          <h2 className='text-2xl font-bold mb-2'>Something went wrong</h2>
          <p className='mb-2 text-muted-foreground'>
            Sorry, an unexpected error occurred.
          </p>
          <pre className='mb-4 text-xs text-muted-foreground rounded bg-muted p-2'>
            {error?.statusText || error?.message || String(error)}
          </pre>
          <Button asChild size='lg' className='w-full'>
            <a href='/'>Back to Home</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage;
