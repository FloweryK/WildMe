import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Avatar, Box, Button, Container, Typography } from "@mui/material";
import { AuthRequest } from "api/interface";
import { signIn, signUp } from "api";
import { defaultTheme } from "screens/common/theme";
import Toast from "./components/Toast";
import Header from "./components/Header";
import InputBox from "./components/InputBox";
import OptionBox from "./components/OptionBox";
import Copyright from "screens/common/copyright";

const States = {
  Default: {
    toastText: "",
    severity: "success",
    isNameError: false,
    isPasswordError: false,
  },
  SuccessSignin: {
    toastText: "로그인 성공",
    severity: "success",
    isNameError: false,
    isPasswordError: false,
  },
  SuccessSignup: {
    toastText: "회원가입 성공",
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // formdata
    const formdata = new FormData(event.currentTarget);

    // auth request
    const name = formdata.get("name");
    const password = formdata.get("password");
    const isSignup = formdata.get("signup");

    if (name === undefined) {
      // empty username
      setAuthState(States.InvalidUser);
      setOpenToast(true);
      return;
    } else if (password === undefined) {
      // empty password
      setAuthState(States.InvalidPassword);
      setOpenToast(true);
      return;
    }

    const data: AuthRequest = {
      name: name!.toString(),
      password: password!.toString(),
    };

    if (isSignup) {
      await signUp(data)
        .then((response) => {
          setAuthState(States.SuccessSignup);
          setOpenToast(true);
        })
        .catch((error) => {
          console.error(error);
          if (error.response.status === 409) {
            // username already exists
            setAuthState(States.DuplicatedUser);
            setOpenToast(true);
          }
        });
    }

    await signIn(data)
      .then((response) => {
        // login successful
        setAuthState(States.SuccessSignin);
        setOpenToast(true);
      })
      .catch((error) => {
        console.error(error);
        if (error.response.status === 404) {
          // username not exist
          setAuthState(States.InvalidUser);
          setOpenToast(true);
        } else if (error.response.status === 401) {
          // invalid password
          setAuthState(States.InvalidPassword);
          setOpenToast(true);
        }
      });
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
          <Header />
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
