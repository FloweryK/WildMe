import React, { useEffect } from "react";
import { observer } from "mobx-react";
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
import { authStore, toastStore, tokenStore } from "store";
import { SignRequest } from "api/login/interface";
import { signIn, signUp } from "api/login";
import { toastStates } from "common/Toast";
import Copyright from "common/Copyright";
import { status } from "common/status";
import Header from "./components/Header";

const LoginScreen = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // formdata
    const formdata = new FormData(event.currentTarget);

    // auth request
    const name = formdata.get("name");
    const password = formdata.get("password");
    const isSignup = formdata.get("signup");

    // check invalid name or password
    if (name === undefined) {
      toastStore.setToast(toastStates.INVALID_NAME);
      authStore.setInputState({
        isNameError: true,
        isPasswordError: false,
        isDuplicated: false,
      });
      return;
    } else if (password === undefined) {
      toastStore.setToast(toastStates.INVALID_PASSWORD);
      authStore.setInputState({
        isNameError: false,
        isPasswordError: true,
        isDuplicated: false,
      });
      return;
    }

    // make request data
    const request: SignRequest = {
      name: name!.toString(),
      password: password!.toString(),
    };

    // send signup request if needed
    if (isSignup) {
      await signUp(request)
        .then((data) => {
          toastStore.setToast(toastStates.SUCCESS_SIGNUP);
          authStore.setInputState({
            isNameError: false,
            isPasswordError: false,
            isDuplicated: false,
          });
        })
        .catch((error) => {
          if (error.response?.status === status.CONFLICT) {
            toastStore.setToast(toastStates.DUPLICATED_NAME);
            authStore.setInputState({
              isNameError: true,
              isPasswordError: false,
              isDuplicated: true,
            });
          }
        });
    } else {
      authStore.setInputState({
        isNameError: false,
        isPasswordError: false,
        isDuplicated: false,
      });
    }

    // send signin request if needed
    if (!authStore.isDuplicated) {
      await signIn(request)
        .then((data) => {
          toastStore.setToast(toastStates.SUCCESS_SIGNIN);
          authStore.setInputState({
            isNameError: false,
            isPasswordError: false,
            isDuplicated: false,
          });
          tokenStore.setAccessToken(data.Authorization);
        })
        .catch((error) => {
          if (error.response?.status === status.NOT_FOUND) {
            toastStore.setToast(toastStates.INVALID_NAME);
            authStore.setInputState({
              isNameError: true,
              isPasswordError: false,
              isDuplicated: false,
            });
          } else if (error.response?.status === status.UNAUTUHORIZED) {
            toastStore.setToast(toastStates.INVALID_PASSWORD);
            authStore.setInputState({
              isNameError: false,
              isPasswordError: true,
              isDuplicated: false,
            });
          }
        });
    }
  };

  useEffect(() => {
    if (tokenStore.accessToken) {
      navigate("/auth/personal");
    }
  }, [tokenStore.accessToken]);

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
              error={authStore.isNameError}
              margin="normal"
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="비밀번호"
              required
              autoComplete="current-password"
              error={authStore.isPasswordError}
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

export default observer(LoginScreen);
