export interface Occupant {
  id: string;
  name: string;
  email: string;
}

export interface Apartment {
  id: number;
  apartmentName?: string;
  occupant: Occupant | null; // New API format uses single occupant
}

export interface Floor {
  id: number;
  floorNumber: number;
  apartments: Apartment[];
}

export interface Building {
  id: number;
  name: string;
  floors: Floor[];
}

// API response interface for building detail

export interface BuildingDetailFloor {
  id: number;
  floorNumber: number;
  apartments: Apartment[];
}

export interface BuildingDetail {
  id: number;
  name: string;
  floors: BuildingDetailFloor[];
}

// API response interface for buildings list
export interface BuildingListItem {
  id: number;
  name: string;
  numberOfFloors: number;
  totalApartments: number;
  occupants: number;
}

export interface BuildingsTableProps {
  buildings: BuildingListItem[];
}

export interface BuildingType {
  id: number;
  name: string;
  numberOfFloors: number;
  totalApartments: number;
  occupants: 0;
  floors?: Floor[];
}
