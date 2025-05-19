export interface LoginPayLoad {
  email: string;
  password: string;
}

export interface RegisterPayLoad {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailPayLoad {
  email: string;
  otp: string;
}

export interface UpdatePasswordPayLoad {
  passwordOld: string;
  passwordNew: string;
  confirmPassword: string;
}

export interface UpdateForgotPasswordPayLoad {
  passwordNew: string;
  confirmPassword: string;
}
