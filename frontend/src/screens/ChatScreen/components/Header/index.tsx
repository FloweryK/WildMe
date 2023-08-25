import { useNavigate } from "react-router-dom";
import { AppBar, Box, Container, IconButton, Toolbar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import Logo from "common/Logo";
import { HeaderProps } from "./interface";

const Header = (props: HeaderProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/auth/personal");
  };

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 8, zIndex: 1000 }}>
      <AppBar position="fixed">
        <Container maxWidth="xs">
          <Toolbar variant="dense" sx={{ justifyContent: "space-between" }}>
            <IconButton color="inherit" onClick={handleGoBack}>
              <ArrowBackIcon />
            </IconButton>
            <Logo />
            <IconButton sx={{ opacity: 0 }}>
              <RefreshIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Header;
