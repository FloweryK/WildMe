import { GetScheduleResponse } from "api/personal/interface";

export interface ScheduleCardProps {
  schedule: GetScheduleResponse;
  onClick: any;
  onStop: any;
  onDelete: any;
}
