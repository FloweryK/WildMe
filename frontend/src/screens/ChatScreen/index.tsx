import React from "react";
import { Box, Container } from "@mui/material";
import ChatMsg from "./components/ChatMsg";
import Header from "./components/Header";

const messages = ["hello", "it's me", "i was wondering if"];

export default function ChatScreen() {
  return (
    <Container component="main" maxWidth="xs">
      <Header />
      <Box>
        <ChatMsg side="left" messages={messages} avatar="" />
        <ChatMsg side="right" messages={messages} avatar="" />
      </Box>
    </Container>
  );
}
