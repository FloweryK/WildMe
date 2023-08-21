import { styled } from "styled-components";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { ScheduleCardProps } from "./interface";

const StyledScheduleCard = styled.div`
  .card {
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;

const ScheduleCard = (props: ScheduleCardProps) => {
  const { schedule, onClick } = props;

  const date = new Date(schedule.reserve_timestamp * 1000).toLocaleString();

  return (
    <StyledScheduleCard>
      <Card className="card" variant="outlined">
        <CardActionArea onClick={onClick}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
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
    </StyledScheduleCard>
  );
};

export default ScheduleCard;
