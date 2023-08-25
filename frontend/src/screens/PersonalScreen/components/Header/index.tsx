import { observer } from "mobx-react";
import { Box, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toastStore, tokenStore } from "store";
import { toastStates } from "common/Toast";
import { HeaderProps } from "./interface";

const Header = (props: HeaderProps) => {
  const { onRefresh } = props;

  const handleLogout = () => {
    tokenStore.setAccessToken("");
    toastStore.setToast(toastStates.SUCCESS_LOGOUT);
  };

  return (
    <Box {...props}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={handleLogout} startIcon={<LogoutIcon />}>
          로그아웃
        </Button>
        <Button onClick={onRefresh} startIcon={<RefreshIcon />}>
          새로고침
        </Button>
      </Box>
    </Box>
  );
};

export default observer(Header);
