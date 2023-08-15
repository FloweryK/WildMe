import React from "react";
import { CssBaseline } from "@mui/material";
import AuthScreen from "screens/AuthScreen";
import PersonalScreen from "screens/PersonalScreen";

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <AuthScreen />
    </div>
  );
}

export default App;
