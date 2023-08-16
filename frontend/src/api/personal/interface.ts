export interface ReserveScheduleRequest {
  speaker: string;
  n_vocab: number;
  n_seq: number;
  n_layer: number;
  n_head: number;
  d_emb: number;
  d_hidden: number;
  dropout: number;
  scale: number;
  r_split: number;
  device: string;
  use_amp: boolean;
  n_epoch: number;
  n_batch: number;
  n_accum: number;
  lr: number;
  warmup_steps: number;
  label_smoothing: number;
  data_type: string;
}

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
}
