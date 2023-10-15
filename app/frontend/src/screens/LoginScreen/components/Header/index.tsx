import { Avatar, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { styled } from "styled-components";
import Logo from "common/Logo";

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = () => {
  return (
    <StyledHeader>
      <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Logo sx={{ fontSize: 30 }} />
    </StyledHeader>
  );
};

export default Header;
