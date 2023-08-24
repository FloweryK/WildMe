import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Header = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/auth/personal");
  };

  return (
    <Box>
      <Button
        onClick={handleGoBack}
        color="primary"
        startIcon={<ArrowBackIcon />}
      >
        뒤로가기
      </Button>
    </Box>
  );
};

export default Header;
