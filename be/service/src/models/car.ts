export interface Car {
  id?: number;
  name?: string;
  licensePlate?: string;
  capacity?: number;
  images: Image[];
  type?: "xe thường" | "xe giường nằm";
  status?: "Sắp khởi hành" | "Đang chạy" | "Bảo trì";
  createAt?: string; // timestamp
  updateAt?: string;
}

export interface Image {
  id?: number;
  carId?: number;
  publicImg?: string;
  urlPublicImg?: string;
  isMain?: 0 | 1;
  createAt?: string; // timestamp
  updateAt?: string;
}
