import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ConfirmModal, {
  type ChangeDetail,
} from '@/components/ui/Modals/ConfirmModal';
import { toast } from 'sonner';
import { showValidationErrors } from '@/lib/utils';

import {
  fetchSupportTicketById,
  updateSupportTicketStatus,
} from '@/data/SupportTickets';
import type { SupportTicketDetailInterface } from '@/data/SupportTickets';
import type { TicketStatus } from '@/interfaces/SupportTicket.interface';

import {
  formatDateTime,
  getStatusBadgeClass,
  getStatusText,
  getPriorityBadgeClass,
  getPriorityText,
} from '@/components/SupportTickets/ticketUtils';
import ImageLightbox from '@/components/SupportTickets/ImageLightbox';
import SupportTicketDetailSkeleton from '@/components/SupportTickets/SupportTicketDetailSkeleton';
import SupportTicketDetailError from '@/components/SupportTickets/SupportTicketDetailError';
import TicketDetailsCard from '@/components/SupportTickets/TicketDetailsCard';
import AdminNotesCard from '@/components/SupportTickets/AdminNotesCard';
import RequesterCard from '@/components/SupportTickets/RequesterCard';
import AttachmentsCard from '@/components/SupportTickets/AttachmentsCard';

const SupportTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('supportTickets');

  const [ticket, setTicket] = useState<SupportTicketDetailInterface | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<TicketStatus | null>(null);
  const [adminNotesDraft, setAdminNotesDraft] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      const numericId = Number(id);

      if (Number.isNaN(numericId)) {
        setError(t('detail.invalidId'));
        setLoading(false);
        return;
      }

      const result = await fetchSupportTicketById(numericId);

      if ('error' in result) {
        setError(result.error);
        setTicket(null);
      } else {
        setTicket(result);
        setError(null);
        setStatusDraft(result.status);
        setAdminNotesDraft(result.adminNotes ?? '');
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const hasChanges = useMemo(() => {
    if (!ticket) return false;
    const statusChanged = statusDraft !== null && statusDraft !== ticket.status;
    const notesChanged = (ticket.adminNotes ?? '') !== adminNotesDraft;
    return statusChanged || notesChanged;
  }, [ticket, statusDraft, adminNotesDraft]);

  const changes = useMemo((): ChangeDetail[] => {
    if (!ticket) return [];
    const list: ChangeDetail[] = [];

    if (statusDraft !== null && statusDraft !== ticket.status) {
      list.push({
        field: t('detail.changes.fieldStatus'),
        oldValue: getStatusText(ticket.status, t),
        newValue: getStatusText(statusDraft, t),
      });
    }

    if ((ticket.adminNotes ?? '') !== adminNotesDraft) {
      list.push({
        field: t('detail.changes.fieldAdminNotes'),
        oldValue:
          ticket.adminNotes && ticket.adminNotes.trim().length > 0
            ? t('detail.changes.hasNotes')
            : t('detail.changes.empty'),
        newValue:
          adminNotesDraft.trim().length > 0
            ? t('detail.changes.hasNotes')
            : t('detail.changes.empty'),
      });
    }

    return list;
  }, [ticket, statusDraft, adminNotesDraft]);

  const handleToggleUpdateModal = () => {
    if (!hasChanges || !ticket) return;
    setShowUpdateModal((v) => !v);
  };

  const handleUpdateTicket = async () => {
    if (!ticket || !id || statusDraft === null) return;

    setUpdating(true);

    const body = {
      status: statusDraft,
      adminNotes: adminNotesDraft.trim().length > 0 ? adminNotesDraft : null,
    };

    const numericId = Number(id);

    const result = await updateSupportTicketStatus(numericId, body);

    if ('error' in result) {
      const errors = (result as any).errors;
      if (errors && Array.isArray(errors)) {
        showValidationErrors(
          t('detail.update.failedTitle'),
          errors,
          t('detail.update.failedGeneric')
        );
      } else {
        showValidationErrors(
          t('detail.update.failedTitle'),
          result.error,
          t('detail.update.failedGeneric')
        );
      }
      setUpdating(false);
      return;
    }

    setTicket(result);
    setStatusDraft(result.status);
    setAdminNotesDraft(result.adminNotes ?? '');
    setUpdating(false);
    setShowUpdateModal(false);
    toast.success(t('detail.update.success'));
  };

  const openImageViewer = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) return <SupportTicketDetailSkeleton />;
  if (error || !ticket) return <SupportTicketDetailError error={error} />;

  return (
    <section className='w-full h-full flex flex-col gap-6 overflow-y-auto'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <Button
            variant='outline'
            size='icon'
            className='rounded-full h-10 w-10 shrink-0'
            onClick={() => navigate('/support-tickets')}
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <div className='min-w-0'>
            <div className='flex items-center gap-2.5 flex-wrap'>
              <h1 className='text-2xl font-bold tracking-tight'>
                {t('detail.ticketHeading', {
                  ticketNumber: ticket.ticketNumber || ticket.id,
                })}
              </h1>
              <Badge
                variant='outline'
                className={`text-xs font-semibold px-2.5 py-0.5 ${getPriorityBadgeClass(
                  ticket.priority
                )}`}
              >
                {getPriorityText(ticket.priority, t)}
              </Badge>
            </div>
            <p className='text-sm text-muted-foreground mt-0.5'>
              {t('detail.createdAt', {
                date: formatDateTime(ticket.createdAt),
              })}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Select
            value={String(statusDraft ?? ticket.status)}
            onValueChange={(value) =>
              setStatusDraft(Number(value) as TicketStatus)
            }
            disabled={updating}
          >
            <SelectTrigger className='w-[160px]'>
              <SelectValue placeholder={t('detail.statusSelectPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>{t('status.open')}</SelectItem>
              <SelectItem value='1'>{t('status.inProgress')}</SelectItem>
              <SelectItem value='2'>{t('status.resolved')}</SelectItem>
              <SelectItem value='3'>{t('status.closed')}</SelectItem>
            </SelectContent>
          </Select>
          <Badge
            variant='outline'
            className={`text-xs font-semibold px-3 py-1.5 ${getStatusBadgeClass(
              statusDraft ?? ticket.status
            )}`}
          >
            {getStatusText(statusDraft ?? ticket.status, t)}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0'>
        <div className='lg:col-span-2 flex flex-col gap-6 min-h-0'>
          <TicketDetailsCard ticket={ticket} />
          <AdminNotesCard
            value={adminNotesDraft}
            onChange={setAdminNotesDraft}
            disabled={updating}
          />
        </div>

        <div className='flex flex-col gap-6'>
          <RequesterCard ticket={ticket} />
          <AttachmentsCard
            imageUrls={ticket.imageUrls ?? []}
            onImageClick={openImageViewer}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className='flex justify-end gap-3 pt-2 border-t'>
        <Button
          variant='outline'
          onClick={() => navigate('/support-tickets')}
          disabled={updating}
        >
          {t('detail.back')}
        </Button>
        <Button
          onClick={handleToggleUpdateModal}
          disabled={!hasChanges || updating}
        >
          {t('detail.saveChanges')}
        </Button>
      </div>

      <ConfirmModal
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        onConfirm={handleUpdateTicket}
        title={t('detail.updateModal.title')}
        description={t('detail.updateModal.description')}
        confirmType='warning'
        confirmLabel={t('detail.updateModal.confirmLabel')}
        cancelLabel={t('detail.updateModal.cancelLabel')}
        changes={changes}
      />

      <ImageLightbox
        images={ticket.imageUrls ?? []}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        altPrefix={t('detail.attachments.alt', { index: '' })}
      />
    </section>
  );
};

export default SupportTicketDetail;
