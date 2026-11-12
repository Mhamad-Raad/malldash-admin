import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Building2, Layers, Home, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import CustomTablePagination from '../CustomTablePagination';
import type { RootState } from '@/store/store';

const BuildingsTable = () => {
  const { buildings, total, loading, error } = useSelector(
    (state: RootState) => state.buildings
  );
  const navigate = useNavigate();
  const { t } = useTranslation('buildings');

  const handleRowClick = (buildingId: number) => {
    navigate(`/buildings/${buildingId}`);
  };

  if (error) {
    return (
      <div className='rounded-lg border bg-card shadow-sm p-8'>
        <div className='text-center text-destructive'>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className='rounded-xl border bg-card shadow-sm flex flex-col overflow-hidden'>
      {/* Scrollable card grid area */}
      <ScrollArea className='h-[calc(100vh-280px)] md:h-[calc(100vh-280px)]'>
        <div className='p-3 md:p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6'>
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <Card key={`skeleton-${index}`} className='border-2'>
                    <CardContent className='p-6'>
                      <div className='space-y-4'>
                        <div className='flex items-center gap-3'>
                          <Skeleton className='h-12 w-12 rounded-lg' />
                          <Skeleton className='h-6 w-32' />
                        </div>
                        <div className='space-y-3'>
                          <Skeleton className='h-4 w-full' />
                          <Skeleton className='h-4 w-full' />
                          <Skeleton className='h-4 w-3/4' />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              : buildings.map((building) => {
                  const occupancyRate = building.totalApartments > 0 
                    ? ((building.occupants / building.totalApartments) * 100).toFixed(0)
                    : '0';
                  
                  return (
                    <Card
                      key={building.id}
                      className='border-2 hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden'
                      onClick={() => handleRowClick(building.id)}
                    >
                      {/* Status bar */}
                      <div className='h-1.5 bg-gradient-to-r from-primary to-primary/70' />
                      
                      <CardContent className='p-4 md:p-6'>
                        <div className='space-y-3 md:space-y-4'>
                          {/* Header */}
                          <div className='flex items-start justify-between gap-2'>
                            <div className='flex items-start gap-2 md:gap-3 flex-1 min-w-0'>
                              <div className='p-2 md:p-3 rounded-lg md:rounded-xl bg-primary/10 border-2 border-primary/20 shadow-sm group-hover:shadow-md group-hover:border-primary/50 transition-all flex-shrink-0'>
                                <Building2 className='h-5 w-5 md:h-6 md:w-6 text-primary' />
                              </div>
                              <div className='min-w-0 flex-1 pt-0.5'>
                                <h3 className='font-bold text-base md:text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2 break-words'>
                                  {building.name}
                                </h3>
                              </div>
                            </div>
                            <ArrowRight className='h-4 w-4 md:h-5 md:w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5' />
                          </div>

                          {/* Stats Grid */}
                          <div className='grid grid-cols-2 gap-2 md:gap-3'>
                            {/* Floors */}
                            <div className='flex items-center gap-1.5 md:gap-2 p-2 md:p-3 rounded-lg bg-muted/50 group-hover:bg-primary/5 transition-colors'>
                              <div className='p-1 md:p-1.5 rounded-md bg-background flex-shrink-0'>
                                <Layers className='h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground' />
                              </div>
                              <div className='flex flex-col min-w-0'>
                                <span className='text-xs text-muted-foreground truncate'>
                                  {t('tableHeaders.totalFloors')}
                                </span>
                                <span className='text-base md:text-lg font-bold'>
                                  {building.numberOfFloors}
                                </span>
                              </div>
                            </div>

                            {/* Apartments */}
                            <div className='flex items-center gap-1.5 md:gap-2 p-2 md:p-3 rounded-lg bg-muted/50 group-hover:bg-primary/5 transition-colors'>
                              <div className='p-1 md:p-1.5 rounded-md bg-background flex-shrink-0'>
                                <Home className='h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground' />
                              </div>
                              <div className='flex flex-col min-w-0'>
                                <span className='text-xs text-muted-foreground truncate'>
                                  {t('tableHeaders.totalApartments')}
                                </span>
                                <span className='text-base md:text-lg font-bold'>
                                  {building.totalApartments}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Occupancy */}
                          <div className='p-2.5 md:p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20'>
                            <div className='flex items-center justify-between gap-2'>
                              <div className='flex items-center gap-1.5 md:gap-2 min-w-0'>
                                <Users className='h-3.5 w-3.5 md:h-4 md:w-4 text-primary flex-shrink-0' />
                                <span className='text-xs md:text-sm font-medium text-muted-foreground truncate'>
                                  {t('tableHeaders.occupancyRate')}
                                </span>
                              </div>
                              <div className='flex items-center gap-1.5 md:gap-2 flex-shrink-0'>
                                <span className='text-xl md:text-2xl font-bold text-primary'>
                                  {occupancyRate}%
                                </span>
                                <Badge variant='secondary' className='font-semibold text-xs'>
                                  {building.occupants}/{building.totalApartments}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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

export default BuildingsTable;
