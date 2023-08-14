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
        label={isNameError ? "없는 아이디에요 ;ㅅ;) " : "아이디"}
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
        label={isPasswordError ? "비밀번호를 확인해주세요 ;ㅅ;) " : "비밀번호"}
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
