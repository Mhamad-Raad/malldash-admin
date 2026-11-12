import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import type { AppDispatch, RootState } from '@/store/store';

import VendorsFilters from '@/components/Vendors/VendorsFilters';
import VendorsTable from '@/components/Vendors/VendorsTable';
import EmptyState from '@/components/Vendors/EmptyState';

import { fetchVendors } from '@/store/slices/vendorsSlice';

const Vendors = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    vendors,
    lvendors: loading,
    evendors: error,
    total,
  } = useSelector((state: RootState) => state.vendors);

  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';
  const typeParam = searchParams.get('type');
  const type = typeParam !== null ? Number(typeParam) : null;

  useEffect(() => {
    const params: Record<string, any> = {
      limit,
      page,
    };

    if (search) {
      params.searchName = search;
    }

    if (type !== null && type !== -1) {
      params.type = type;
    }

    dispatch(fetchVendors(params));
  }, [dispatch, limit, page, search, type]);

  const hasNoVendors = !loading && vendors.length === 0 && !error;

  return (
    <section className='w-full h-full flex flex-col gap-6 overflow-hidden'>
      {/* Filters Section */}
      <VendorsFilters />

      {/* Vendors Table or Empty State */}
      <div className='flex-1 min-h-0'>
        {hasNoVendors ? <EmptyState /> : <VendorsTable vendors={vendors} total={total} loading={loading} />}
      </div>
    </section>
  );
};

export default Vendors;
