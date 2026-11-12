import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BuildingNameFormProps {
  buildingName: string;
  isSubmitting: boolean;
  onBuildingNameChange: (name: string) => void;
}

const BuildingNameForm = ({
  buildingName,
  isSubmitting,
  onBuildingNameChange,
}: BuildingNameFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Building Information</CardTitle>
        <CardDescription>Enter the basic details of the building</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          <Label htmlFor='buildingName'>Building Name *</Label>
          <Input
            id='buildingName'
            placeholder='e.g., Central Plaza, Main Tower'
            value={buildingName}
            onChange={(e) => onBuildingNameChange(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BuildingNameForm;
