import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container } from "@mui/material";
import { AuthRequest } from "api/login/interface";
import { signIn, signUp } from "api/login";
import { ToastContext } from "common/Toast";
import Header from "./components/Header";
import InputBox from "./components/InputBox";
import OptionBox from "./components/OptionBox";
import Copyright from "common/copyright";

type State =
  | "successSignup"
  | "successSignin"
  | "invalidName"
  | "invalidPassword"
  | "duplicatedName";

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
          }
        });
    }

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
  );
}
