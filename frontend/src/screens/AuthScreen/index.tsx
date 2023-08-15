import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Button, Container } from "@mui/material";
import { AuthRequest } from "api/interface";
import { signIn, signUp } from "api";
import { defaultTheme } from "common/theme";
import { ToastContext } from "common/Toast";
import Header from "./components/Header";
import InputBox from "./components/InputBox";
import OptionBox from "./components/OptionBox";
import Copyright from "common/copyright";

export default function AuthScreen() {
  const navigate = useNavigate();
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

    if (name === undefined) {
      // empty username
      setToastState({
        isToastOpen: true,
        toastSeverity: "error",
        toastText: "아이디를 확인해주세요!",
      });
      setAuthState({
        isNameError: true,
        isPasswordError: false,
      });
      return;
    } else if (password === undefined) {
      // empty password
      setToastState({
        isToastOpen: true,
        toastSeverity: "error",
        toastText: "비밀번호를 확인해주세요!",
      });
      setAuthState({
        isNameError: false,
        isPasswordError: true,
      });
      return;
    }

    const data: AuthRequest = {
      name: name!.toString(),
      password: password!.toString(),
    };

    if (isSignup) {
      await signUp(data)
        .then((response) => {
          setToastState({
            isToastOpen: true,
            toastSeverity: "success",
            toastText: "회원가입 성공",
          });
          setAuthState({
            isNameError: false,
            isPasswordError: false,
          });
        })
        .catch((error) => {
          console.error(error);
          if (error.response.status === 409) {
            // username already exists
            setToastState({
              isToastOpen: true,
              toastSeverity: "error",
              toastText: "이미 존재하는 아이디에요!",
            });
            setAuthState({
              isNameError: true,
              isPasswordError: false,
            });
          }
        });
    }

    await signIn(data)
      .then((response) => {
        // login successful
        setToastState({
          isToastOpen: true,
          toastSeverity: "success",
          toastText: "로그인 성공",
        });
        setAuthState({
          isNameError: false,
          isPasswordError: false,
        });

        // move to personal page
        navigate("/personal");
      })
      .catch((error) => {
        console.error(error);
        if (error.response.status === 404) {
          // username not exist
          setToastState({
            isToastOpen: true,
            toastSeverity: "error",
            toastText: "아이디를 확인해주세요!",
          });
          setAuthState({
            isNameError: true,
            isPasswordError: false,
          });
        } else if (error.response.status === 401) {
          // invalid password
          setToastState({
            isToastOpen: true,
            toastSeverity: "error",
            toastText: "비밀번호를 확인해주세요!",
          });
          setAuthState({
            isNameError: false,
            isPasswordError: true,
          });
        }
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
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
