import type { VendorType } from '@/interfaces/Vendor.interface';

export const initialVendor: VendorType = {
  _id: '',
  businessName: '',
  ownerName: '',
  email: '',
  phoneNumber: '',
  address: '',
  logo: '',
  workingHours: {
    open: '',
    close: '',
  },
  type: '',
  description: '',
};
