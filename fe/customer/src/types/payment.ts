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

export interface DataPaymentSuccess {
  id: number;
  customerId: number;
  email: string;
  fullName: string;
  phone: string;
  tripName: string;
  startTime: string;
  departure: string;
  arrival: string;
  seatPosition: string;
  paymentStatus: string;
  paymentMethod: string;
  price: number;
}
