export interface UserType {
  _id: string;
  id?: string; // Fallback for some APIs returning id instead of _id
  firstName: string;
  lastName: string;
  role: number;
  profileImageUrl: string;
  phoneNumber: string;
  email: string;
  buildingName: string;
  // Helper fields for UI
  src?: string; // Alias for profileImageUrl (for backward compatibility)
  fallback?: string; // Generated initials for avatar fallback
}

// Extended type for form data with optional image file
export interface UserFormData extends UserType {
  imageFile?: File;
}

export interface UsersType {
  users: UserType[];
}
