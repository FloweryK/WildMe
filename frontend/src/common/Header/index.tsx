import { observer } from "mobx-react";
import { AppBar, Box, Container, IconButton, Toolbar } from "@mui/material";
import Logo from "common/Logo";
import { HeaderProps } from "./interface";

const Header = (props: HeaderProps) => {
  const { startIcon, endIcon, onClickStartIcon, onClickEndIcon } = props;

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 8, zIndex: 1000 }}>
      <AppBar position="fixed">
        <Container maxWidth="xs">
          <Toolbar variant="dense" sx={{ justifyContent: "space-between" }}>
            <IconButton color="inherit" onClick={onClickStartIcon}>
              {startIcon}
            </IconButton>
            <Logo />
            <IconButton color="inherit" onClick={onClickEndIcon}>
              {endIcon}
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default observer(Header);
