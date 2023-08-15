import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { Toast, ToastContext, ToastStateInterface } from "common/Toast";
import AuthScreen from "screens/AuthScreen";
import PersonalScreen from "screens/PersonalScreen";
import { CookiesProvider } from "react-cookie";

function App() {
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
      <Toast
        open={toastState.isToastOpen}
        severity={toastState.toastSeverity}
        text={toastState.toastText}
        handleClose={handleClose}
      />
      <ToastContext.Provider value={{ setToastState }}>
        <CookiesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AuthScreen />} />
              <Route path="/personal" element={<PersonalScreen />} />
            </Routes>
          </BrowserRouter>
        </CookiesProvider>
      </ToastContext.Provider>
    </div>
  );
}

export default App;
