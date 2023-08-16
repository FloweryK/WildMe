import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Button, Container } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContext } from "common/Toast";
import { getSchedule } from "api/personal";
import { GetScheduleResponse } from "api/personal/interface";
import ScheduleCard from "./components/ScheduleCard";

export default function PersonalScreen() {
  const [schedules, setSchedules] = useState<GetScheduleResponse[]>();
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

  return (
    <Container component="main" maxWidth="xs">
      <Button
        onClick={handleLogout}
        variant="contained"
        color="primary"
        endIcon={<DeleteIcon />}
      >
        로그아웃
      </Button>
      <Button
        onClick={handleRefresh}
        variant="contained"
        color="primary"
        endIcon={<DeleteIcon />}
      >
        새로고침
      </Button>
      {schedules?.map((schedule) => (
        <ScheduleCard schedule={schedule} />
      ))}
    </Container>
  );
}
