import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { GetScheduleResponse } from "api/personal/interface";

interface ScheduleCardProps {
  schedule: GetScheduleResponse;
  onClick: any;
}

const ScheduleCard = (props: ScheduleCardProps) => {
  const { schedule, onClick } = props;

  const date = new Date(schedule.reserve_timestamp * 1000).toLocaleString();

  return (
    <Card variant="outlined">
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {schedule.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {schedule.reserve_status}
            <br />
            {date}
            <br />
            {schedule.filename}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ScheduleCard;
