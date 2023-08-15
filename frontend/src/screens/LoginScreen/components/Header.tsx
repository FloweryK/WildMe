import { Avatar, Box, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { styled } from "styled-components";

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = () => {
  return (
    <StyledHeader>
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        WildMe
      </Typography>
    </StyledHeader>
  );
};

export default Header;
