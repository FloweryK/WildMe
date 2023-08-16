import { Card, CardContent, Typography } from "@mui/material";
import { GetScheduleResponse } from "api/personal/interface";

interface ScheduleCardProps {
  schedule: GetScheduleResponse;
}

const ScheduleCard = (props: ScheduleCardProps) => {
  const { schedule } = props;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {schedule.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {schedule.reserve_status}
          <br />
          {schedule.reserve_timestamp}
          <br />
          {schedule.filename}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;
