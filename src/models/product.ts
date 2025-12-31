export interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
