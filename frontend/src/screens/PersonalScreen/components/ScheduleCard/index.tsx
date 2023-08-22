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
              {schedule.reserve_status}
              <br />
              {date}
              <br />
              {schedule.filename}
              <br />
              {schedule.tag}
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
