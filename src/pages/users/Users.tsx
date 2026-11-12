import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import type { AppDispatch, RootState } from '@/store/store';

import UsersFilters from '@/components/Users/UsersFilters';
import UsersTable from '@/components/Users/UsersTable';
import EmptyState from '@/components/Users/EmptyState';

import { fetchUsers } from '@/store/slices/usersSlice';

const Users = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    users,
    lusers: loading,
    eusers: error,
  } = useSelector((state: RootState) => state.users);

  const limit = parseInt(searchParams.get('limit') || '40', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);

  const roleParam = searchParams.get('role');
  const role = roleParam !== null ? Number(roleParam) : null;
  const search = searchParams.get('search') || '';
  const buildingNameSearch = searchParams.get('buildingNameSearch') || '';

  useEffect(() => {
    const params: Record<string, any> = {
      limit,
      page,
      searchTerm: search,
      buildingNameSearch,
    };
    if (role !== -1) params.role = role;
    if (search) params.search = search;
    if (buildingNameSearch) params.buildingNameSearch = buildingNameSearch;
    if (limit && page) {
      dispatch(fetchUsers(params));
    }
  }, [dispatch, limit, page, role, search, buildingNameSearch]);

  const hasNoUsers = !loading && users.length === 0 && !error;
  return (
    <section className='w-full h-full flex flex-col gap-6 overflow-hidden'>
      {/* Filters Section */}
      <UsersFilters />

      {/* Users Table OR Empty State */}
      <div className='flex-1 min-h-0'>
        {hasNoUsers ? <EmptyState /> : <UsersTable />}
      </div>
    </section>
  );
};

export default Users;
