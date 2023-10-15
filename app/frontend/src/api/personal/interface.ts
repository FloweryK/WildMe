export interface ReserveScheduleResponse {
  id: number;
  name: string;
  path_config: string;
  path_data: string;
  path_vocab: string;
  path_weight: string;
  reserve_status: string;
  reserve_timestamp: number;
  speaker: string;
}

export interface GetScheduleResponse {
  tag: string;
  name: string;
  filename: string;
  reserve_status: string;
  reserve_timestamp: number;
  reserve_message: string;
  reserve_order: number;
  i_epoch: number;
  n_epoch: number;
  ETA: number;
}

export interface StopScheduleRequest {
  tag: string;
}

export interface DeleteScheduleRequest {
  tag: string;
}

export interface DeleteAccountResponse {
  message: string;
}
