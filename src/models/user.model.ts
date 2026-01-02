import type { Product } from "./product.js";
import type { Order } from "./order.model.js";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  products?: Product[];
  orders?: Order[];
}

export interface UserWithoutPassword extends Omit<User, "password"> {}
