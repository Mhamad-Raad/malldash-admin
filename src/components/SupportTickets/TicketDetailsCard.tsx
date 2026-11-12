import { useTranslation } from 'react-i18next';
import { FileText, Tag, CalendarCheck } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import type { SupportTicketDetailInterface } from '@/data/SupportTickets';
import {
  formatDateTime,
  getPriorityBadgeClass,
  getPriorityText,
} from '@/components/SupportTickets/ticketUtils';

interface TicketDetailsCardProps {
  ticket: SupportTicketDetailInterface;
}

const TicketDetailsCard = ({ ticket }: TicketDetailsCardProps) => {
  const { t } = useTranslation('supportTickets');

  return (
    <Card className='shadow-sm'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-base'>
          <FileText className='h-4 w-4 text-muted-foreground' />
          {t('detail.fields.ticketDetails')}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-5'>
        {/* Subject */}
        <div>
          <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5'>
            {t('detail.fields.subject')}
          </p>
          <p className='text-base font-medium leading-snug'>
            {ticket.subject}
          </p>
        </div>

        <Separator />

        {/* Description */}
        <div>
          <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
            {t('detail.fields.description')}
          </p>
          <ScrollArea className='max-h-64 rounded-lg border bg-muted/20 p-4'>
            <p className='text-sm whitespace-pre-line leading-relaxed'>
              {ticket.description}
            </p>
          </ScrollArea>
        </div>

        <Separator />

        {/* Meta row */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex items-start gap-3'>
            <div className='h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5'>
              <Tag className='h-4 w-4 text-muted-foreground' />
            </div>
            <div>
              <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                {t('detail.fields.priority')}
              </p>
              <Badge
                variant='outline'
                className={`mt-1 text-xs font-medium ${getPriorityBadgeClass(
                  ticket.priority
                )}`}
              >
                {getPriorityText(ticket.priority, t)}
              </Badge>
            </div>
          </div>

          <div className='flex items-start gap-3'>
            <div className='h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5'>
              <CalendarCheck className='h-4 w-4 text-muted-foreground' />
            </div>
            <div>
              <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                {t('detail.fields.resolvedAt')}
              </p>
              <p className='text-sm mt-1'>
                {ticket.resolvedAt
                  ? formatDateTime(ticket.resolvedAt)
                  : t('detail.fields.notResolvedYet')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketDetailsCard;
