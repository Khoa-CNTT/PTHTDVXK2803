export type TypeBus = "xe thường" | "xe giường nằm";
export interface BusType {
  id: number;
  // name?: string;
  licensePlate: string;
  capacity: number;
  type: TypeBus;
  // status?: "Sắp khởi hành" | "Đang chạy" | "Bảo trì";
  image?: ImgBus;
  images?: ImgBus[];
  location: {
    id: number;
    name: string;
  };
  createAt?: string; // timestamp
  updateAt?: string;
}

export interface ImgBus {
  id?: number;
  carId: number;
  urlImg: string;
  urlPublicImg: string;
  isMain: 0 | 1;
}
