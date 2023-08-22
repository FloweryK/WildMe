import { useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Box, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import { ToastContext, toastStates } from "common/Toast";
import { HeaderProps } from "./interface";

const Header = (props: HeaderProps) => {
  const { onRefresh } = props;
  const { setToastState } = useContext(ToastContext);
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

  const handleLogout = () => {
    removeCookie("accessToken");
    setToastState(toastStates.SUCCESS_LOGOUT);
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

export default Header;
