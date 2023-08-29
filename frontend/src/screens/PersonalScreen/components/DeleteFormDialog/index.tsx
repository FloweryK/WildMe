import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { deleteAccount } from "api/personal";
import { toastStates } from "common/Toast";
import { observer } from "mobx-react";
import { cookie, toastStore } from "store";

interface DeleteFormProps {
  open: boolean;
  handleClose: any;
}

const DeleteFormDialog = (props: DeleteFormProps) => {
  const { open, handleClose } = props;

  const handleYes = () => {
    deleteAccount();
    cookie.set("accessToken", "");
    toastStore.setToast(toastStates.SUCCESS_QUIT);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>회원 탈퇴</DialogTitle>
      <DialogContent>계정과 학습 내역을 모두 삭제하시겠습니까?</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          아니요!
        </Button>
        <Button onClick={handleYes} color="primary" autoFocus>
          네...
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(DeleteFormDialog);
