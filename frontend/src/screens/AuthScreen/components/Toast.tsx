import { Alert, Snackbar } from "@mui/material";

interface ToastProps {
  open: boolean;
  severity: any;
  text: string;
  handleClose: any;
}

const Toast = ({ open, severity, text, handleClose }: ToastProps) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {text}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
