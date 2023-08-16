import React, { useContext } from "react";
import { useCookies } from "react-cookie";
import { Button, Container } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContext } from "common/Toast";

export default function PersonalScreen() {
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
    </Container>
  );
}
