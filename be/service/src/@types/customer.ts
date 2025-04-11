export type CustomerType = {
  id: number;
  email: string;
  fullName: string;
  password: string;
  dateBirth: string;
  phone: string;
  address: string;
  provider: "google" | "facebook" | "email";
  urlImg: string;
  urlPublicImg: string;
  createAt: string; // timestamp
  updateAt: string; // timestamp
  role: "customer" | "admin" | "user";
};

export interface CustomerRegister {
  email: string;
  password: string;
  fullName: string;
}

export interface CustomerLogin {
  email: string;
  password: string;
}
