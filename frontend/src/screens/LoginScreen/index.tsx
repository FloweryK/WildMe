import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { AuthRequest } from "api/login/interface";
import { signIn, signUp } from "api/login";
import { ToastContext, toastStates } from "common/Toast";
import Header from "./components/Header";
import Copyright from "common/Copyright";
import { status } from "common/status";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const { setToastState } = useContext(ToastContext);
  const [authState, setAuthState] = useState({
    isNameError: false,
    isPasswordError: false,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // formdata
    const formdata = new FormData(event.currentTarget);

    // auth request
    const name = formdata.get("name");
    const password = formdata.get("password");
    const isSignup = formdata.get("signup");
    let isDuplicated = false;

    // check invalid name or password
    if (name === undefined) {
      setToastState(toastStates.INVALID_NAME);
      setAuthState({ isNameError: true, isPasswordError: false });
      return;
    } else if (password === undefined) {
      setToastState(toastStates.INVALID_PASSWORD);
      setAuthState({ isNameError: false, isPasswordError: true });
      return;
    }

    // make request data
    const data: AuthRequest = {
      name: name!.toString(),
      password: password!.toString(),
    };

    // send signup request if needed
    if (isSignup) {
      await signUp(data)
        .then((response) => {
          setToastState(toastStates.SUCCESS_SIGNUP);
          setAuthState({ isNameError: false, isPasswordError: false });
        })
        .catch((error) => {
          if (error.response.status === status.CONFLICT) {
            setToastState(toastStates.DUPLICATED_NAME);
            setAuthState({ isNameError: true, isPasswordError: false });
            isDuplicated = true;
          }
        });
    }

    // send signin request if needed
    if (!isDuplicated) {
      await signIn(data)
        .then((response) => {
          setToastState(toastStates.SUCCESS_SIGNIN);
          setAuthState({ isNameError: false, isPasswordError: false });
          setCookie("accessToken", response.Authorization);
        })
        .catch((error) => {
          if (error.response.status === status.NOT_FOUND) {
            setToastState(toastStates.INVALID_NAME);
            setAuthState({ isNameError: true, isPasswordError: false });
          } else if (error.response.status === status.UNAUTUHORIZED) {
            setToastState(toastStates.INVALID_PASSWORD);
            setAuthState({ isNameError: false, isPasswordError: true });
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
                control={
                  <Checkbox
                    id="signup"
                    name="signup"
                    value="signup"
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
                    id="rememberme"
                    name="rememberme"
                    value="remember"
                    color="primary"
                  />
                }
                label="로그인 기억하기"
              />
            </Grid>
          </Grid>
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
  );
};

export default LoginScreen;
