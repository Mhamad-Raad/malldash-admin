import { useTranslation } from 'react-i18next';
import { User, Mail, Clock } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

import type { SupportTicketDetailInterface } from '@/data/SupportTickets';
import { formatDateTime } from '@/components/SupportTickets/ticketUtils';

interface RequesterCardProps {
  ticket: SupportTicketDetailInterface;
}

const RequesterCard = ({ ticket }: RequesterCardProps) => {
  const { t } = useTranslation('supportTickets');

  return (
    <Card className='shadow-sm'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-base'>
          <User className='h-4 w-4 text-muted-foreground' />
          {t('detail.requester.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center gap-3'>
          <Avatar className='h-11 w-11'>
            <AvatarFallback className='bg-primary/10 text-primary font-semibold text-sm'>
              {ticket.userName
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0'>
            <p className='text-sm font-semibold truncate'>{ticket.userName}</p>
            <p className='text-xs text-muted-foreground'>
              {t('detail.requester.userId', { id: ticket.userId })}
            </p>
          </div>
        </div>

        <Separator />

        <div className='space-y-2.5'>
          <div className='flex items-center gap-2.5 text-sm'>
            <Mail className='h-4 w-4 text-muted-foreground shrink-0' />
            <span className='text-muted-foreground truncate'>
              {ticket.userEmail}
            </span>
          </div>
          <div className='flex items-center gap-2.5 text-sm'>
            <Clock className='h-4 w-4 text-muted-foreground shrink-0' />
            <span className='text-muted-foreground'>
              {t('detail.created', {
                date: formatDateTime(ticket.createdAt),
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequesterCard;
