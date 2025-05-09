export type CarType = "xe thường" | "xe giường nằm" | "";
export type CarStatus = "sẵn sàng" | "sắp khởi hành" | "đang chạy" | "bảo trì";

export interface Car {
  id?: number;
  currentLocationId: number;
  name?: string;
  licensePlate?: string;
  capacity?: number;
  images: Image[];
  type?: CarType;
  status?: "Sắp khởi hành" | "Đang chạy" | "Bảo trì";
  createAt?: string; // timestamp
  updateAt?: string;
  indexIsMian?: number;
}

export interface RequestWithCar extends Request {
  params: Record<string, string> & {
    licensePlate?: string;
    type?: string;
    status?: string;
  };
}

export const statusMap: Record<string, CarStatus> = {
  "sap-khoi-hanh": "sắp khởi hành",
  "dang-chay": "đang chạy",
  "bao-tri": "bảo trì",
  "san-sang": "sẵn sàng",
};

export const typeMap: Record<string, CarType | ""> = {
  all: "",
  "xe-thuong": "xe thường",
  "xe-giuong-nam": "xe giường nằm",
};

export type MainImgCar = 0 | 1;

export interface Image {
  id?: number;
  carId?: number;
  publicImg?: string;
  urlPublicImg?: string;
  isMain?: MainImgCar;
  createAt?: string; // timestamp
  updateAt?: string;
}
