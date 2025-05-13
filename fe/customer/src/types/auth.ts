export interface User {
  readonly email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: Date;
  portrait?: string;
  address?: string;
}

export interface PayLoad<T> {
  type: string;
  payload?: T;
  error?: Error;
}

export interface LoginPayLoad {
  // username: string;
  email: string;
  password: string;
}

export interface RegisterPayLoad {
  email: string;
  password: string;
  confirmPassword: string;
}
