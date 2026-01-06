export interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  userId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}
