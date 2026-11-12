import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, GripVertical } from 'lucide-react';

interface Floor {
  id: string;
  floorNumber: number | '';
  numberOfApartments: number | '';
}

interface FloorFormItemProps {
  floor: Floor;
  canRemove: boolean;
  isSubmitting: boolean;
  onFloorNumberChange: (id: string, value: string) => void;
  onApartmentCountChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
}

const FloorFormItem = ({
  floor,
  canRemove,
  isSubmitting,
  onFloorNumberChange,
  onApartmentCountChange,
  onRemove,
}: FloorFormItemProps) => {
  return (
    <div className='flex items-start gap-3 p-4 rounded-lg border bg-muted/30'>
      <div className='pt-2'>
        <GripVertical className='size-5 text-muted-foreground' />
      </div>
      
      <div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Floor Number */}
        <div className='space-y-2'>
          <Label htmlFor={`floor-number-${floor.id}`}>
            Floor Number *
          </Label>
          <Input
            id={`floor-number-${floor.id}`}
            type='number'
            min='1'
            value={floor.floorNumber}
            onChange={(e) => onFloorNumberChange(floor.id, e.target.value)}
            disabled={isSubmitting}
            required
            className='[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
          />
        </div>

        {/* Number of Apartments */}
        <div className='space-y-2'>
          <Label htmlFor={`apartment-count-${floor.id}`}>
            Number of Apartments *
          </Label>
          <Input
            id={`apartment-count-${floor.id}`}
            type='number'
            min='1'
            value={floor.numberOfApartments}
            onChange={(e) => onApartmentCountChange(floor.id, e.target.value)}
            disabled={isSubmitting}
            required
            className='[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
          />
        </div>
      </div>

      {/* Remove Button */}
      <Button
        type='button'
        variant='ghost'
        size='icon'
        onClick={() => onRemove(floor.id)}
        disabled={!canRemove || isSubmitting}
        className='mt-7'
      >
        <Trash2 className='size-4 text-destructive' />
      </Button>
    </div>
  );
};

export default FloorFormItem;
