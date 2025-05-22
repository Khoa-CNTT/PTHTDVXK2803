export interface User extends UserInfo {
  email: string;
  fullName: string;
  dateBirth?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  sex?: "male" | "female" | "other";
}

export interface UserInfo {
  id?: number;
}
