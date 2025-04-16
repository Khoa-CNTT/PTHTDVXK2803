export type DriverType = {
  id: number;
  email: string;
  fullName?: string;
  password?: string;
  sex?: "male" | "female" | "other";
  licenseNumber?: string; // số bằng lái xe
  experienceYears?: string; // số năm kinh nghiệm lái xe
  dateBirth?: string;
  phone?: string;
  address?: string;
  urlImg?: string;
  urlPublicImg?: string;
  createAt?: string; // timestamp
  updateAt?: string; // timestamp
  role: "driver";
};
