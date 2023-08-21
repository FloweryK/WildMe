import React, { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { Box, Container, TextField } from "@mui/material";
import Header from "./components/Header";
import ChatMsg from "./components/ChatMsg";
import { ChatMsgInterface } from "./components/ChatMsg/interface";

const StyledChatScreen = styled.div`
  .header {
  }
  .chat {
    height: 500px;
    overflow: auto;
  }
  .textfield {
    padding-right: 10px;
  }
`;

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

const ChatScreen = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [chatMsgs, setChatMsgs] = useState<ChatMsgInterface[]>(tmpChatMsgs);
  const messagesRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && inputValue) {
      const newChatMsg = {
        avatar: "",
        side: "right" as const,
        messages: [inputValue],
      };
      setChatMsgs([...chatMsgs, newChatMsg]);
    }
  };

  useEffect(() => {
    setInputValue("");

    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [chatMsgs]);

  return (
    <StyledChatScreen>
      <Container component="main" maxWidth="xs">
        <Header />
        <Box className="chat" ref={messagesRef}>
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
    </StyledChatScreen>
  );
};

export default ChatScreen;
