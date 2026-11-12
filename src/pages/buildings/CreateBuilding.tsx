import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2 } from 'lucide-react';
import BuildingNameForm from '@/components/Buildings/CreateBuilding/BuildingNameForm';
import FloorsConfigurationForm from '@/components/Buildings/CreateBuilding/FloorsConfigurationForm';
import BuildingSummary from '@/components/Buildings/CreateBuilding/BuildingSummary';
import { useCreateBuildingForm } from '@/components/Buildings/CreateBuilding/useCreateBuildingForm';

const CreateBuilding = () => {
  const navigate = useNavigate();
  const {
    buildingName,
    setBuildingName,
    floors,
    isSubmitting,
    setIsSubmitting,
    handleAddFloor,
    handleRemoveFloor,
    handleFloorNumberChange,
    handleApartmentCountChange,
    validateForm,
    getBuildingData,
  } = useCreateBuildingForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSubmitting(true);

    // Prepare data for API
    const buildingData = getBuildingData();

    try {
      // TODO: Replace with actual API call
      
      console.log('Building data to submit:', buildingData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to buildings list
      navigate('/buildings');
    } catch (error) {
      console.error('Error creating building:', error);
      alert('Failed to create building. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/buildings');
  };

  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-lg bg-primary/10 text-primary'>
            <Building2 className='size-5' />
          </div>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Add New Building</h1>
            <p className='text-sm text-muted-foreground'>
              Create a new building with floors and apartments
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Building Name */}
        <BuildingNameForm
          buildingName={buildingName}
          isSubmitting={isSubmitting}
          onBuildingNameChange={setBuildingName}
        />

        {/* Floors Configuration */}
        <FloorsConfigurationForm
          floors={floors}
          isSubmitting={isSubmitting}
          onAddFloor={handleAddFloor}
          onRemoveFloor={handleRemoveFloor}
          onFloorNumberChange={handleFloorNumberChange}
          onApartmentCountChange={handleApartmentCountChange}
        />

        {/* Summary */}
        <BuildingSummary buildingName={buildingName} floors={floors} />

        {/* Action Buttons */}
        <div className='flex items-center justify-end gap-3'>
          <Button
            type='button'
            variant='outline'
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Building'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBuilding;
