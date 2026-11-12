import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  Phone,
  Clock,
  User,
  ArrowUpRight,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import CustomTablePagination from '../CustomTablePagination';
import type { VendorType } from '@/interfaces/Vendor.interface';

const getVendorTypeColor = (type: string) => {
  const typeLower = type.toLowerCase();
  if (typeLower === 'restaurant')
    return 'bg-red-500/15 text-red-700 dark:bg-red-500/25 dark:text-red-300 border-red-500/30 dark:border-red-500/40';
  if (typeLower === 'market')
    return 'bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-300 border-indigo-500/30 dark:border-indigo-500/40';
  if (typeLower === 'bakery')
    return 'bg-orange-500/15 text-orange-700 dark:bg-orange-500/25 dark:text-orange-300 border-orange-500/30 dark:border-orange-500/40';
  if (typeLower === 'cafe')
    return 'bg-teal-500/15 text-teal-700 dark:bg-teal-500/25 dark:text-teal-300 border-teal-500/30 dark:border-teal-500/40';
  return 'bg-slate-500/15 text-slate-700 dark:bg-slate-500/25 dark:text-slate-300 border-slate-500/30 dark:border-slate-500/40';
};

interface VendorsTableProps {
  vendors: VendorType[];
  total: number;
  loading: boolean;
}

const VendorsTable = ({ vendors, total, loading }: VendorsTableProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('vendors');

  const handleRowClick = (vendorId: string) => {
    navigate(`/vendors/${vendorId}`);
  };

  return (
    <div className='rounded-xl border bg-card shadow-sm flex flex-col overflow-hidden'>
      {/* Scrollable card list area */}
      <ScrollArea className='h-[calc(100vh-280px)] md:h-[calc(100vh-280px)]'>
        <div className='p-3 md:p-6'>
          <div className='space-y-3 md:space-y-4'>
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Card key={`skeleton-${index}`} className='border'>
                    <CardContent className='p-4 md:p-6'>
                      <div className='flex items-start gap-4'>
                        <Skeleton className='h-16 w-16 md:h-20 md:w-20 rounded-xl flex-shrink-0' />
                        <div className='flex-1 space-y-3'>
                          <div className='space-y-2'>
                            <Skeleton className='h-6 w-48' />
                            <Skeleton className='h-4 w-64' />
                          </div>
                          <div className='flex gap-4'>
                            <Skeleton className='h-4 w-32' />
                            <Skeleton className='h-4 w-32' />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              : vendors.map((vendor) => (
                  <Card
                    key={vendor._id}
                    className='border-2 hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden bg-card/50 backdrop-blur-sm hover:bg-card'
                    onClick={() => handleRowClick(vendor._id)}
                  >
                    {/* Colored top border based on vendor type */}
                    <div className={`h-1.5 ${
                      vendor.type.toLowerCase() === 'restaurant' ? 'bg-gradient-to-r from-red-500 via-red-400 to-red-500' :
                      vendor.type.toLowerCase() === 'market' ? 'bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-500' :
                      vendor.type.toLowerCase() === 'bakery' ? 'bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500' :
                      vendor.type.toLowerCase() === 'cafe' ? 'bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500' :
                      'bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500'
                    }`} />

                    <CardContent className='p-4 md:p-5'>
                      <div className='flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6'>
                        {/* Left: Avatar and Business Info */}
                        <div className='flex items-start gap-3 lg:flex-1'>
                          <Avatar className='h-16 w-16 md:h-20 md:w-20 border-2 border-border shadow-md transition-all group-hover:shadow-lg group-hover:border-primary group-hover:scale-105 flex-shrink-0'>
                            <AvatarImage
                              src={vendor.logo}
                              alt={vendor.businessName}
                            />
                            <AvatarFallback className='bg-primary/10 text-primary text-base md:text-lg font-bold'>
                              {vendor.businessName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className='min-w-0 space-y-2'>
                            {/* Type Badge - Above Name */}
                            <Badge
                              variant='outline'
                              className={`${getVendorTypeColor(
                                vendor.type
                              )} font-bold text-xs px-2.5 py-1 w-fit shadow-sm`}
                            >
                              {t(`types.${vendor.type.toLowerCase()}`)}
                            </Badge>

                            {/* Business Name */}
                            <div>
                              <h3 className='font-bold text-lg md:text-xl leading-tight group-hover:text-primary transition-colors line-clamp-1 break-words'>
                                {vendor.businessName}
                              </h3>
                              {vendor.description && (
                                <p className='text-xs md:text-sm text-muted-foreground mt-1 line-clamp-1 leading-tight'>
                                  {vendor.description}
                                </p>
                              )}
                            </div>

                            {/* Owner */}
                            <div className='flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-muted w-fit'>
                              <div className='p-1 rounded-md bg-background'>
                                <User className='h-3.5 w-3.5 text-muted-foreground flex-shrink-0' />
                              </div>
                              <span className='text-xs md:text-sm font-medium'>{vendor.ownerName}</span>
                            </div>
                          </div>
                        </div>

                        <Separator className='lg:hidden' orientation='horizontal' />

                        {/* Right: Contact Info & Hours - Better Organized */}
                        <div className='flex flex-col gap-2.5 lg:flex-shrink-0'>
                          {/* Contact Cards in Grid */}
                          <div className='flex gap-2'>
                            {/* Email */}
                            <div className='flex items-center gap-2 p-2.5 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all group/item'>
                              <div className='p-1.5 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0'>
                                <Mail className='h-3.5 w-3.5 text-primary' />
                              </div>
                              <div className='min-w-0 flex-1'>
                                <p className='text-[10px] text-muted-foreground font-medium mb-0.5'>Email</p>
                                <p className='text-xs font-medium truncate group-hover/item:text-primary transition-colors'>{vendor.email}</p>
                              </div>
                            </div>

                            {/* Phone */}
                            <div className='flex items-center gap-2 p-2.5 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all group/item'>
                              <div className='p-1.5 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0'>
                                <Phone className='h-3.5 w-3.5 text-primary' />
                              </div>
                              <div className='min-w-0 flex-1'>
                                <p className='text-[10px] text-muted-foreground font-medium mb-0.5'>Phone</p>
                                <p className='text-xs font-bold truncate group-hover/item:text-primary transition-colors'>{vendor.phoneNumber}</p>
                              </div>
                            </div>
                          </div>

                          {/* Working Hours - Prominent */}
                          <div className='p-3 rounded-lg bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border-2 border-primary/30 shadow-sm'>
                            <div className='flex items-center justify-between gap-2'>
                              <div className='flex items-center gap-2'>
                                <div className='p-1.5 rounded-lg bg-primary/20 border border-primary/30'>
                                  <Clock className='h-4 w-4 text-primary flex-shrink-0' />
                                </div>
                                <span className='text-xs text-foreground/70 font-semibold'>
                                  {t('tableHeaders.workingHours')}
                                </span>
                              </div>
                              <span className='text-base md:text-lg font-bold text-primary whitespace-nowrap'>
                                {vendor.workingHours.open} - {vendor.workingHours.close}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Arrow Icon */}
                        <div className='hidden lg:flex items-center justify-center'>
                          <div className='p-2 rounded-lg bg-muted/30 group-hover:bg-primary/10 transition-all'>
                            <ArrowUpRight className='h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0' />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </ScrollArea>

      {/* Pagination footer */}
      <div className='border-t bg-muted/30 px-4 py-3 mt-auto'>
        <CustomTablePagination
          total={total}
          suggestions={[10, 20, 40, 50, 100]}
        />
      </div>
    </div>
  );
};

export default VendorsTable;
