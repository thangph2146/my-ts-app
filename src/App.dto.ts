export type ApiResultType<T> = {
  isSuccess: boolean;
  data: T;
  errorCode?: number;
  errors?: string[];
};
export type DataType = {
  limit?: number;
  products?: ProductType[];
  skip?: number;
  total?: number;
};
export type ProductType = {
  id?: number;
  title?: string;
  description?: string;
  price?: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category?: string;
  thumbnail?: string;
  images?: string[];
  prand?: string;
};
