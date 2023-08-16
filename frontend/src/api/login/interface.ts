export interface AuthRequest {
  name: string;
  password: string;
}

export interface SignInResponse {
  Authorization: string;
}

export interface SignUpResponse {
  id: number;
  name: string;
  path_coning: string | null;
  path_data: string | null;
  path_vocab: string | null;
  path_weight: string | null;
  reserve_status: string | null;
  reserve_timestamp: number | null;
  speaker: string | null;
}
