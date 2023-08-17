import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Box, Button, Checkbox, Container, FormControlLabel, Grid, TextField } from "@mui/material";
import { AuthRequest } from "api/login/interface";
import { signIn, signUp } from "api/login";
import { ToastContext } from "common/Toast";
import Header from "./components/Header";
import Copyright from "common/copyright";

type State = "successSignup" | "successSignin" | "invalidName" | "invalidPassword" | "duplicatedName";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const { setToastState } = useContext(ToastContext);
  const [authState, setAuthState] = useState({
    isNameError: false,
    isPasswordError: false,
  });

  const handleState = (state: State) => {
    switch (state) {
      case "successSignup":
        setToastState({
          isToastOpen: true,
          toastSeverity: "success",
          toastText: "회원가입 성공",
        });
        setAuthState({
          isNameError: false,
          isPasswordError: false,
        });
        break;
      case "successSignin":
        setToastState({
          isToastOpen: true,
          toastSeverity: "success",
          toastText: "로그인 성공",
        });
        setAuthState({
          isNameError: false,
          isPasswordError: false,
        });
        break;
      case "invalidName":
        setToastState({
          isToastOpen: true,
          toastSeverity: "error",
          toastText: "아이디를 확인해주세요!",
        });
        setAuthState({
          isNameError: true,
          isPasswordError: false,
        });
        break;
      case "invalidPassword":
        setToastState({
          isToastOpen: true,
          toastSeverity: "error",
          toastText: "비밀번호를 확인해주세요!",
        });
        setAuthState({
          isNameError: false,
          isPasswordError: true,
        });
        break;
      case "duplicatedName":
        setToastState({
          isToastOpen: true,
          toastSeverity: "error",
          toastText: "이미 존재하는 아이디에요!",
        });
        setAuthState({
          isNameError: true,
          isPasswordError: false,
        });
        break;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // formdata
    const formdata = new FormData(event.currentTarget);

    // auth request
    const name = formdata.get("name");
    const password = formdata.get("password");
    const isSignup = formdata.get("signup");
    let isDuplicated = false;

    if (name === undefined) {
      handleState("invalidName");
      return;
    } else if (password === undefined) {
      handleState("invalidPassword");
      return;
    }

    const data: AuthRequest = {
      name: name!.toString(),
      password: password!.toString(),
    };

    if (isSignup) {
      await signUp(data)
        .then((response) => {
          handleState("successSignup");
        })
        .catch((error) => {
          console.error(error);
          if (error.response.status === 409) {
            handleState("duplicatedName");
            isDuplicated = true;
          }
        });
    }

    if (!isDuplicated) {
      await signIn(data)
        .then((response) => {
          handleState("successSignin");
          setCookie("accessToken", response.Authorization);
        })
        .catch((error) => {
          console.error(error);
          if (error.response.status === 404) {
            handleState("invalidName");
          } else if (error.response.status === 401) {
            handleState("invalidPassword");
          }
        });
    }
  };

  useEffect(() => {
    if (cookies.accessToken) {
      navigate("/auth/personal");
    }
  }, [cookies.accessToken]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Header />
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Box>
            <TextField
              id="name"
              name="name"
              label="아이디"
              required
              fullWidth
              autoFocus
              autoComplete="name"
              error={authState.isNameError}
              margin="normal"
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="비밀번호"
              required
              autoComplete="current-password"
              error={authState.isPasswordError}
              margin="normal"
              fullWidth
            />
          </Box>
          <Grid container>
            <Grid item xs>
              <FormControlLabel
                control={<Checkbox id="signup" name="signup" value="signup" color="primary" />}
                label="가입하고 로그인하기"
              />
            </Grid>
            <Grid>
              <FormControlLabel
                control={<Checkbox id="rememberme" name="rememberme" value="remember" color="primary" />}
                label="로그인 기억하기"
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            로그인
          </Button>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
