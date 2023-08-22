import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import { deleteSchedule, getSchedule, reserveSchedule } from "api/personal";
import {
  DeleteScheduleRequest,
  GetScheduleResponse,
} from "api/personal/interface";
import { ToastContext, toastStates } from "common/Toast";
import Header from "./components/Header";
import EmptyCard from "./components/EmptyCard";
import ScheduleCard from "./components/ScheduleCard";
import ReserveFormDialog from "./components/ReserveFormDialog";

const PersonalScreen = () => {
  const navigate = useNavigate();
  const { setToastState } = useContext(ToastContext);
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
      setToastState(toastStates.SUCCESS_REFRESH);
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

  const handleClickSchedule = () => {
    navigate("/auth/chat");
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
          onClick={handleClickSchedule}
          onDelete={() => handleDeleteSchedule(schedule)}
        />
      ))}
    </Container>
  );
};

export default PersonalScreen;
