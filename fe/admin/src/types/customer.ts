export type CustomerType = {
  id?: number;
  providerId?: string;
  email: string;
  fullName: string;
  sex?: "male" | "female" | "other";
  urlImg?: string;
  urlPublicImg?: string;
  phone?: string;
  dateBirth?: string;
  address?: string;
  provider?: string;
  role: "customer";
  createAt: string;
  updateAt: string;
};
