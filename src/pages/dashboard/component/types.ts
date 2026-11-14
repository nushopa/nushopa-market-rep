export interface MappedItem {
  name: string;
  qty: number;
  price: number; // unit price
  image: string;
}

export interface MappedOrder {
  id: string; // the orderID string
  assignedTo: string;
  timestamp: string;
  status: string; // lowercase
  amount: number;
  customerName: string;
  customerPhone: string;
  itemQty: number;
  chat: string;
  items: MappedItem[];
}

export interface ProductItem {
  product_quantity: number;
  product_id?: {
    product_name?: string;
    product_price?: number;
    product_image?: string;
  };
}
