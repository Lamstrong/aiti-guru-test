export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
};

export type AuthError = {
  message: string;
};

export type JwtPayload = {
  id: number;
  username: string;
  iat: number;
  exp?: number;
};

export type LoginFormData = {
  username: string;
  password: string;
  rememberMe: boolean;
};
