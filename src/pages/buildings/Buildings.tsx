import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import type { AppDispatch, RootState } from '@/store/store';

import BuildingsFilters from '@/components/Buildings/BuildingsFilters';
import BuildingsTable from '@/components/Buildings/BuildingsTable';
import BuildingsEmptyState from '@/components/Buildings/BuildingsEmptyState';
import CreateBuildingModal from '@/components/Buildings/CreateBuildingModal';

import { fetchBuildings } from '@/store/slices/buildingsSlice';

const Buildings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Redux state
  const { buildings, loading, error } = useSelector(
    (state: RootState) => state.buildings
  );

  // Pagination and filters (extract from URL)
  const limit = parseInt(searchParams.get('limit') || '40', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';

  useEffect(() => {
    if (limit && page) {
      dispatch(fetchBuildings({ page, limit, searchName: search }));
    }
  }, [dispatch, limit, page, search]);

  const hasNoBuildings = !loading && buildings.length === 0 && !error;
  
  return (
    <section className='w-full h-full flex flex-col gap-6 overflow-hidden'>
      {/* Filters Section */}
      <BuildingsFilters onCreateClick={() => setIsCreateModalOpen(true)} />

      {/* Buildings Table OR Empty State */}
      <div className='flex-1 min-h-0'>
        {hasNoBuildings ? <BuildingsEmptyState /> : <BuildingsTable />}
      </div>

      <CreateBuildingModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </section>
  );
};

export default Buildings;
