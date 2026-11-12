import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Hash, MessageSquare, User, Clock, ChevronRight } from 'lucide-react';
import type { RootState } from '@/store/store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import CustomTablePagination from '@/components/CustomTablePagination';
import SupportTicketsTableSkeleton from './SupportTicketsTableSkeleton';
import type { SupportTicket } from '@/interfaces/SupportTicket.interface';

const statusColorMap: Record<number, string> = {
  0: 'bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/30 dark:border-blue-500/40',
  1: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/30 dark:border-amber-500/40',
  2: 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/30 dark:border-emerald-500/40',
  3: 'bg-gray-500/10 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400 border-gray-500/30 dark:border-gray-500/40',
};

const priorityColorMap: Record<number, string> = {
  0: 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/30 dark:border-emerald-500/40',
  1: 'bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/30 dark:border-blue-500/40',
  2: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/30 dark:border-amber-500/40',
  3: 'bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-500/30 dark:border-red-500/40',
};

const formatDate = (value: string | undefined | null) => {
  if (!value) return '-';
  const date = new Date(value);
  return date.toLocaleString();
};

const SupportTicketsTable = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('supportTickets');
  const { tickets, loading, error, total } = useSelector(
    (state: RootState) => state.supportTickets
  );

  const handleRowClick = (id: number) => {
    navigate(`/support-tickets/${id}`);
  };

  if (error) {
    return (
      <div className='rounded-lg border bg-card shadow-sm p-8'>
        <div className='text-center text-destructive'>
          {t('table.error', { message: error })}
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-xl border bg-card shadow-sm flex flex-col overflow-hidden'>
      <ScrollArea className='h-[calc(100vh-280px)]'>
        <Table className='w-full min-w-[900px]'>
          <TableHeader>
            <TableRow className='hover:bg-transparent border-b bg-muted/50'>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.headers.ticket')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.headers.subject')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.headers.user')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.headers.status')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.headers.priority')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.headers.created')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 w-12 bg-muted/50 backdrop-blur-sm border-b h-12'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <SupportTicketsTableSkeleton key={`skeleton-${index}`} />
              ))
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='h-32 text-center text-sm text-muted-foreground'
                >
                  {t('table.empty')}
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket: SupportTicket) => (
                <TableRow
                  key={ticket.id}
                  className='group hover:bg-muted/50 transition-all cursor-pointer border-b last:border-0'
                  onClick={() => handleRowClick(ticket.id)}
                >
                  {/* Ticket Number */}
                  <TableCell className='font-medium py-4'>
                    <div className='flex items-center gap-2.5'>
                      <div className='flex items-center justify-center w-7 h-7 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors'>
                        <Hash className='h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors' />
                      </div>
                      <span className='font-semibold text-base group-hover:text-primary transition-colors'>
                        {ticket.ticketNumber || ticket.id}
                      </span>
                    </div>
                  </TableCell>
                  {/* Subject */}
                  <TableCell className='py-4'>
                    <div className='flex items-center gap-2.5 max-w-xs'>
                      <div className='flex items-center justify-center w-6 h-6 rounded-md bg-muted group-hover:bg-primary/10 transition-colors shrink-0'>
                        <MessageSquare className='h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors' />
                      </div>
                      <span className='text-base text-foreground/80 line-clamp-2'>
                        {ticket.subject}
                      </span>
                    </div>
                  </TableCell>
                  {/* User */}
                  <TableCell className='py-4'>
                    <div className='flex items-center gap-2.5'>
                      <div className='flex items-center justify-center w-6 h-6 rounded-md bg-muted group-hover:bg-primary/10 transition-colors'>
                        <User className='h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors' />
                      </div>
                      <span className='text-base font-medium text-foreground/80'>
                        {ticket.userName || '-'}
                      </span>
                    </div>
                  </TableCell>
                  {/* Status */}
                  <TableCell className='py-4'>
                    <Badge
                      variant='outline'
                      className={`text-base font-semibold border px-3 py-1 ${
                        statusColorMap[ticket.status] || ''
                      }`}
                    >
                      {ticket.status === 0
                        ? t('status.open')
                        : ticket.status === 1
                        ? t('status.inProgress')
                        : ticket.status === 2
                        ? t('status.resolved')
                        : ticket.status === 3
                        ? t('status.closed')
                        : t('status.unknown')}
                    </Badge>
                  </TableCell>
                  {/* Priority */}
                  <TableCell className='py-4'>
                    <Badge
                      variant='outline'
                      className={`text-base font-semibold border px-3 py-1 ${
                        priorityColorMap[ticket.priority] || ''
                      }`}
                    >
                      {ticket.priority === 0
                        ? t('priority.low')
                        : ticket.priority === 1
                        ? t('priority.medium')
                        : ticket.priority === 2
                        ? t('priority.high')
                        : ticket.priority === 3
                        ? t('priority.urgent')
                        : ticket.priority}
                    </Badge>
                  </TableCell>
                  {/* Created */}
                  <TableCell className='py-4'>
                    <div className='flex items-center gap-2.5'>
                      <div className='flex items-center justify-center w-6 h-6 rounded-md bg-muted group-hover:bg-primary/10 transition-colors'>
                        <Clock className='h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors' />
                      </div>
                      <span className='text-sm text-muted-foreground'>
                        {formatDate(ticket.createdAt)}
                      </span>
                    </div>
                  </TableCell>
                  {/* Chevron */}
                  <TableCell className='py-4 w-12'>
                    <ChevronRight className='h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all' />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      {/* Pagination */}
      <div className='border-t px-4 py-3 bg-muted/20'>
        <CustomTablePagination
          total={total}
          suggestions={[10, 20, 40, 50, 100]}
        />
      </div>
    </div>
  );
};

export default SupportTicketsTable;
