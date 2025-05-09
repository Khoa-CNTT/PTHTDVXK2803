export interface ModelUser {
  id: number;
  email: string;
  fullName: string;
  password?: string;
  citizenIdCard?: string; //CCCD
  sex?: "male" | "female" | "other";
  dateBirth?: string;
  phone?: string;
  address?: string;
  urlImg?: string;
  urlPublicImg?: string;
  createAt?: string;
  updateAt?: string;
}

export interface ModelCoDriver extends ModelUser {
  currentLocationId?: number; // id của vị trí hiện tại
  role: "co-driver";
}

export interface ModelDriver extends ModelUser {
  currentLocationId?: number; // id của vị trí hiện tại
  licenseNumber?: string; // số bằng lái xe
  experienceYears?: string; // số năm kinh nghiệm lái xe
  role: "driver";
}
export interface ModelCustomer extends ModelUser {
  provider?: "google" | "facebook" | "email";
  role?: "customer";
}

export interface ModelAdmin {
  email: string;
  password?: string;
  createAt: string;
  updateAt: string;
}
