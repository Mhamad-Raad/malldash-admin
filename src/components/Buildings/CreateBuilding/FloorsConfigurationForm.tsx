import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import FloorFormItem from './FloorFormItem';

interface Floor {
  id: string;
  floorNumber: number | '';
  numberOfApartments: number | '';
}

interface FloorsConfigurationFormProps {
  floors: Floor[];
  isSubmitting: boolean;
  onAddFloor: () => void;
  onRemoveFloor: (id: string) => void;
  onFloorNumberChange: (id: string, value: string) => void;
  onApartmentCountChange: (id: string, value: string) => void;
}

const FloorsConfigurationForm = ({
  floors,
  isSubmitting,
  onAddFloor,
  onRemoveFloor,
  onFloorNumberChange,
  onApartmentCountChange,
}: FloorsConfigurationFormProps) => {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Floors Configuration</CardTitle>
            <CardDescription>
              Add and configure floors for this building
            </CardDescription>
          </div>
          <Button
            type='button'
            onClick={onAddFloor}
            disabled={isSubmitting}
            className='gap-2'
          >
            <Plus className='size-4' />
            Add Floor
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[400px] pr-4'>
          <div className='space-y-4'>
            {floors.map((floor) => (
              <FloorFormItem
                key={floor.id}
                floor={floor}
                canRemove={floors.length > 1}
                isSubmitting={isSubmitting}
                onFloorNumberChange={onFloorNumberChange}
                onApartmentCountChange={onApartmentCountChange}
                onRemove={onRemoveFloor}
              />
            ))}

            {floors.length === 0 && (
              <div className='text-center py-8 text-muted-foreground'>
                No floors added yet. Click "Add Floor" to get started.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FloorsConfigurationForm;
