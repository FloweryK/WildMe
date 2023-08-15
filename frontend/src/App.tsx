import React from "react";
import { CssBaseline } from "@mui/material";
import AuthScreen from "screens/AuthScreen";
import PersonalScreen from "screens/PersonalScreen";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthScreen />} />
          <Route path="/personal" element={<PersonalScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
