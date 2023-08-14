import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Button, Container } from "@mui/material";
import { AuthRequest } from "api/interface";
import { signIn, signUp } from "api";
import { defaultTheme } from "screens/common/theme";
import Header from "./components/Header";
import InputBox from "./components/InputBox";
import OptionBox from "./components/OptionBox";
import Copyright from "screens/common/copyright";

export default function AuthScreen() {
  const [isNameError, setNameError] = useState<boolean>(false);
  const [isPasswordError, setPasswordError] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // formdata
    const formdata = new FormData(event.currentTarget);

    // auth request
    const data: AuthRequest = {
      name: formdata.get("name")!.toString(),
      password: formdata.get("password")!.toString(),
    };

    if (formdata.get("signup")) {
      signUp(data)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      signIn(data)
        .then((response) => {
          setNameError(false);
          setPasswordError(false);
        })
        .catch((error) => {
          console.error(error);
          if (error.response.status === 404) {
            setNameError(true);
            setPasswordError(false);
          } else if (error.response.status === 401) {
            setNameError(false);
            setPasswordError(true);
          }
        });
    }
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
              isNameError={isNameError}
              isPasswordError={isPasswordError}
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
