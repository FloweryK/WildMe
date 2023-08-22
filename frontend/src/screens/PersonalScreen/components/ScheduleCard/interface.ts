import { GetScheduleResponse } from "api/personal/interface";

export interface ScheduleCardProps {
  schedule: GetScheduleResponse;
  onClick: any;
  onDelete: any;
}
