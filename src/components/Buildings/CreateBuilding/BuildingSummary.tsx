import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Floor {
  id: string;
  floorNumber: number | '';
  numberOfApartments: number | '';
}

interface BuildingSummaryProps {
  buildingName: string;
  floors: Floor[];
}

const BuildingSummary = ({ buildingName, floors }: BuildingSummaryProps) => {
  const getTotalApartments = () => {
    return floors.reduce((sum, floor) => {
      const apartments = typeof floor.numberOfApartments === 'number' ? floor.numberOfApartments : 0;
      return sum + apartments;
    }, 0);
  };

  return (
    <Card className='bg-primary/5 border-primary/20'>
      <CardHeader>
        <CardTitle className='text-lg'>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
          <div>
            <p className='text-muted-foreground'>Building Name</p>
            <p className='font-semibold'>
              {buildingName || 'Not set'}
            </p>
          </div>
          <div>
            <p className='text-muted-foreground'>Total Floors</p>
            <p className='font-semibold'>{floors.length}</p>
          </div>
          <div>
            <p className='text-muted-foreground'>Total Apartments</p>
            <p className='font-semibold'>{getTotalApartments()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuildingSummary;
