import { useEffect } from "react";
import { Box, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toastStates } from "common/Toast";
import { HeaderProps } from "./interface";
import { toastStore, tokenStore } from "store";
import { observer } from "mobx-react";

const Header = (props: HeaderProps) => {
  const { onRefresh } = props;

  const handleLogout = () => {
    tokenStore.setAccessToken("");
    toastStore.setToast(toastStates.SUCCESS_LOGOUT);
  };

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <Box>
      <Button onClick={handleLogout} color="primary" startIcon={<LogoutIcon />}>
        로그아웃
      </Button>
      <Button onClick={onRefresh} color="primary" startIcon={<RefreshIcon />}>
        새로고침
      </Button>
    </Box>
  );
};

export default observer(Header);
