export interface ProductType {
  id: number;
  name: string;
  description?: string;
  price: number;
  discountPrice: number | null;
  inStock: boolean;
  isWeightable: boolean;
  productImageUrl: string;
  vendorId: number;
  vendorName: string;
  categoryId: number;
  categoryName: string;
}

export interface ProductsType {
  products: ProductType[];
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  vendorId?: number;
  categoryId?: number;
  searchName?: string;
  inStock?: boolean;
}
