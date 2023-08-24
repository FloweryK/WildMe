import { styled } from "styled-components";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import StopIcon from "@mui/icons-material/Stop";
import DeleteIcon from "@mui/icons-material/Delete";
import { ScheduleCardProps } from "./interface";

const StyledScheduleCard = styled.div`
  .card {
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;
const secondsToHMS = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.round(seconds) % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const ScheduleCard = (props: ScheduleCardProps) => {
  const { schedule, onClick, onStop, onDelete } = props;

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
              예약 날짜: {date}
              <br />
              파일 이름: {schedule.filename}
              <br />
              학습 상태: {schedule.reserve_status}
              <br />
              학습 태그: {schedule.tag}
              <br />
              학습 진행도: {schedule.i_epoch + 1} / {schedule.n_epoch}
              <br />
              남은 시간: {secondsToHMS(schedule.ETA)}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button onClick={onStop} color="primary" startIcon={<StopIcon />} />
          <Button
            onClick={onDelete}
            color="primary"
            startIcon={<DeleteIcon />}
          />
        </CardActions>
      </Card>
    </StyledScheduleCard>
  );
};

export default ScheduleCard;
