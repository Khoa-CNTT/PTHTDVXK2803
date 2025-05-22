export type TypeBus = "xe thường" | "xe giường nằm";

export interface CarInfo {
  id: number;
  type: TypeBus;
  licensePlate: string;
}
