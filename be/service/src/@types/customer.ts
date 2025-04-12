export type ProviderType = "google" | "facebook" | "email";

export interface CustomerType {
  id: number;
  email: string;
  fullName: string;
  password: string;
  dateBirth: string;
  phone: string;
  address: string;
  provider: ProviderType;
  urlImg: string;
  urlPublicImg: string;
  createAt: string; // timestamp
  updateAt: string; // timestamp
  role: "customer";
}
