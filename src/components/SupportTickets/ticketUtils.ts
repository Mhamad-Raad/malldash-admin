import type { TicketStatus } from '@/interfaces/SupportTicket.interface';
import type { TFunction } from 'i18next';

export const formatDateTime = (date: string | Date | null | undefined) => {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString();
};

export const getStatusBadgeClass = (status: TicketStatus) => {
  if (status === 0)
    return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700';
  if (status === 1)
    return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700';
  if (status === 2)
    return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700';
  if (status === 3)
    return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-600';
  return '';
};

export const getPriorityBadgeClass = (priority: number) => {
  if (priority === 0)
    return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-600';
  if (priority === 1)
    return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700';
  if (priority === 2)
    return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700';
  if (priority === 3)
    return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700';
  return '';
};

export const getStatusText = (status: TicketStatus, t: TFunction) => {
  if (status === 0) return t('status.open');
  if (status === 1) return t('status.inProgress');
  if (status === 2) return t('status.resolved');
  if (status === 3) return t('status.closed');
  return t('status.unknown');
};

export const getPriorityText = (priority: number, t: TFunction) => {
  if (priority === 0) return t('priority.low');
  if (priority === 1) return t('priority.medium');
  if (priority === 2) return t('priority.high');
  if (priority === 3) return t('priority.urgent');
  return String(priority);
};
