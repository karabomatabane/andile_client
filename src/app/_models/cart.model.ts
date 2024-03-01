import { User } from "./auth.model";
import { Product } from "./product.model";

export interface Cart {
  id: string;
  products: [
    {
      product: Product;
      quantity: number;
    }
  ];
}