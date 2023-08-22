export interface ToastProps {
  open: boolean;
  severity: any;
  text: string;
  handleClose?: any;
}

export interface ToastContextInterface {
  setToastState: React.Dispatch<React.SetStateAction<ToastProps>>;
}
