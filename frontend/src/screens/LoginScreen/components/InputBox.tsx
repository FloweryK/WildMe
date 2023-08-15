import React from "react";
import { Box, TextField } from "@mui/material";

interface InputBoxProps {
  isNameError: boolean;
  isPasswordError: boolean;
}

const InputBox = ({ isNameError, isPasswordError }: InputBoxProps) => {
  return (
    <Box>
      <TextField
        margin="normal"
        required
        fullWidth
        label="아이디"
        id="name"
        name="name"
        autoComplete="name"
        autoFocus
        error={isNameError}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="비밀번호"
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        error={isPasswordError}
      />
    </Box>
  );
};

export default InputBox;
