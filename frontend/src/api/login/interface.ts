export interface SignRequest {
  name: string;
  password: string;
}

export interface SignInResponse {
  Authorization: string;
}

export interface SignUpResponse {
  id: number;
  name: string;
}
