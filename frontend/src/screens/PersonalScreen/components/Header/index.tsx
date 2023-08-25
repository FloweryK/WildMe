import { observer } from "mobx-react";
import { AppBar, Box, Container, IconButton, Toolbar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toastStore, tokenStore } from "store";
import { toastStates } from "common/Toast";
import { HeaderProps } from "./interface";
import Logo from "common/Logo";

const Header = (props: HeaderProps) => {
  const { onRefresh } = props;

  const handleLogout = () => {
    tokenStore.setAccessToken("");
    toastStore.setToast(toastStates.SUCCESS_LOGOUT);
  };
  return (
    <Box sx={{ flexGrow: 1, marginBottom: 8, zIndex: 1000 }}>
      <AppBar position="fixed">
        <Container maxWidth="xs">
          <Toolbar variant="dense" sx={{ justifyContent: "space-between" }}>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
            <Logo />
            <IconButton color="inherit" onClick={onRefresh}>
              <RefreshIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default observer(Header);
