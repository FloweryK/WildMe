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
  name: string;
  filename: string;
  reserve_status: string;
  reserve_timestamp: number;
  tag: string;
}

export interface StopScheduleRequest {
  tag: string;
}

export interface DeleteScheduleRequest {
  tag: string;
}
