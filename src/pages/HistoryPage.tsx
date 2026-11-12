import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import HistoryFilters from '@/components/History/HistoryFilters';
import HistoryTable from '@/components/History/HistoryTable';
import { fetchAuditLogs } from '@/store/slices/auditSlice';
import type { AppDispatch } from '@/store/store';

const HistoryPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 40;
    const entityName = searchParams.get('entityName') || undefined;
    const fromDate = searchParams.get('fromDate') || undefined;
    const toDate = searchParams.get('toDate') || undefined;

    dispatch(
      fetchAuditLogs({
        page,
        limit,
        entityName,
        fromDate,
        toDate,
      })
    );
  }, [dispatch, searchParams]);

  return (
    <section className='w-full h-full flex flex-col gap-4 overflow-hidden'>
      <HistoryFilters />
      <div className='flex-1 min-h-0 flex flex-col'>
        <HistoryTable />
      </div>
    </section>
  );
};

export default HistoryPage;

