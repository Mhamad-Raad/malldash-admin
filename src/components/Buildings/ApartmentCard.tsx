import { Home, User, Edit3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Apartment } from '@/interfaces/Building.interface';
import { useTranslation } from 'react-i18next';

interface ApartmentCardProps {
  apartment?: Apartment | null;
  onEdit: (apartment: Apartment) => void;
}

const ApartmentCard = ({ apartment, onEdit }: ApartmentCardProps) => {
  const { t } = useTranslation('buildings');
  
  if (!apartment) {
    return null;
  }

  const hasOccupant = !!apartment?.occupant;

  return (
    <Card
      className={`relative border-2 transition-all duration-300 cursor-pointer group overflow-hidden ${
        hasOccupant ? 'hover:border-primary hover:shadow-primary/20' : 'hover:border-primary/60'
      } hover:shadow-xl hover:-translate-y-1`}
      onClick={() => onEdit(apartment)}
    >
      {/* Status indicator bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${hasOccupant ? 'bg-gradient-to-r from-primary to-primary/70' : 'bg-gradient-to-r from-muted to-muted-foreground/20'}`} />
      
      <CardContent className='p-4'>
        <div className='flex flex-col gap-3'>
          {/* Header */}
          <div className='flex items-start justify-between gap-2'>
            <div className='flex items-center gap-2.5 flex-1 min-w-0'>
              <div className={`p-2 rounded-lg border-2 shadow-sm ${hasOccupant ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 dark:from-primary/20 dark:to-primary/10 dark:border-primary/40' : 'bg-gradient-to-br from-muted to-muted/50 border-muted-foreground/20'} transition-all duration-300 group-hover:scale-110`}>
                <Home className={`h-4 w-4 ${hasOccupant ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='font-bold text-base truncate group-hover:text-primary transition-colors'>{apartment.apartmentName}</p>
                <div className='flex items-center gap-1.5 mt-0.5'>
                  <div className={`w-1.5 h-1.5 rounded-full ${hasOccupant ? 'bg-primary animate-pulse' : 'bg-muted-foreground/40'}`} />
                  <p className='text-xs font-medium text-muted-foreground'>
                    {hasOccupant ? t('detail.apartment.occupied') : t('detail.apartment.vacant')}
                  </p>
                </div>
              </div>
            </div>
            <div className='p-1.5 rounded-lg bg-muted/0 group-hover:bg-primary/10 transition-all duration-300'>
              <Edit3 className='h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all' />
            </div>
          </div>

          {/* Occupant Info */}
          {hasOccupant ? (
            <div className='rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/30 dark:border-primary/40 p-3 shadow-sm'>
              <div className='flex items-center gap-2'>
                <div className='p-1.5 rounded-full bg-primary/10 border border-primary/20'>
                  <User className='h-3.5 w-3.5 text-primary' />
                </div>
                <span className='text-sm font-bold text-foreground truncate'>
                  {apartment?.occupant?.name ?? 'Unknown'}
                </span>
              </div>
            </div>
          ) : (
            <div className='rounded-lg bg-muted/40 border-2 border-dashed border-muted-foreground/30 p-2.5 text-center group-hover:border-primary/40 transition-colors'>
              <p className='text-xs text-muted-foreground font-medium'>
                {t('detail.apartment.noResidentAssigned')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApartmentCard;
