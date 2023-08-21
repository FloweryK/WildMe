import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import { getSchedule, reserveSchedule } from "api/personal";
import { GetScheduleResponse } from "api/personal/interface";
import { ToastContext } from "common/Toast";
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
      setSchedules(response);
    });
    setToastState({
      isToastOpen: true,
      toastSeverity: "success",
      toastText: "새로고침 완료",
    });
  };

  const handleSubmitSchedule = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // reserve and update schedule
    const formdata = new FormData(event.currentTarget);
    await reserveSchedule(formdata);
    setSchedules(await getSchedule());

    // close dialog
    setOpenDialog(false);
  };

  const handleClickSchedule = () => {
    navigate("/auth/chat");
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
        />
      ))}
    </Container>
  );
};

export default PersonalScreen;
