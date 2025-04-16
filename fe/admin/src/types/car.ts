export interface Car {
  id: number;
  // name?: string;
  licensePlate: string;
  capacity: number;
  type: "Xe thường" | "Xe giường nằm";
  // status?: "Sắp khởi hành" | "Đang chạy" | "Bảo trì";
  image?: ImgCar;
  images?: ImgCar[];
  createAt?: string; // timestamp
  updateAt?: string;
}

export type IsMain = 0 | 1;
export interface ImgCar {
  id?: number;
  carId: number;
  urlImg: string;
  urlPublicImg: string;
  isMain: IsMain;
}
