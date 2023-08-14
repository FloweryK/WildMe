export interface SignInRequest {
  name: string;
  password: string;
}

export interface SignInResponse {
  token: string;
}
