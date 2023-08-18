import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Button, Container } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import { ToastContext } from "common/Toast";
import { getSchedule, reserveSchedule } from "api/personal";
import { GetScheduleResponse } from "api/personal/interface";
import ScheduleCard from "./components/ScheduleCard";
import EmptyCard from "./components/EmptyCard";
import ReserveFormDialog from "./components/ReserveFormDialog";

export default function PersonalScreen() {
  const [isOpenDialog, setOpenDialog] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<GetScheduleResponse[]>([]);
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const { setToastState } = useContext(ToastContext);

  const handleLogout = () => {
    removeCookie("accessToken");
    setToastState({
      isToastOpen: true,
      toastSeverity: "success",
      toastText: "로그아웃 완료",
    });
  };

  const handleRefresh = async () => {
    getSchedule().then((response) => {
      setSchedules(response);
    });
  };

  const handleAdd = () => {
    setOpenDialog(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // reserve and update schedule
    const formdata = new FormData(event.currentTarget);
    await reserveSchedule(formdata);
    setSchedules(await getSchedule());

    // close dialog
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <ReserveFormDialog open={isOpenDialog} handleSubmit={handleSubmit} handleClose={handleCloseDialog} />
      <Button onClick={handleLogout} color="primary" startIcon={<LogoutIcon />}>
        로그아웃
      </Button>
      <Button onClick={handleRefresh} color="primary" startIcon={<RefreshIcon />}>
        새로고침
      </Button>
      <EmptyCard onClick={handleAdd} />
      {schedules?.map((schedule) => (
        <ScheduleCard key={schedule.reserve_timestamp} schedule={schedule} />
      ))}
    </Container>
  );
}
