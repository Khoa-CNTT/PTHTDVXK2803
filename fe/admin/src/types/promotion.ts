export interface PromotionType {
  id?: number;
  code: string;
  carType: string;
  type: string;
  discountAmount: number;
  description?: string;
  startDate: string;
  endDate: string;
}
