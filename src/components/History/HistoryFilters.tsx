import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, History, SlidersHorizontal, Sparkles } from 'lucide-react';

const HistoryFilters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation('history');

  // State
  const [entityName, setEntityName] = useState(
    () => searchParams.get('entityName') || ''
  );
  const [typedEntityName, setTypedEntityName] = useState(entityName);

  const [fromDate, setFromDate] = useState(
    () => searchParams.get('fromDate') || ''
  );
  const [toDate, setToDate] = useState(() => searchParams.get('toDate') || '');

  // Debounce for entity name search
  const debounceRef = useRef<any>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setEntityName(typedEntityName);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [typedEntityName]);

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (entityName) {
      params.set('entityName', entityName);
    } else {
      params.delete('entityName');
    }

    if (fromDate) {
      params.set('fromDate', fromDate);
    } else {
      params.delete('fromDate');
    }

    if (toDate) {
      params.set('toDate', toDate);
    } else {
      params.delete('toDate');
    }

    // Reset page to 1 when filters change
    params.set('page', '1');

    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
  }, [entityName, fromDate, toDate, navigate]); // Removed searchParams to avoid infinite loop

  const clearFilters = () => {
    setTypedEntityName('');
    setEntityName('');
    setFromDate('');
    setToDate('');
  };

  const clearSearch = () => {
    setTypedEntityName('');
    setEntityName('');
  };

  const hasActiveFilters = entityName || fromDate || toDate;

  return (
    <div className='flex flex-col gap-5'>
      {/* Header */}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-2xl blur-lg opacity-40' />
            <div className='relative p-3.5 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg'>
              <History className='size-7' />
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
          <div className='p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors'>
            <SlidersHorizontal className='size-4 text-primary' />
          </div>
          <span className='text-sm font-medium'>{t('filters.title')}</span>
        </div>

        <div className='flex flex-col sm:flex-row flex-1 items-start sm:items-center gap-3 w-full transition-all duration-300'>
          {/* Search Input */}
          <div className='relative flex-1 min-w-0 w-full group'>
            <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
            <Input
              placeholder={t('filters.searchPlaceholder')}
              value={typedEntityName}
              onChange={(e) => setTypedEntityName(e.target.value)}
              className='pl-10 pr-10 h-10 bg-background/80 border-border/50 focus-visible:border-primary/50 focus-visible:ring-primary/20 focus-visible:shadow-sm transition-all rounded-xl'
            />
            {typedEntityName && (
              <button
                onClick={clearSearch}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded p-0.5 animate-in fade-in zoom-in duration-200'
                title={t('filters.clearSearch')}
              >
                <X className='size-4' />
              </button>
            )}
          </div>

          {/* Date Range Filters */}
          <div className='flex items-center gap-2 w-full sm:w-auto sm:min-w-[200px]'>
            <span className='text-sm text-muted-foreground whitespace-nowrap'>
              {t('filters.from')}
            </span>
            <Input
              type='datetime-local'
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className='h-10 bg-background/80 border-border/50 focus-visible:border-primary/50 focus-visible:ring-primary/20 transition-all rounded-xl'
            />
          </div>

          <div className='flex items-center gap-2 w-full sm:w-auto sm:min-w-[200px]'>
            <span className='text-sm text-muted-foreground whitespace-nowrap'>
              {t('filters.to')}
            </span>
            <Input
              type='datetime-local'
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className='h-10 bg-background/80 border-border/50 focus-visible:border-primary/50 focus-visible:ring-primary/20 transition-all rounded-xl'
            />
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
              <Badge variant='secondary' className='gap-1.5 py-1.5 px-3 shadow-sm whitespace-nowrap'>
                <span className='size-1.5 rounded-full bg-primary animate-pulse' />
                <span className='font-medium'>{t('filters.activeBadge')}</span>
              </Badge>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={clearFilters}
                className='h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-lg shrink-0'
                title={t('filters.clearFilters')}
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

export default HistoryFilters;

