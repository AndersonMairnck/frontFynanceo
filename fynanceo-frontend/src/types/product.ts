export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  categoryId: number;
  categoryName: string;
  isActive: boolean;
  createdAt: Date;
  modifiedAt?: Date;
  deactivatedAt?: Date;
  deactivatedReason?: string;
}

export interface ProductDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  categoryId: number;
  categoryName: string;
  isActive: boolean;
  createdAt: Date;
  modifiedAt?: Date;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  categoryId: number;
}

export interface DeactivateRequest {
  reason: string;
}

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  categoryId: number;
  isActive: boolean;
};

export interface PaginatedProductResponse {
  items: ProductDTO[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}