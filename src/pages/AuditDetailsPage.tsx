import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchAuditLogDetails, clearSelectedLog } from '@/store/slices/auditSlice';
import {
  AuditDetailsHeader,
  AuditDetailsSidebar,
  AuditChangesPanel,
  formatValue,
} from '@/components/History/AuditDetails';
import type { RootState, AppDispatch } from '@/store/store';

const AuditDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('history');
  const dispatch = useDispatch<AppDispatch>();
  const { selectedLog, detailsLoading, error } = useSelector(
    (state: RootState) => state.audit
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchAuditLogDetails(id));
    }
    return () => {
      dispatch(clearSelectedLog());
    };
  }, [id, dispatch]);

  const formatChanges = () => {
    if (!selectedLog) return [];

    const oldValues = selectedLog.oldValues || {};
    const newValues = selectedLog.newValues || {};

    const allKeys = Array.from(
      new Set([...Object.keys(oldValues), ...Object.keys(newValues)])
    );

    return allKeys.map((key) => ({
      field: key,
      oldValue: formatValue(oldValues[key]),
      newValue: formatValue(newValues[key]),
    }));
  };

  const changes = formatChanges();
  const isCreated =
    selectedLog?.action?.toLowerCase() === 'created' ||
    selectedLog?.action?.toLowerCase() === 'create';
  const isDeleted =
    selectedLog?.action?.toLowerCase() === 'deleted' ||
    selectedLog?.action?.toLowerCase() === 'delete';

  if (error) {
    return (
      <section className='w-full h-full flex flex-col gap-4 overflow-hidden'>
        <div className='flex items-center gap-3'>
          <Button variant='ghost' size='icon' onClick={() => navigate('/history')}>
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-xl font-semibold'>{t('details.title')}</h1>
        </div>
        <Card className='border-destructive/50'>
          <CardContent className='py-8 text-center text-destructive'>
            <p>{t('details.errorLoading', { message: error })}</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (detailsLoading) {
    return (
      <section className='w-full h-full flex flex-col gap-4 overflow-hidden'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-9 w-9 rounded-md' />
          <Skeleton className='h-6 w-48' />
        </div>
        <div className='flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4'>
          <Skeleton className='h-full rounded-xl' />
          <Skeleton className='h-full lg:col-span-2 rounded-xl' />
        </div>
      </section>
    );
  }

  if (!selectedLog) {
    return (
      <section className='w-full h-full flex flex-col gap-4 overflow-hidden'>
        <div className='flex items-center gap-3'>
          <Button variant='ghost' size='icon' onClick={() => navigate('/history')}>
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-xl font-semibold'>{t('details.title')}</h1>
        </div>
        <div className='flex-1 flex items-center justify-center'>
          <p className='text-muted-foreground'>{t('details.notFound')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className='w-full h-full flex flex-col gap-4 overflow-x-hidden overflow-y-auto'>
      {/* Header */}
      <AuditDetailsHeader log={selectedLog} id={id || ''} />

      {/* Content */}
      <div className='flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0 overflow-hidden'>
        {/* Left Column - Details */}
        <AuditDetailsSidebar log={selectedLog} isDeleted={isDeleted} />

        {/* Right Column - Changes */}
        <AuditChangesPanel
          changes={changes}
          isCreated={isCreated}
          isDeleted={isDeleted}
        />
      </div>
    </section>
  );
};

export default AuditDetailsPage;
