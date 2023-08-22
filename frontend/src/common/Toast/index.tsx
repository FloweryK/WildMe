import { createContext } from "react";
import { Alert, Snackbar } from "@mui/material";
import { ToastContextInterface, ToastProps } from "./interface";

export const ToastContext = createContext<ToastContextInterface>(
  {} as ToastContextInterface
);

export const Toast = ({ open, severity, text, handleClose }: ToastProps) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {text}
      </Alert>
    </Snackbar>
  );
};

export const toastStates = {
  SUCCESS_SIGNUP: {
    open: true,
    text: "회원가입 성공",
    severity: "success",
  },
  SUCCESS_SIGNIN: {
    open: true,
    text: "로그인 성공",
    severity: "success",
  },
  SUCCESS_LOGOUT: {
    open: true,
    text: "로그아웃 완료",
    severity: "success",
  },
  SUCCESS_REFRESH: {
    open: true,
    text: "새로고침 완료",
    severity: "success",
  },
  INVALID_NAME: {
    open: true,
    text: "아이디를 확인해주세요!",
    severity: "error",
  },
  INVALID_PASSWORD: {
    open: true,
    text: "비밀번호를 확인해주세요!",
    severity: "error",
  },
  DUPLICATED_NAME: {
    open: true,
    text: "이미 존재하는 아이디에요!",
    severity: "error",
  },
};
