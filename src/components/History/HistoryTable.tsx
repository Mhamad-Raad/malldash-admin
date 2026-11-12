import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  PenLine,
  Plus,
  Trash2,
  Eye,
  ChevronRight,
  User,
  Package,
  Building2,
  Store,
  Home,
  FileText,
  Clock,
} from 'lucide-react';
import CustomTablePagination from '../CustomTablePagination';
import type { RootState } from '@/store/store';
import type { AuditLog } from '@/interfaces/Audit.interface';

const getActionConfig = (
  action: string,
  t: (key: string, options?: any) => string,
) => {
  const actionLower = action?.toLowerCase() || '';
  if (actionLower === 'created' || actionLower === 'create') {
    return {
      icon: Plus,
      color:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      label: t('table.actions.created'),
    };
  }
  if (actionLower === 'updated' || actionLower === 'update') {
    return {
      icon: PenLine,
      color:
        'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
      label: t('table.actions.updated'),
    };
  }
  if (actionLower === 'deleted' || actionLower === 'delete') {
    return {
      icon: Trash2,
      color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
      label: t('table.actions.deleted'),
    };
  }
  if (actionLower === 'viewed' || actionLower === 'view') {
    return {
      icon: Eye,
      color:
        'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
      label: t('table.actions.viewed'),
    };
  }
  return {
    icon: FileText,
    color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30',
    label: action || t('table.actions.unknown'),
  };
};

const getEntityIcon = (entityName: string) => {
  const entityLower = entityName?.toLowerCase() || '';
  if (entityLower === 'user') return User;
  if (entityLower === 'product') return Package;
  if (entityLower === 'building') return Building2;
  if (entityLower === 'vendor') return Store;
  if (entityLower === 'apartment') return Home;
  return FileText;
};

const formatRelativeTime = (
  timestamp: string,
  t: (key: string, options?: any) => string,
) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t('table.relative.justNow');
  if (diffMins < 60) return t('table.relative.minutes', { count: diffMins });
  if (diffHours < 24) return t('table.relative.hours', { count: diffHours });
  if (diffDays < 7) return t('table.relative.days', { count: diffDays });
  return date.toLocaleDateString();
};

const HistoryTable = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('history');
  const { logs, loading, error, total } = useSelector(
    (state: RootState) => state.audit,
  );

  const handleRowClick = (id: string | number) => {
    navigate(`/history/${id}`);
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
        <Table className='w-full'>
          <TableHeader>
            <TableRow className='hover:bg-transparent border-b bg-muted/50'>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12 pl-4'>
                {t('table.headers.user')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12 w-[120px]'>
                {t('table.headers.action')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.headers.target')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12 w-[160px] text-right pr-4'>
                {t('table.headers.when')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 w-12 bg-muted/50 backdrop-blur-sm border-b h-12 pr-4'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`} className='border-b'>
                  <TableCell className='py-4 pl-4'>
                    <div className='flex items-center gap-3'>
                      <Skeleton className='h-8 w-8 rounded-full shrink-0' />
                      <Skeleton className='h-4 w-40' />
                    </div>
                  </TableCell>
                  <TableCell className='py-4'>
                    <Skeleton className='h-6 w-[85px] rounded-full' />
                  </TableCell>
                  <TableCell className='py-4'>
                    <div className='flex items-center gap-2'>
                      <Skeleton className='h-6 w-6 rounded shrink-0' />
                      <Skeleton className='h-4 w-20' />
                      <Skeleton className='h-5 w-12 rounded' />
                    </div>
                  </TableCell>
                  <TableCell className='py-4 pr-4'>
                    <div className='flex flex-col items-end gap-1'>
                      <Skeleton className='h-4 w-14' />
                      <Skeleton className='h-3 w-20' />
                    </div>
                  </TableCell>
                  <TableCell className='py-4 pr-4'>
                    <Skeleton className='h-4 w-4 rounded' />
                  </TableCell>
                </TableRow>
              ))
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='h-40 text-center'>
                  <div className='flex flex-col items-center gap-3 text-muted-foreground'>
                    <div className='rounded-full bg-muted/50 p-4'>
                      <FileText className='h-8 w-8 opacity-50' />
                    </div>
                    <div>
                      <p className='font-medium'>{t('table.emptyTitle')}</p>
                      <p className='text-sm text-muted-foreground/70'>
                        {t('table.emptySubtitle')}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log: AuditLog, index) => {
                const actionConfig = getActionConfig(log.action, t);
                const ActionIcon = actionConfig.icon;
                const EntityIcon = getEntityIcon(log.entityName);

                return (
                  <TableRow
                    key={log.id || index}
                    className='hover:bg-muted/50 transition-colors border-b last:border-0 cursor-pointer group'
                    onClick={() => handleRowClick(log.id)}
                  >
                    {/* User Column */}
                    <TableCell className='py-4 pl-4'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-14 w-14 border-2 border-border shadow-sm shrink-0 group-hover:shadow-md group-hover:border-primary/50 transition-all'>
                          <AvatarImage
                            src={log.profileImageUrl}
                            alt={log.userEmail}
                          />
                          <AvatarFallback className='bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-sm font-semibold'>
                            {log.userEmail?.slice(0, 2).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className='text-lg font-semibold truncate group-hover:text-primary transition-colors'>
                          {log.userEmail || '-'}
                        </span>
                      </div>
                    </TableCell>

                    {/* Action Column */}
                    <TableCell className='py-4'>
                      <Badge
                        variant='outline'
                        className={`${actionConfig.color} gap-1.5 font-semibold text-base px-3 py-1`}
                      >
                        <ActionIcon className='h-4 w-4' />
                        {actionConfig.label}
                      </Badge>
                    </TableCell>

                    {/* Target Column - Entity + ID combined */}
                    <TableCell className='py-4'>
                      <div className='flex items-center gap-2.5'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0'>
                          <EntityIcon className='h-4.5 w-4.5' />
                        </div>
                        <span className='font-semibold text-lg'>
                          {log.entityName || '-'}
                        </span>
                        <code className='rounded bg-muted/50 px-2 py-1 text-base font-mono text-muted-foreground'>
                          #{log.entityId || '-'}
                        </code>
                      </div>
                    </TableCell>

                    {/* When Column */}
                    <TableCell className='py-4 text-right pr-4'>
                      <div className='flex flex-col items-end'>
                        <span className='text-lg font-medium flex items-center gap-1.5'>
                          <Clock className='h-4 w-4 text-muted-foreground' />
                          {log.timestamp
                            ? formatRelativeTime(log.timestamp, t)
                            : '-'}
                        </span>
                        <span className='text-base text-muted-foreground'>
                          {log.timestamp
                            ? new Date(log.timestamp).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>
                    </TableCell>

                    {/* Chevron */}
                    <TableCell className='py-4 pr-4'>
                      <ChevronRight className='h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity' />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className='p-4 border-t bg-muted/20 shrink-0'>
        <CustomTablePagination total={total} suggestions={[10, 20, 50, 100]} />
      </div>
    </div>
  );
};

export default HistoryTable;
