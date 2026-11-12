import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Plus,
  Users as UsersIcon,
  Building2,
  Shield,
  X,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

import AutoComplete from '@/components/AutoComplete';
import { fetchBuildingsByName } from '@/data/Buildings';

const roles = ['SuperAdmin', 'Admin', 'Vendor', 'Tenant'];

const UsersFilters = () => {
  const { t } = useTranslation('users');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Helper function to translate role names
  const translateRole = (roleName: string) => {
    switch (roleName) {
      case 'SuperAdmin':
        return t('roles.superAdmin');
      case 'Admin':
        return t('roles.admin');
      case 'Vendor':
        return t('roles.vendor');
      case 'Tenant':
        return t('roles.tenant');
      default:
        return roleName;
    }
  };

  // Use index, -1 means "All"
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  // typedSearch is what user is typing, search is debounced value synced to URL
  const [typedSearch, setTypedSearch] = useState(search);

  const [byBuildingName, setByBuildingName] = useState<string>('');
  const [buildingKey, setBuildingKey] = useState(0);

  const [role, setRole] = useState(() =>
    searchParams.get('role') !== null ? Number(searchParams.get('role')) : -1
  );

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
    if (byBuildingName) {
      params.set('buildingNameSearch', byBuildingName);
    } else {
      params.delete('buildingNameSearch');
    }
    if (role !== -1) {
      params.set('role', String(role));
    } else {
      params.delete('role');
    }
    params.set('page', '1');
    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
    // eslint-disable-next-line
  }, [search, byBuildingName, role]);

  // Sync state if URL changes externally (browser nav)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearch(urlSearch);
    setTypedSearch(urlSearch);
    setRole(
      searchParams.get('role') !== null ? Number(searchParams.get('role')) : -1
    );
    setByBuildingName(searchParams.get('buildingNameSearch') || '');
    // eslint-disable-next-line
  }, [searchParams]);

  const handleOnCreate = () => {
    navigate('/users/create');
  };

  // Async fetching function for AutoComplete
  const fetchBuildingNames = async (input: string) => {
    if (!input) return [];
    const res = await fetchBuildingsByName(input);
    return Array.isArray(res?.data) ? res.data.map((b: any) => b.name) : [];
  };

  const handleBuildingNameSelect = (value: string) => {
    setByBuildingName(value);
  };

  const clearSearch = () => {
    setTypedSearch('');
    setSearch('');
  };

  const clearAllFilters = () => {
    setTypedSearch('');
    setSearch('');
    setByBuildingName('');
    setRole(-1);
    setBuildingKey(prev => prev + 1); // Force remount of AutoComplete
  };

  const hasActiveFilters = search || byBuildingName || role !== -1;

  return (
    <div className='flex flex-col gap-5'>
      {/* Header Section */}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-2xl blur-lg opacity-40' />
            <div className='relative p-3.5 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg'>
              <UsersIcon className='size-7' />
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
          {t('addUser')}
        </Button>
      </div>

      {/* Filters Bar */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 relative z-30'>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <div className='p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors'>
            <SlidersHorizontal className='size-4 text-primary' />
          </div>
          <span className='text-sm font-medium'>{t('filterUsers')}</span>
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

          {/* Building Filter */}
          <div className='relative w-full sm:flex-1 transition-all duration-300'>
            <Building2 className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10 pointer-events-none' />
            <AutoComplete
              key={buildingKey}
              fetchOptions={fetchBuildingNames}
              onSelectOption={handleBuildingNameSelect}
              placeholder={t('buildingPlaceholder')}
              debounceMs={200}
              className='w-full [&_input]:pl-10 [&_input]:h-10 [&_input]:bg-background/80 [&_input]:border-border/50 [&_input]:rounded-xl [&_input]:transition-all'
            />
          </div>

          {/* Role Filter */}
          <div className='relative w-full sm:flex-1 transition-all duration-300'>
            <Shield className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10 pointer-events-none' />
            <Select value={String(role)} onValueChange={(val) => setRole(Number(val))}>
              <SelectTrigger className='w-full h-10 bg-background/80 border-border/50 rounded-xl pl-10 transition-all duration-200'>
                <SelectValue
                  placeholder={t('rolePlaceholder')}
                  children={
                    role === -1 ? t('allRoles') : (roles[role] ? translateRole(roles[role]) : 'Unknown')
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='-1'>{t('allRoles')}</SelectItem>
                {roles.map((roleName, idx) => (
                  <SelectItem key={roleName} value={String(idx)}>
                    {translateRole(roleName)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Badge & Clear Button */}
        <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${hasActiveFilters ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
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
};

export default UsersFilters;
