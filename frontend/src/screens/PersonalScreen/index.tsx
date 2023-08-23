import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
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
import { observer } from "mobx-react";

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
    getSchedule().then((response) => {
      toastStore.setToast(toastStates.SUCCESS_REFRESH);
      setSchedules(response);
    });
  };

  const handleSubmitSchedule = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // close dialog
    setOpenDialog(false);

    // reserve and update schedule
    const formdata = new FormData(event.currentTarget);
    await reserveSchedule(formdata);
    setSchedules(await getSchedule());
  };

  const handleClickSchedule = (schedule: GetScheduleResponse) => {
    chatStore.setTag(schedule.tag);
    navigate("/auth/chat");
  };

  const handleStopSchedule = async (schedule: GetScheduleResponse) => {
    // make request data
    const data: StopScheduleRequest = {
      tag: schedule.tag.toString(),
    };

    // send stop request
    stopSchedule(data).then((response) => {
      handleRefreshSchedule();
    });
  };

  const handleDeleteSchedule = async (schedule: GetScheduleResponse) => {
    // make request data
    const data: DeleteScheduleRequest = {
      tag: schedule.tag.toString(),
    };

    // send delete request
    deleteSchedule(data).then((response) => {
      handleRefreshSchedule();
    });
  };

  return (
    <Container component="main" maxWidth="xs">
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
    </Container>
  );
};

export default observer(PersonalScreen);
