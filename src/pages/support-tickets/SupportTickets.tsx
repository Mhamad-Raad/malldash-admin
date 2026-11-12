import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import type { AppDispatch, RootState } from '@/store/store';
import { fetchSupportTickets } from '@/store/slices/supportTicketsSlice';
import type { TicketStatus } from '@/interfaces/SupportTicket.interface';

import SupportTicketsFilters from '@/components/SupportTickets/SupportTicketsFilters';
import SupportTicketsTable from '@/components/SupportTickets/SupportTicketsTable';

const SupportTickets = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { tickets, loading, error } = useSelector(
    (state: RootState) => state.supportTickets
  );

  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const statusParam = searchParams.get('status');
  const status: TicketStatus | 'all' | null =
    statusParam !== null && statusParam !== 'all'
      ? (Number(statusParam) as TicketStatus)
      : statusParam === 'all'
        ? 'all'
        : null;
  const search = searchParams.get('search') || '';

  useEffect(() => {
    dispatch(
      fetchSupportTickets({
        limit,
        page,
        status,
        search,
      })
    );
  }, [dispatch, limit, page, status, search]);

  const isEmpty = !loading && tickets.length === 0 && !error;

  return (
    <section className='w-full h-full flex flex-col gap-6 overflow-hidden'>
      <SupportTicketsFilters />
      <div className='flex-1 min-h-0'>
        {isEmpty ? (
          <div className='flex items-center justify-center h-full text-muted-foreground'>
            No support tickets found.
          </div>
        ) : (
          <SupportTicketsTable />
        )}
      </div>
    </section>
  );
};

export default SupportTickets;
