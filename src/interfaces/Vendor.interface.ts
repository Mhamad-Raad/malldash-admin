// API Response Type
export interface VendorAPIResponse {
  id: number;
  name: string;
  description: string;
  profileImageUrl: string | null;
  openingTime: string; // "02:16:00"
  closeTime: string; // "06:20:00"
  type: string; // "Restaurant"
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string; // List endpoint returns 'email'
  userEmail?: string; // Detail endpoint returns 'userEmail'
  userProfileImageUrl?: string; // User's profile image
}

// UI Display Type (for backwards compatibility with existing components)
export interface VendorType {
  _id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phoneNumber: string;
  address: string;
  logo: string;
  workingHours: {
    open: string; // e.g., "09:00"
    close: string; // e.g., "18:00"
  };
  type: string; // e.g., "Restaurant", "Market", "Bakery"
  description?: string;
  userId?: string;
  userProfileImageUrl?: string; // User's profile image
}

export interface VendorsType {
  vendors: VendorType[];
}

// Helper function to convert API response to UI type
export function mapVendorAPIToUI(apiVendor: VendorAPIResponse): VendorType {
  return {
    _id: apiVendor.id.toString(),
    businessName: apiVendor.name,
    ownerName: `${apiVendor.firstName} ${apiVendor.lastName}`,
    email: apiVendor.email || apiVendor.userEmail || '', // Handle both list and detail endpoints
    phoneNumber: apiVendor.phone,
    address: '', // Not provided in API
    logo: apiVendor.profileImageUrl || '',
    workingHours: {
      open: apiVendor.openingTime.substring(0, 5), // "02:16:00" -> "02:16"
      close: apiVendor.closeTime.substring(0, 5), // "06:20:00" -> "06:20"
    },
    type: apiVendor.type,
    description: apiVendor.description,
    userId: apiVendor.userId,
    userProfileImageUrl: apiVendor.userProfileImageUrl,
  };
}
