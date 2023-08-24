import React from "react";
import { observer } from "mobx-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline } from "@mui/material";
import { toastStore } from "store";
import { Toast } from "common/Toast";
import ErrorBoundary from "common/ErrorBoundary";
import Screens from "screens";

const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>
          <Toast
            open={toastStore.open}
            severity={toastStore.severity}
            text={toastStore.text}
            handleClose={handleClose}
          />
          <Screens />
        </QueryClientProvider>
      </ErrorBoundary>
    </div>
  );
};

export default observer(App);
