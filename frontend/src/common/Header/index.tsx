import { observer } from "mobx-react";
import { AppBar, Box, Container, Grid, IconButton } from "@mui/material";
import Logo from "common/Logo";
import { HeaderProps } from "./interface";
import { styled } from "styled-components";

const StyledHeader = styled.div`
  .headerGrid {
    display: flex;
    align-items: center;
  }
  .left {
    justify-content: flex-start;
  }
  .center {
    justify-content: center;
  }
  .right {
    justify-content: flex-end;
  }
`;

const Header = (props: HeaderProps) => {
  const { startIcon, endIcon, onClickStartIcon, onClickEndIcon } = props;

  return (
    <StyledHeader>
      <Box sx={{ flexGrow: 1, marginBottom: 8, zIndex: 1000 }}>
        <AppBar position="fixed">
          <Container maxWidth="xs">
            <Grid container>
              <Grid item xs={4} className="headerGrid left">
                <IconButton color="inherit" onClick={onClickStartIcon}>
                  {startIcon}
                </IconButton>
              </Grid>
              <Grid item xs={4} className="headerGrid center">
                <Logo />
              </Grid>
              <Grid item xs={4} className="headerGrid right">
                <IconButton color="inherit" onClick={onClickEndIcon}>
                  {endIcon}
                </IconButton>
              </Grid>
            </Grid>
          </Container>
        </AppBar>
      </Box>
    </StyledHeader>
  );
};

export default observer(Header);
