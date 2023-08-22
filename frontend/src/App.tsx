import React, { createContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { CssBaseline } from "@mui/material";
import { AuthProvider, AuthWrapper } from "common/auth";
import { Toast, ToastContext } from "common/Toast";
import { ToastProps } from "common/Toast/interface";
import ErrorBoundary from "common/ErrorBoundary";
import LoginScreen from "screens/LoginScreen";
import PersonalScreen from "screens/PersonalScreen";
import ChatScreen from "screens/ChatScreen";

export const ChatContext = createContext<any>(undefined);

const App = () => {
  // tmp context for tag
  const [tag, setTag] = useState<string>("");

  const [toastState, setToastState] = useState<ToastProps>({
    open: false,
    severity: "success",
    text: "",
  });

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      setToastState({ ...toastState, open: false });
      return;
    }
    setToastState({ ...toastState, open: false });
  };

  return (
    <div className="App">
      <CssBaseline />
      <ErrorBoundary>
        <Toast
          open={toastState.open}
          severity={toastState.severity}
          text={toastState.text}
          handleClose={handleClose}
        />
        <ToastContext.Provider value={{ setToastState }}>
          <CookiesProvider>
            <AuthProvider>
              <BrowserRouter>
                <ChatContext.Provider value={{ tag, setTag }}>
                  <Routes>
                    <Route path="/" element={<LoginScreen />} />
                    <Route path="/auth" element={<AuthWrapper />}>
                      <Route path="personal" element={<PersonalScreen />} />
                      <Route path="chat" element={<ChatScreen />} />
                    </Route>
                  </Routes>
                </ChatContext.Provider>
              </BrowserRouter>
            </AuthProvider>
          </CookiesProvider>
        </ToastContext.Provider>
      </ErrorBoundary>
    </div>
  );
};

export default App;
