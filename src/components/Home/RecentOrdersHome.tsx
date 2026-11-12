import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

import type { RecentOrdersHomeProps } from '@/interfaces/Home.interface';

const getStatusVariant = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('delivered')) return 'default';
  if (statusLower.includes('cancel')) return 'destructive';
  if (statusLower.includes('way')) return 'secondary';
  return 'outline';
};

const RecentOrdersHome = ({ items }: RecentOrdersHomeProps) => {
  return (
    <div className='w-full'>
      <div className='rounded-lg border bg-card relative'>
        {/* Scrollable Table Container with custom themed scrollbars */}
        <ScrollArea className='h-[300px] w-full'>
          <Table className='w-full'>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold'>
                  User
                </TableHead>
                <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold'>
                  Vendor
                </TableHead>
                <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold whitespace-nowrap'>
                  Location
                </TableHead>
                <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold'>
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={`${item.id}-${item.vendor}-${index}`} className='hover:bg-muted/50'>
                  <TableCell>
                    <div className='flex items-center gap-2 sm:gap-3 min-w-[150px]'>
                      <Avatar className='h-8 w-8 flex-shrink-0'>
                        <AvatarImage src={item.src} alt={item.name} />
                        <AvatarFallback className='text-xs font-medium'>
                          {item.fallback}
                        </AvatarFallback>
                      </Avatar>
                      <div className='font-medium text-sm whitespace-nowrap'>{item.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className='font-medium text-sm'>
                    <div className='whitespace-nowrap min-w-[140px]'>{item.vendor}</div>
                  </TableCell>
                  <TableCell className='text-sm text-muted-foreground'>
                    <div className='whitespace-nowrap min-w-[120px]'>{item.location}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(item.status)} className='font-normal text-xs whitespace-nowrap'>
                      {item.status}
                    </Badge>
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

export default RecentOrdersHome;
