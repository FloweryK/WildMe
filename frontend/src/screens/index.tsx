import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";
import { AuthProvider, AuthWrapper } from "common/auth";
import LoginScreen from "./LoginScreen";
import PersonalScreen from "./PersonalScreen";
import ChatScreen from "./ChatScreen";

const Screens = () => {
  return (
    <AuthProvider>
      <Container sx={{ height: "100vh" }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/auth" element={<AuthWrapper />}>
              <Route path="personal" element={<PersonalScreen />} />
              <Route path="chat" element={<ChatScreen />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Container>
    </AuthProvider>
  );
};

export default Screens;
