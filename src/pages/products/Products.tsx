import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import type { AppDispatch, RootState } from '@/store/store';

import ProductsFilters from '@/components/Products/ProductsFilters';
import ProductsTable from '@/components/Products/ProductsTable';
import EmptyState from '@/components/Products/EmptyState';

import { fetchProducts } from '@/store/slices/productsSlice';

const Products = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    products,
    loading,
    error,
  } = useSelector((state: RootState) => state.products);

  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const searchName = searchParams.get('searchName') || undefined;
  const vendorIdParam = searchParams.get('vendorId');
  const vendorId = vendorIdParam ? parseInt(vendorIdParam) : undefined;
  const categoryIdParam = searchParams.get('categoryId');
  const categoryId = categoryIdParam ? parseInt(categoryIdParam) : undefined;
  const inStockParam = searchParams.get('inStock');
  const inStock = inStockParam === 'true' ? true : inStockParam === 'false' ? false : undefined;

  useEffect(() => {
    dispatch(fetchProducts({
      page,
      limit,
      searchName,
      vendorId,
      categoryId,
      inStock,
    }));
  }, [dispatch, page, limit, searchName, vendorId, categoryId, inStock]);

  const hasNoProducts = !loading && products.length === 0 && !error;

  return (
    <section className='w-full h-full flex flex-col gap-6 overflow-hidden'>
      {/* Filters Section */}
      <ProductsFilters />

      {/* Products Table OR Empty State */}
      <div className='flex-1 min-h-0'>
        {hasNoProducts ? <EmptyState /> : <ProductsTable />}
      </div>
    </section>
  );
};

export default Products;
