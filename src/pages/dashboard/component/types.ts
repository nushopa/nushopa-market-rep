export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image: string;
}

export interface MappedOrder {
  id: string;
  assignedTo: string;
  avatar: string;
  timestamp: string;
  status: string;
  amount: number;
  customerContact: string;
  itemQty: number;
  chat: string;
  items: OrderItem[];
}

export interface ProductItem {
  product_quantity: number;
  product_id?: {
    product_name?: string;
    product_price?: number;
    product_image?: string;
  };
}