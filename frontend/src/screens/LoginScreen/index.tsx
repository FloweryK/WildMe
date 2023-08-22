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
import { ToastContext } from "common/Toast";
import Header from "./components/Header";
import Copyright from "common/Copyright";
import { LoginStateInterface } from "./interface";

const LOGIN_STATES: { [key in string]: LoginStateInterface } = {
  successSignup: {
    toastText: "회원가입 성공",
    toastSeverity: "success",
    isNameError: false,
    isPasswordError: false,
  },
  successSignin: {
    toastText: "로그인 성공",
    toastSeverity: "success",
    isNameError: false,
    isPasswordError: false,
  },
  invalidName: {
    toastText: "아이디를 확인해주세요!",
    toastSeverity: "error",
    isNameError: true,
    isPasswordError: false,
  },
  invalidPassword: {
    toastText: "비밀번호를 확인해주세요!",
    toastSeverity: "error",
    isNameError: false,
    isPasswordError: true,
  },
  duplicatedName: {
    toastText: "이미 존재하는 아이디에요!",
    toastSeverity: "error",
    isNameError: true,
    isPasswordError: false,
  },
};

const LoginScreen = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const { setToastState } = useContext(ToastContext);
  const [authState, setAuthState] = useState({
    isNameError: false,
    isPasswordError: false,
  });

  const changeState = (state: LoginStateInterface) => {
    setToastState({
      isToastOpen: true,
      toastSeverity: state.toastSeverity,
      toastText: state.toastText,
    });
    setAuthState({
      isNameError: state.isNameError,
      isPasswordError: state.isPasswordError,
    });
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

    // check invalid name or password
    if (name === undefined) {
      changeState(LOGIN_STATES.invalidName);
      return;
    } else if (password === undefined) {
      changeState(LOGIN_STATES.invalidPassword);
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
          changeState(LOGIN_STATES.successSignup);
        })
        .catch((error) => {
          if (error.response.status === 409) {
            changeState(LOGIN_STATES.duplicatedName);
            isDuplicated = true;
          }
        });
    }

    // send signin request if needed
    if (!isDuplicated) {
      await signIn(data)
        .then((response) => {
          changeState(LOGIN_STATES.successSignin);
          setCookie("accessToken", response.Authorization);
        })
        .catch((error) => {
          if (error.response.status === 404) {
            changeState(LOGIN_STATES.invalidName);
          } else if (error.response.status === 401) {
            changeState(LOGIN_STATES.invalidPassword);
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
