import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import { getSchedule, reserveSchedule } from "api/personal";
import { GetScheduleResponse } from "api/personal/interface";
import ScheduleCard from "./components/ScheduleCard";
import EmptyCard from "./components/EmptyCard";
import ReserveFormDialog from "./components/ReserveFormDialog";
import Header from "./components/Header";

export default function PersonalScreen() {
  const navigate = useNavigate();
  const [isOpenDialog, setOpenDialog] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<GetScheduleResponse[]>([]);

  const handleRefresh = async () => {
    getSchedule().then((response) => {
      setSchedules(response);
    });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmitSchedule = async (event: React.FormEvent<HTMLFormElement>) => {
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
      <Header onRefresh={handleRefresh} />
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
}
