import React, { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { observer } from "mobx-react";
import { Box, Container, TextField } from "@mui/material";
import { chatStore } from "store";
import { getChat } from "api/inference";
import { ChatRequest } from "api/inference/interface";
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
    messages: ["대화를 입력해보세요 :)"],
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
      setChatMsgs((prevChatMsgs) => [...prevChatMsgs, newChatMsg]);

      // make data
      const request: ChatRequest = {
        tag: chatStore.tag,
        text: inputValue,
      };

      // send chat request
      getChat(request).then((response) => {
        const newChatMsg = {
          avatar: "",
          side: "left" as const,
          messages: [response.message],
        };

        setChatMsgs((prevChatMsgs) => [...prevChatMsgs, newChatMsg]);
      });
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

export default observer(ChatScreen);
