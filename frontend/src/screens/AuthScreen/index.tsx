import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Avatar, Box, Button, Container, Typography } from "@mui/material";
import { AuthRequest } from "api/interface";
import { signIn, signUp } from "api";
import { defaultTheme } from "screens/common/theme";
import InputBox from "./components/InputBox";
import OptionBox from "./components/OptionBox";
import Copyright from "screens/common/copyright";
import Toast from "./components/Toast";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const States = {
  Default: {
    toastText: "",
    severity: "success",
    isNameError: false,
    isPasswordError: false,
  },
  Success: {
    toastText: "로그인 성공",
    severity: "success",
    isNameError: false,
    isPasswordError: false,
  },
  InvalidUser: {
    toastText: "아이디를 확인해주세요!",
    severity: "error",
    isNameError: true,
    isPasswordError: false,
  },
  DuplicatedUser: {
    toastText: "이미 존재하는 아이디에요!",
    severity: "error",
    isNameError: true,
    isPasswordError: false,
  },
  InvalidPassword: {
    toastText: "비밀번호를 확인해주세요!",
    severity: "error",
    isNameError: false,
    isPasswordError: true,
  },
};

export default function AuthScreen() {
  const [isOpenToast, setOpenToast] = useState(false);
  const [authState, setAuthState] = useState(States.Default);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenToast(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // formdata
    const formdata = new FormData(event.currentTarget);

    // auth request
    const name = formdata.get("name");
    const password = formdata.get("password");
    const isSignup = formdata.get("signup");

    if (name === undefined) {
      setAuthState(States.InvalidUser);
      setOpenToast(true);
    } else if (password === undefined) {
      setAuthState(States.InvalidPassword);
      setOpenToast(true);
    } else {
      const data: AuthRequest = {
        name: name!.toString(),
        password: password!.toString(),
      };

      if (isSignup) {
        signUp(data)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.error(error);
            if (error.response.status === 409) {
              setAuthState(States.DuplicatedUser);
              setOpenToast(true);
            }
          });
      } else {
        signIn(data)
          .then((response) => {
            setAuthState(States.Success);
            setOpenToast(true);
          })
          .catch((error) => {
            console.error(error);
            if (error.response.status === 404) {
              setAuthState(States.InvalidUser);
              setOpenToast(true);
            } else if (error.response.status === 401) {
              setAuthState(States.InvalidPassword);
              setOpenToast(true);
            }
          });
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <Toast
          open={isOpenToast}
          severity={authState.severity}
          text={authState.toastText}
          handleClose={handleClose}
        />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            WildMe
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <InputBox
              isNameError={authState.isNameError}
              isPasswordError={authState.isPasswordError}
            />
            <OptionBox />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              로그인
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
