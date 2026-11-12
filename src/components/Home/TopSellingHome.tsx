import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { formatCompact } from '@/lib/formatNumbers';

import type { TopSellingItemsHomeProps } from '@/interfaces/Home.interface';

const getTypeBadgeColor = (type: string) => {
  const typeLower = type.toLowerCase();
  if (typeLower === 'market') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  if (typeLower === 'restaurant') return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
  if (typeLower === 'bakery') return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
};

const TopSelling = ({ items }: TopSellingItemsHomeProps) => {
  // Sort items by sold count in descending order
  const sortedItems = [...items].sort((a, b) => b.sold - a.sold);

  return (
    <div className='w-full'>
      <div className='rounded-lg border bg-card relative'>
        {/* Scrollable Table Container with custom themed scrollbars */}
        <ScrollArea className='h-[300px] w-full'>
          <Table className='w-full'>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold'>
                  Vendor
                </TableHead>
                <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold'>
                  Type
                </TableHead>
                <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold'>
                  <div className='flex items-center justify-end whitespace-nowrap'>
                    Sold
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item) => (
                <TableRow key={item.id} className='hover:bg-muted/50'>
                  <TableCell className='font-medium text-sm'>
                    <div className='whitespace-nowrap min-w-[120px]'>{item.vendor}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='secondary' className={`${getTypeBadgeColor(item.type)} border-0 font-normal text-xs whitespace-nowrap`}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2 sm:gap-3 min-w-[100px]'>
                      <span className='font-semibold tabular-nums text-sm whitespace-nowrap'>
                        {formatCompact(item.sold)}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default TopSelling;
