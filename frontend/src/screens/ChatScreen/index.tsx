import React, { useRef, useState } from "react";
import { Box, Container, TextField } from "@mui/material";
import ChatMsg, { ChatMsgInterface } from "./components/ChatMsg";
import Header from "./components/Header";

const tmpChatMsgs: ChatMsgInterface[] = [
  {
    avatar: "",
    side: "left",
    messages: [
      "hello from the otherside",
      "at least i can say that ive tried.",
      "and tell you im sorry for breaking your heart",
    ],
  },
  {
    avatar: "",
    side: "right",
    messages: ["wtf man"],
  },
];

export default function ChatScreen() {
  const [inputValue, setInputValue] = useState<string>("");
  const [chatMsgs, setChatMsgs] = useState<ChatMsgInterface[]>(tmpChatMsgs);
  const messagesRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      const newChatMsg = {
        avatar: "",
        side: "right" as const,
        messages: [inputValue],
      };
      setChatMsgs([...chatMsgs, newChatMsg]);
      setInputValue("");
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Header />
      <Box sx={{ height: 400, overflow: "auto" }} ref={messagesRef}>
        {chatMsgs?.map(({ avatar, side, messages }, i) => (
          <ChatMsg avatar={avatar} side={side} messages={messages} />
        ))}
      </Box>
      <TextField
        className="textfield"
        label="대화를 입력하세요"
        variant="outlined"
        // multiline
        fullWidth
        size="small"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleSubmit}
        InputProps={{
          style: {
            maxHeight: "100%",
            overflow: "hidden",
          },
        }}
      />
    </Container>
  );
}
