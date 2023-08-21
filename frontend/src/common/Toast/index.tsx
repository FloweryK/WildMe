import { createContext } from "react";
import { Alert, Snackbar } from "@mui/material";
import { ToastContextInterface, ToastProps } from "./interface";

export const ToastContext = createContext<ToastContextInterface>({} as ToastContextInterface);

export const Toast = ({ open, severity, text, handleClose }: ToastProps) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {text}
      </Alert>
    </Snackbar>
  );
};
