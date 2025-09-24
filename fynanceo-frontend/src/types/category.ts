export interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

export type CategoryFormData = {
  name: string;
  description: string;
  isActive: boolean;
};

export interface PaginatedCategoryResponse {
  items: Category[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}