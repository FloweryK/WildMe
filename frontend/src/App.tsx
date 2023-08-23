import React, { createContext, useState } from "react";
import { observer } from "mobx-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { toastStore } from "store";
import { Toast } from "common/Toast";
import { AuthProvider, AuthWrapper } from "common/auth";
import ErrorBoundary from "common/ErrorBoundary";
import LoginScreen from "screens/LoginScreen";
import PersonalScreen from "screens/PersonalScreen";
import ChatScreen from "screens/ChatScreen";

const App = () => {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      toastStore.setOpen(false);
      return;
    }
    toastStore.setOpen(false);
  };

  return (
    <div className="App">
      <CssBaseline />
      <ErrorBoundary>
        <Toast
          open={toastStore.open}
          severity={toastStore.severity}
          text={toastStore.text}
          handleClose={handleClose}
        />
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
      </ErrorBoundary>
    </div>
  );
};

export default observer(App);
