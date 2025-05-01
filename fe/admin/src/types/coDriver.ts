export type CoDriverType = {
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
  role: "co-driver";
  createAt: string;
  updateAt: string;
};
