import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { HeaderProps } from "./interface";

const Header = (props: HeaderProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/auth/personal");
  };

  return (
    <Box {...props}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={handleGoBack}
          color="primary"
          startIcon={<ArrowBackIcon />}
        >
          뒤로가기
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
