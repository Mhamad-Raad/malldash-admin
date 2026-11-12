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
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';

import { ObjectAutoComplete } from '@/components/ObjectAutoComplete';
import { fetchVendors, fetchVendorById } from '@/data/Vendor';
import { fetchCategories, fetchCategoryById } from '@/data/Categories';

// We need simple interfaces for the autocomplete options if the full types are complex
interface VendorOption {
  id: number;
  name: string;
}

interface CategoryOption {
  id: number;
  name: string;
}

const ProductsFilters = () => {
  const { t } = useTranslation('products');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Search state
  const [search, setSearch] = useState(
    () => searchParams.get('searchName') || ''
  );
  const [typedSearch, setTypedSearch] = useState(search);

  // Filters state
  const [inStock, setInStock] = useState<string>(() => {
    const param = searchParams.get('inStock');
    return param === null ? 'all' : param;
  });

  const [selectedVendor, setSelectedVendor] = useState<VendorOption | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);

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

  // Initial load from URL
  useEffect(() => {
    const initFilters = async () => {
      const vId = searchParams.get('vendorId');
      const cId = searchParams.get('categoryId');

      if (vId) {
        const vendor = await fetchVendorById(vId);
        if (vendor && !vendor.error) {
          setSelectedVendor({ id: vendor.id, name: vendor.name });
        }
      }

      if (cId) {
        const category = await fetchCategoryById(parseInt(cId));
        if (category && !category.error) {
          setSelectedCategory({ id: category.id, name: category.name });
        }
      }

      setIsInitialized(true);
    };

    initFilters();
  }, []);

  // Sync state with URL
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams(searchParams);

    // Search
    if (search) {
      params.set('searchName', search);
    } else {
      params.delete('searchName');
    }

    // In Stock
    if (inStock !== 'all') {
      params.set('inStock', inStock);
    } else {
      params.delete('inStock');
    }

    // Vendor
    if (selectedVendor) {
      params.set('vendorId', selectedVendor.id.toString());
    } else {
      params.delete('vendorId');
    }

    // Category
    if (selectedCategory) {
      params.set('categoryId', selectedCategory.id.toString());
    } else {
      params.delete('categoryId');
    }

    // Reset page on filter change (only if params changed)
    // Note: This logic might reset page even if we are just syncing initial state?
    // No, isInitialized protects us.
    // But if we navigate to page 2, this effect runs?
    // Dependency array: [search, inStock, selectedVendor, selectedCategory, isInitialized]
    // If we navigate to page 2, none of these change. So effect doesn't run.

    // Check if params actually changed before navigating to avoid loop or unnecessary replacement
    // But since we use navigate with replace, it's fine.
    // However, we want to ensure we don't reset page if only page changed (handled by dependency array).

    params.set('page', '1');

    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
  }, [search, inStock, selectedVendor, selectedCategory, isInitialized]);

  const handleOnCreate = () => {
    navigate('/products/create');
  };

  const clearSearch = () => {
    setTypedSearch('');
    setSearch('');
  };

  const clearAllFilters = () => {
    setTypedSearch('');
    setSearch('');
    setInStock('all');
    setSelectedVendor(null);
    setSelectedCategory(null);
  };

  const hasActiveFilters =
    search || inStock !== 'all' || selectedVendor || selectedCategory;

  // Wrapper for fetching vendors
  const loadVendors = async (query: string) => {
    const res = await fetchVendors({ searchName: query, limit: 10 });
    // Handle both array response and { data: [] } response
    const data = Array.isArray(res) ? res : res?.data;
    if (Array.isArray(data)) {
      return data.map((v: any) => ({ id: v.id, name: v.name }));
    }
    return [];
  };

  // Wrapper for fetching categories
  const loadCategories = async (query: string) => {
    const res = await fetchCategories({ searchName: query, limit: 10 });
    // Handle both array response and { data: [] } response
    const data = Array.isArray(res) ? res : res?.data;
    if (Array.isArray(data)) {
      return data.map((c: any) => ({ id: c.id, name: c.name }));
    }
    return [];
  };

  return (
    <div className='flex flex-col gap-5'>
      {/* Header */}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-2xl blur-lg opacity-40' />
            <div className='relative p-3.5 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg'>
              <ShoppingBag className='size-7' />
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

        <Button onClick={handleOnCreate} className='gap-2'>
          <Plus className='size-4' />
          {t('actions.create')}
        </Button>
      </div>

      {/* Filters */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 relative z-30'>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <div className='p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors'>
            <SlidersHorizontal className='size-4 text-primary' />
          </div>
          <span className='text-sm font-medium'>{t('filters.title')}</span>
        </div>

        <div className='flex flex-col sm:flex-row flex-1 items-start sm:items-center gap-3 w-full transition-all duration-300'>
          {/* Search */}
          <div className='relative flex-1 min-w-0 w-full group'>
            <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
            <Input
              placeholder={t('filters.search')}
              value={typedSearch}
              onChange={(e) => setTypedSearch(e.target.value)}
              className='pl-10 pr-10 h-10 bg-background/80 border-border/50 focus-visible:border-primary/50 focus-visible:ring-primary/20 focus-visible:shadow-sm transition-all rounded-xl'
            />
            {typedSearch && (
              <button
                onClick={clearSearch}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded p-0.5 animate-in fade-in zoom-in duration-200'
                title={t('filters.clearSearch')}
              >
                <X className='size-4' />
              </button>
            )}
          </div>

          {/* Vendor Filter */}
          <div className='w-full sm:w-auto sm:min-w-[160px]'>
            <ObjectAutoComplete
              fetchOptions={loadVendors}
              onSelectOption={setSelectedVendor}
              getOptionLabel={(v) => v.name}
              placeholder={t('filters.vendor')}
              initialValue={selectedVendor?.name}
            />
          </div>

          {/* Category Filter */}
          <div className='w-full sm:w-auto sm:min-w-[160px]'>
            <ObjectAutoComplete
              fetchOptions={loadCategories}
              onSelectOption={setSelectedCategory}
              getOptionLabel={(c) => c.name}
              placeholder={t('filters.category')}
              initialValue={selectedCategory?.name}
            />
          </div>

          {/* Stock Filter */}
          <div className='w-full sm:w-auto sm:min-w-[130px]'>
            <Select value={inStock} onValueChange={setInStock}>
              <SelectTrigger className='h-10 bg-background/80 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl'>
                <SelectValue placeholder={t('filters.stockStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t('filters.allStatus')}</SelectItem>
                <SelectItem value='true'>{t('filters.inStock')}</SelectItem>
                <SelectItem value='false'>{t('filters.outOfStock')}</SelectItem>
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
                <span className='font-medium'>{t('filters.filtered')}</span>
              </Badge>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={clearAllFilters}
                className='h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-lg shrink-0'
                title={t('filters.clearAll')}
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

export default ProductsFilters;
