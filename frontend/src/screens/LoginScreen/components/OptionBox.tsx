import React from "react";
import { Checkbox, FormControlLabel, Grid } from "@mui/material";

const OptionBox = () => {
  return (
    <Grid container>
      <Grid item xs>
        <FormControlLabel
          control={
            <Checkbox
              value="signup"
              id="signup"
              name="signup"
              color="primary"
            />
          }
          label="가입하고 로그인하기"
        />
      </Grid>
      <Grid>
        <FormControlLabel
          control={
            <Checkbox
              value="remember"
              id="rememberme"
              name="rememberme"
              color="primary"
            />
          }
          label="로그인 기억하기"
        />
      </Grid>
    </Grid>
  );
};

export default OptionBox;
