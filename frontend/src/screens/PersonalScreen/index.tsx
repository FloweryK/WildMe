import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { Box, Container, Grid, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { chatStore, cookie, toastStore } from "store";
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
import EmptyCard from "./components/EmptyCard";
import ScheduleCard from "./components/ScheduleCard";
import ReserveFormDialog from "./components/ReserveFormDialog";
import DeleteFormDialog from "./components/DeleteFormDialog";

const PersonalScreen = () => {
  const navigate = useNavigate();
  const [isOpenReserveForm, setOpenReserveForm] = useState<boolean>(false);
  const [isOpenDeleteForm, setOpenDeleteForm] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<GetScheduleResponse[]>([]);

  const handleOpenReserveForm = () => {
    setOpenReserveForm(true);
  };

  const handleCloseReserveForm = () => {
    setOpenReserveForm(false);
  };

  const handleOpenDeleteForm = () => {
    setOpenDeleteForm(true);
  };

  const handleCloseDeleteForm = () => {
    setOpenDeleteForm(false);
  };

  const handleLogout = () => {
    cookie.set("accessToken", "");
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
    setOpenReserveForm(false);

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
        <ReserveFormDialog
          open={isOpenReserveForm}
          handleSubmit={handleSubmitSchedule}
          handleClose={handleCloseReserveForm}
        />
        <DeleteFormDialog
          open={isOpenDeleteForm}
          handleClose={handleCloseDeleteForm}
        />
        <Header
          startIcon={<LogoutIcon />}
          onClickStartIcon={handleLogout}
          endIcon={<RefreshIcon />}
          onClickEndIcon={handleRefreshSchedule}
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
        <EmptyCard sx={{ marginBottom: 3 }} onClick={handleOpenReserveForm} />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={handleOpenDeleteForm}>
            <PersonOffIcon color="primary" />
          </IconButton>
        </Box>
      </Container>
    </Grid>
  );
};

export default observer(PersonalScreen);
