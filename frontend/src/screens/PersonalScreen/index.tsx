import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { Box, Container, Grid, Paper } from "@mui/material";
import { chatStore, toastStore } from "store";
import {
  deleteSchedule,
  getSchedule,
  reserveSchedule,
  stopSchedule,
} from "api/personal";
import {
  DeleteScheduleRequest,
  GetScheduleResponse,
  StopScheduleRequest,
} from "api/personal/interface";
import { toastStates } from "common/Toast";
import Header from "./components/Header";
import EmptyCard from "./components/EmptyCard";
import ScheduleCard from "./components/ScheduleCard";
import ReserveFormDialog from "./components/ReserveFormDialog";

const PersonalScreen = () => {
  const navigate = useNavigate();
  const [isOpenDialog, setOpenDialog] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<GetScheduleResponse[]>([]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleRefreshSchedule = async () => {
    getSchedule().then((data) => {
      toastStore.setToast(toastStates.SUCCESS_REFRESH);
      setSchedules(data);
    });
  };

  const handleSubmitSchedule = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // close dialog
    setOpenDialog(false);

    // reserve
    const request = new FormData(event.currentTarget);
    await reserveSchedule(request);

    // update
    setSchedules(await getSchedule());
  };

  const handleStopSchedule = async (schedule: GetScheduleResponse) => {
    // make request data
    const request: StopScheduleRequest = {
      tag: schedule.tag.toString(),
    };

    // send stop request
    stopSchedule(request).then((data) => {
      handleRefreshSchedule();
    });
  };

  const handleDeleteSchedule = async (schedule: GetScheduleResponse) => {
    // make request data
    const request: DeleteScheduleRequest = {
      tag: schedule.tag.toString(),
    };

    // send delete request
    deleteSchedule(request).then((data) => {
      handleRefreshSchedule();
    });
  };

  const handleClickSchedule = (schedule: GetScheduleResponse) => {
    chatStore.setTag(schedule.tag);
    navigate("/auth/chat");
  };

  useEffect(() => {
    handleRefreshSchedule();
  }, []);

  return (
    <Grid container>
      <Container maxWidth="xs">
        <Box sx={{ marginTop: 3 }}>
          <Header onRefresh={handleRefreshSchedule} />
          <ReserveFormDialog
            open={isOpenDialog}
            handleSubmit={handleSubmitSchedule}
            handleClose={handleCloseDialog}
          />
          <EmptyCard onClick={handleOpenDialog} />
          {schedules?.map((schedule) => (
            <ScheduleCard
              key={schedule.reserve_timestamp}
              schedule={schedule}
              onClick={() => handleClickSchedule(schedule)}
              onStop={() => handleStopSchedule(schedule)}
              onDelete={() => handleDeleteSchedule(schedule)}
            />
          ))}
        </Box>
      </Container>
    </Grid>
  );
};

export default observer(PersonalScreen);
