export interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user?: any;
  product?: any;
}
