import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { CssBaseline } from "@mui/material";
import { Toast, ToastContext, ToastStateInterface } from "common/Toast";
import PersonalScreen from "screens/PersonalScreen";
import LoginScreen from "screens/LoginScreen";
import { AuthProvider, AuthWrapper } from "common/auth";
import ErrorBoundary from "common/ErrorBoundary";

function App() {
  const [toastState, setToastState] = useState<ToastStateInterface>({
    isToastOpen: false,
    toastSeverity: "success",
    toastText: "",
  });

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
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
                  </Route>
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </CookiesProvider>
        </ToastContext.Provider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
