export interface ToastProps {
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
