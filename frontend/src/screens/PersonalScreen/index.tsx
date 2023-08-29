import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { Container, Grid } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
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
import Header from "common/Header";
import { toastStates } from "common/Toast";
import { setCookie } from "common/cookie";
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

  const handleLogout = () => {
    setCookie("accessToken", "");
    toastStore.setToast(toastStates.SUCCESS_LOGOUT);
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
        <Header
          startIcon={<LogoutIcon />}
          onClickStartIcon={handleLogout}
          endIcon={<RefreshIcon />}
          onClickEndIcon={handleRefreshSchedule}
        />
        <ReserveFormDialog
          open={isOpenDialog}
          handleSubmit={handleSubmitSchedule}
          handleClose={handleCloseDialog}
        />
        {schedules?.map((schedule) => (
          <ScheduleCard
            key={schedule.reserve_timestamp}
            schedule={schedule}
            onClick={() => handleClickSchedule(schedule)}
            onStop={() => handleStopSchedule(schedule)}
            onDelete={() => handleDeleteSchedule(schedule)}
          />
        ))}
        <EmptyCard sx={{ marginBottom: 3 }} onClick={handleOpenDialog} />
      </Container>
    </Grid>
  );
};

export default observer(PersonalScreen);
