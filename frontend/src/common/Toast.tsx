import { createContext } from "react";
import { Alert, Snackbar } from "@mui/material";

interface ToastProps {
  open: boolean;
  severity: any;
  text: string;
  handleClose: any;
}

export interface ToastStateInterface {
  isToastOpen: boolean;
  toastSeverity: string;
  toastText: string;
}

export interface ToastContextInterface {
  setToastState: React.Dispatch<React.SetStateAction<ToastStateInterface>>;
}

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
