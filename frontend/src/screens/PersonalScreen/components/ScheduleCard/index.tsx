import { styled } from "styled-components";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  IconButton,
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

const getStatusText = (schedule: any) => {
  switch (schedule.reserve_status) {
    case "reserved":
      return `대기 중 (${schedule.reserve_order}번째)`;
    case "ongoing":
      return `학습 중 (${schedule.i_epoch}/${
        schedule.n_epoch
      }, ETA: ${secondsToHMS(schedule.ETA)})`;
    case "done":
      return "완료";
    case "failed":
      return (
        <>
          오류 <br />({schedule.reserve_message})
        </>
      );
    default:
      return `확인 필요 (${schedule.reserve_status})`;
  }
};

const ScheduleCard = (props: ScheduleCardProps) => {
  const { schedule, onClick, onStop, onDelete } = props;

  const date = new Date(schedule.reserve_timestamp * 1000).toLocaleString();

  return (
    <StyledScheduleCard>
      <Card className="card" variant="outlined">
        <CardActionArea onClick={onClick}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} gutterBottom>
              {schedule.name}
            </Typography>
            <Typography sx={{ mb: 1.5 }}>
              예약 날짜: {date}
              <br />
              파일 이름: {schedule.filename}
              <br />
              진행 상태: {getStatusText(schedule)}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <IconButton onClick={onStop} sx={{ marginRight: 3 }}>
            <StopIcon color="primary" />
          </IconButton>
          <IconButton onClick={onDelete}>
            <DeleteIcon color="primary" />
          </IconButton>
        </CardActions>
      </Card>
    </StyledScheduleCard>
  );
};

export default ScheduleCard;
