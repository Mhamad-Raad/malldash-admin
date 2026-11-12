import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShoppingBag,
  Tag,
  Store,
  ChevronRight,
  DollarSign,
  Package,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import ProductsTableSkeleton from './ProductsTableSkeleton';
import CustomTablePagination from '../CustomTablePagination';

import type { RootState } from '@/store/store';

const ProductsTable = () => {
  const { t } = useTranslation('products');
  const navigate = useNavigate();

  const { products, loading, error, total } = useSelector(
    (state: RootState) => state.products
  );

  const handleRowClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  if (error) {
    return (
      <div className='rounded-lg border bg-card shadow-sm p-8'>
        <div className='text-center text-destructive'>
          {t('error')}: {error}
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-xl border bg-card shadow-sm flex flex-col overflow-hidden'>
      {/* Scrollable table area - responsive height based on viewport */}
      <ScrollArea className='h-[calc(100vh-280px)] md:h-[calc(100vh-280px)]'>
        <Table className='w-full min-w-[700px]'>
          <TableHeader>
            <TableRow className='hover:bg-transparent border-b bg-muted/50'>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.product')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.price')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.category')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.vendor')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.stock')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 w-12 bg-muted/50 backdrop-blur-sm border-b h-12'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <ProductsTableSkeleton key={`skeleton-${index}`} />
                ))
              : products.map((product) => (
                  <TableRow
                    key={product.id}
                    className='group hover:bg-muted/50 transition-all cursor-pointer border-b last:border-0'
                    onClick={() => handleRowClick(product.id)}
                  >
                    {/* Product Info */}
                    <TableCell className='font-medium py-4'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-14 w-14 rounded-lg border-2 border-border shadow-sm group-hover:shadow-md group-hover:border-primary/50 transition-all'>
                          <AvatarImage
                            src={product.productImageUrl}
                            alt={product.name}
                          />
                          <AvatarFallback className='rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary'>
                            <ShoppingBag className='h-5 w-5' />
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col gap-0.5'>
                          <span className='font-semibold text-lg leading-tight group-hover:text-primary transition-colors'>
                            {product.name}
                          </span>
                          <span className='text-sm text-muted-foreground font-mono leading-tight'>
                            {t('table.id')}: {product.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Price */}
                    <TableCell className='py-4'>
                      <div className='flex items-center gap-2.5'>
                        <div className='flex items-center justify-center w-7 h-7 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors'>
                          <DollarSign className='h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors' />
                        </div>
                        <div className='flex flex-col'>
                          {product.discountPrice ? (
                            <>
                              <span className='font-semibold text-base text-foreground/90'>
                                ${product.discountPrice.toFixed(2)}
                              </span>
                              <span className='text-sm text-muted-foreground line-through'>
                                ${product.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className='font-medium text-base text-foreground/90'>
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell className='py-4'>
                      <div className='flex items-center gap-2.5'>
                        <div className='flex items-center justify-center w-7 h-7 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors'>
                          <Tag className='h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors' />
                        </div>
                        <span className='text-base font-medium text-foreground/90'>
                          {product.categoryName}
                        </span>
                      </div>
                    </TableCell>

                    {/* Vendor */}
                    <TableCell className='py-4'>
                      <div className='flex items-center gap-2.5'>
                        <div className='flex items-center justify-center w-7 h-7 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors'>
                          <Store className='h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors' />
                        </div>
                        <span className='text-base font-medium text-foreground/90'>
                          {product.vendorName}
                        </span>
                      </div>
                    </TableCell>

                    {/* Stock */}
                    <TableCell className='py-4'>
                      <Badge
                        variant='outline'
                        className={`font-semibold text-base px-3 py-1 ${
                          product.inStock
                            ? 'bg-primary/10 text-primary border-primary/30'
                            : 'bg-destructive/10 text-destructive border-destructive/30'
                        }`}
                      >
                        <Package className='h-3.5 w-3.5 mr-1.5' />
                        {product.inStock ? t('table.inStock') : t('table.outOfStock')}
                      </Badge>
                    </TableCell>

                    {/* Chevron */}
                    <TableCell className='py-4 w-12'>
                      <ChevronRight className='h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all' />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      {/* Pagination */}
      <div className='border-t px-4 py-3 bg-muted/20'>
        <CustomTablePagination
          total={total}
          suggestions={[10, 20, 40, 50, 100]}
        />
      </div>
    </div>
  );
};

export default ProductsTable;
