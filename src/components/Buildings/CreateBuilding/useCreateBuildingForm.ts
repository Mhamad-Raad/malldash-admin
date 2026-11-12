import { useState } from 'react';

export interface Floor {
  id: string;
  floorNumber: number | '';
  numberOfApartments: number | '';
}

export const useCreateBuildingForm = () => {
  const [buildingName, setBuildingName] = useState('');
  const [floors, setFloors] = useState<Floor[]>([
    { id: crypto.randomUUID(), floorNumber: 1, numberOfApartments: 1 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddFloor = () => {
    const newFloorNumber = floors.length > 0 
      ? Math.max(...floors.map(f => typeof f.floorNumber === 'number' ? f.floorNumber : 0)) + 1 
      : 1;
    
    setFloors([
      ...floors,
      {
        id: crypto.randomUUID(),
        floorNumber: newFloorNumber,
        numberOfApartments: 1
      }
    ]);
  };

  const handleRemoveFloor = (id: string) => {
    if (floors.length === 1) return; // Keep at least one floor
    setFloors(floors.filter(floor => floor.id !== id));
  };

  const handleFloorNumberChange = (id: string, value: string) => {
    // Only allow empty string or positive integers
    if (value === '' || /^\d+$/.test(value)) {
      const numValue = value === '' ? '' : parseInt(value);
      setFloors(floors.map(floor => 
        floor.id === id ? { ...floor, floorNumber: numValue as number } : floor
      ));
    }
  };

  const handleApartmentCountChange = (id: string, value: string) => {
    // Only allow empty string or positive integers
    if (value === '' || /^\d+$/.test(value)) {
      const numValue = value === '' ? '' : parseInt(value);
      setFloors(floors.map(floor => 
        floor.id === id ? { ...floor, numberOfApartments: numValue as number } : floor
      ));
    }
  };

  const validateForm = (): string | null => {
    if (!buildingName.trim()) {
      return 'Please enter a building name';
    }

    if (floors.length === 0) {
      return 'Please add at least one floor';
    }

    const hasInvalidFloor = floors.some(
      floor => (typeof floor.floorNumber === 'number' ? floor.floorNumber : 0) < 1 || 
               (typeof floor.numberOfApartments === 'number' ? floor.numberOfApartments : 0) < 1 ||
               floor.floorNumber === '' || 
               floor.numberOfApartments === ''
    );

    if (hasInvalidFloor) {
      return 'Floor numbers and apartment counts must be at least 1';
    }

    return null;
  };

  const getBuildingData = () => ({
    name: buildingName,
    floors: floors.map(floor => ({
      floorNumber: typeof floor.floorNumber === 'number' ? floor.floorNumber : 1,
      numberOfApartments: typeof floor.numberOfApartments === 'number' ? floor.numberOfApartments : 1
    }))
  });

  return {
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
  };
};
