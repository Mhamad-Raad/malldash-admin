import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AlertCircle } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SupportTicketDetailErrorProps {
  error?: string | null;
}

const SupportTicketDetailError = ({
  error,
}: SupportTicketDetailErrorProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('supportTickets');

  return (
    <section className='w-full h-full flex flex-col items-center justify-center gap-6 overflow-hidden'>
      <div className='max-w-md w-full'>
        <Card className='border-destructive/20 shadow-lg'>
          <CardContent className='p-8 flex flex-col items-center justify-center text-center gap-4'>
            <div className='h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center'>
              <AlertCircle className='h-8 w-8 text-destructive' />
            </div>
            <div className='space-y-1.5'>
              <h2 className='text-xl font-semibold'>
                {t('detail.errorTitle')}
              </h2>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {error || t('detail.errorDescription')}
              </p>
            </div>
            <div className='flex gap-3 mt-2'>
              <Button
                variant='outline'
                onClick={() => navigate('/support-tickets')}
              >
                <ArrowLeft className='h-4 w-4 me-2' />
                {t('detail.backToTickets')}
              </Button>
              <Button variant='default' onClick={() => navigate(0)}>
                {t('detail.retry')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SupportTicketDetailError;
