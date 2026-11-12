import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Store, Tags, X, Sparkles, SlidersHorizontal } from 'lucide-react';
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
import { vendorTypes } from '@/constants/vendorTypes';

const vendorTypesWithAll = [
  { label: 'allTypes', value: -1 },
  ...vendorTypes.map(vt => ({ ...vt, label: vt.label.toLowerCase() })),
];

export default function VendorsFilters() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation('vendors');

  const [typedSearch, setTypedSearch] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('-1');

  // Debounce for search input
  const debounceRef = useRef<any>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(typedSearch);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [typedSearch]);

  // Update search params in URL whenever any filter changes (debounced search)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    if (type !== '-1') {
      params.set('type', type);
    } else {
      params.delete('type');
    }
    params.set('page', '1');
    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
    // eslint-disable-next-line
  }, [search, type]);

  // Sync state if URL changes externally (browser nav)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearch(urlSearch);
    setTypedSearch(urlSearch);
    setType(searchParams.get('type') || '-1');
    // eslint-disable-next-line
  }, [searchParams]);

  const handleOnCreate = () => {
    navigate('/vendors/create');
  };

  const clearSearch = () => {
    setTypedSearch('');
    setSearch('');
  };

  const clearAllFilters = () => {
    setTypedSearch('');
    setSearch('');
    setType('-1');
  };

  const hasActiveFilters = search || type !== '-1';

  return (
    <div className='flex flex-col gap-5'>
      {/* Header Section */}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-2xl blur-lg opacity-40' />
            <div className='relative p-3.5 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg'>
              <Store className='size-7' />
            </div>
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h1 className='text-3xl font-bold tracking-tight'>{t('title')}</h1>
              <Sparkles className='size-5 text-amber-500' />
            </div>
            <p className='text-muted-foreground mt-0.5'>
              {t('subtitle')}
            </p>
          </div>
        </div>

        <Button
          type='button'
          onClick={handleOnCreate}
          className='gap-2'
          size='default'
        >
          <Plus className='size-4' />
          {t('addVendor')}
        </Button>
      </div>

      {/* Filters Bar */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 relative z-30'>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <div className='p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors'>
            <SlidersHorizontal className='size-4 text-primary' />
          </div>
          <span className='text-sm font-medium'>{t('filterVendors')}</span>
        </div>

        <div className='flex flex-col sm:flex-row flex-1 items-start sm:items-center gap-3 w-full transition-all duration-300'>
          {/* Search Input */}
          <div className='relative flex-1 w-full group'>
            <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
            <Input
              type='text'
              placeholder={t('searchPlaceholder')}
              className='pl-10 pr-10 h-10 bg-background/80 border-border/50 focus-visible:border-primary/50 focus-visible:ring-primary/20 focus-visible:shadow-sm transition-all rounded-xl'
              value={typedSearch}
              onChange={(e) => setTypedSearch(e.target.value)}
            />
            {typedSearch && (
              <button
                onClick={clearSearch}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded p-0.5 animate-in fade-in zoom-in duration-200'
                title='Clear search'
              >
                <X className='size-4' />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className='relative w-full sm:flex-1'>
            <Tags className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10 pointer-events-none' />
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className='w-full h-10 bg-background/80 border-border/50 rounded-xl pl-10 transition-all duration-200'>
                <SelectValue placeholder={t('filterByType')} />
              </SelectTrigger>
              <SelectContent>
                {vendorTypesWithAll.map((vendorType) => (
                  <SelectItem key={vendorType.value} value={String(vendorType.value)}>
                    {t(`types.${vendorType.label}`)}
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
              <Badge variant='secondary' className='gap-1.5 py-1.5 px-3 shadow-sm whitespace-nowrap'>
                <span className='size-1.5 rounded-full bg-primary animate-pulse' />
                <span className='font-medium'>Filtered</span>
              </Badge>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={clearAllFilters}
                className='h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-lg shrink-0'
                title='Clear all filters'
              >
                <X className='size-4' />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
