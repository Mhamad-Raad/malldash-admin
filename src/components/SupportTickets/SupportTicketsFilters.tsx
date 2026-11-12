import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  X,
  Sparkles,
  SlidersHorizontal,
  Ticket,
  CircleDot,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  TICKET_STATUS_OPTIONS,
  type TicketStatus,
} from '@/interfaces/SupportTicket.interface';

const SupportTicketsFilters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation('supportTickets');

  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [typedSearch, setTypedSearch] = useState(search);
  const [status, setStatus] = useState(
    () => searchParams.get('status') || 'all'
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getStatusLabel = (value: TicketStatus | 'all') => {
    if (value === 'all') return t('status.all');
    if (value === 0) return t('status.open');
    if (value === 1) return t('status.inProgress');
    if (value === 2) return t('status.resolved');
    if (value === 3) return t('status.closed');
    return t('status.unknown');
  };

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(typedSearch);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [typedSearch]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    if (status && status !== 'all') {
      params.set('status', status);
    } else {
      params.delete('status');
    }

    params.set('page', '1');
    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
    // eslint-disable-next-line
  }, [search, status]);

  // Sync state if URL changes externally
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearch(urlSearch);
    setTypedSearch(urlSearch);
    setStatus(searchParams.get('status') || 'all');
    // eslint-disable-next-line
  }, [searchParams]);

  const clearSearch = () => {
    setTypedSearch('');
    setSearch('');
  };

  const clearAllFilters = () => {
    setTypedSearch('');
    setSearch('');
    setStatus('all');
  };

  const hasActiveFilters = search || status !== 'all';

  return (
    <div className='flex flex-col gap-5'>
      {/* Header Section */}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-2xl blur-lg opacity-40' />
            <div className='relative p-3.5 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg'>
              <Ticket className='size-7' />
            </div>
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h1 className='text-3xl font-bold tracking-tight'>
                {t('page.title')}
              </h1>
              <Sparkles className='size-5 text-amber-500' />
            </div>
            <p className='text-muted-foreground mt-0.5'>
              {t('page.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 relative z-30'>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <div className='p-1.5 rounded-lg bg-primary/10 transition-colors'>
            <SlidersHorizontal className='size-4 text-primary' />
          </div>
          <span className='text-sm font-medium'>
            {t('filters.filterLabel')}
          </span>
        </div>

        <div className='flex flex-col sm:flex-row flex-1 items-start sm:items-center gap-3 w-full transition-all duration-300'>
          {/* Search Input */}
          <div className='relative flex-1 w-full group'>
            <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
            <Input
              type='text'
              placeholder={t('filters.searchPlaceholder')}
              className='pl-10 pr-10 h-10 bg-background/80 border-border/50 focus-visible:border-primary/50 focus-visible:ring-primary/20 focus-visible:shadow-sm transition-all rounded-xl'
              value={typedSearch}
              onChange={(e) => setTypedSearch(e.target.value)}
            />
            {typedSearch && (
              <button
                onClick={clearSearch}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded p-0.5 animate-in fade-in zoom-in duration-200'
              >
                <X className='size-4' />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className='relative w-full sm:flex-1 transition-all duration-300'>
            <CircleDot className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10 pointer-events-none' />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className='w-full h-10 bg-background/80 border-border/50 rounded-xl pl-10 transition-all duration-200'>
                <SelectValue placeholder={t('filters.statusPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {TICKET_STATUS_OPTIONS.map((option) => (
                  <SelectItem
                    key={String(option.value)}
                    value={String(option.value)}
                  >
                    {getStatusLabel(option.value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Badge & Clear Button */}
        <div
          className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${
            hasActiveFilters ? 'w-auto opacity-100' : 'w-0 opacity-0'
          }`}
        >
          {hasActiveFilters && (
            <>
              <Badge
                variant='secondary'
                className='gap-1.5 py-1.5 px-3 shadow-sm whitespace-nowrap'
              >
                <span className='size-1.5 rounded-full bg-primary animate-pulse' />
                <span className='font-medium'>Filtered</span>
              </Badge>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={clearAllFilters}
                className='h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-lg shrink-0'
              >
                <X className='size-4' />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTicketsFilters;
