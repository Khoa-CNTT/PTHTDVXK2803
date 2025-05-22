export interface PayOSType {
  orderCode: number;
  amount: number;
  description?: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  buyerAddress?: string;
  items: Item[];
  returnUrl: string;
  cancelUrl: string;
}

interface Item {
  name: string;
  quantity: number;
  price: number;
}

// interface Ticket {
//   ticketID: number;
//   tripId?: number;
//   customerId?: number;
//   transactionId?: string;
//   seats?: string;
//   total_price?: number;
//   // paymentStatus: string
//   // paymentType: string
// }
