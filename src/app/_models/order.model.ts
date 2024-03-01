//Define the Order model.
export interface Order {
  id: string;
  paid: boolean;
  customerId: string;
  products: string[];
  total: number;
}
