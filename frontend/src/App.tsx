import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { CssBaseline } from "@mui/material";
import { AuthProvider, AuthWrapper } from "common/auth";
import { Toast, ToastContext } from "common/Toast";
import { ToastStateInterface } from "common/Toast/interface";
import ErrorBoundary from "common/ErrorBoundary";
import LoginScreen from "screens/LoginScreen";
import PersonalScreen from "screens/PersonalScreen";
import ChatScreen from "screens/ChatScreen";

const App = () => {
  const [toastState, setToastState] = useState<ToastStateInterface>({
    isToastOpen: false,
    toastSeverity: "success",
    toastText: "",
  });

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setToastState({ ...toastState, isToastOpen: false });
  };

  return (
    <div className="App">
      <CssBaseline />
      <ErrorBoundary>
        <Toast
          open={toastState.isToastOpen}
          severity={toastState.toastSeverity}
          text={toastState.toastText}
          handleClose={handleClose}
        />
        <ToastContext.Provider value={{ setToastState }}>
          <CookiesProvider>
            <AuthProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<LoginScreen />} />
                  <Route path="/auth" element={<AuthWrapper />}>
                    <Route path="personal" element={<PersonalScreen />} />
                    <Route path="chat" element={<ChatScreen />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </CookiesProvider>
        </ToastContext.Provider>
      </ErrorBoundary>
    </div>
  );
};

export default App;
