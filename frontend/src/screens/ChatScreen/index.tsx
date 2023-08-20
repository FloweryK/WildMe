import React from "react";
import { Box, Button, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import ChatMsg from "./components/ChatMsg";

const messages = ["hello", "it's me"];

export default function ChatScreen() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/auth/personal");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Button onClick={handleGoBack} color="primary" startIcon={<ArrowBackIcon />}>
        뒤로가기
      </Button>
      <Box>
        <ChatMsg side="left" messages={messages} avatar="" />
        <ChatMsg side="right" messages={messages} avatar="" />
      </Box>
    </Container>
  );
}
