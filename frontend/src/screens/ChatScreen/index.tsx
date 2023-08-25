import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import SendIcon from "@mui/icons-material/Send";
import { chatStore } from "store";
import { getChat } from "api/inference";
import Header from "common/Header";
import { ChatRequest } from "api/inference/interface";
import ChatMsg from "./components/ChatMsg";
import { ChatMsgInterface } from "./components/ChatMsg/interface";

const tmpChatMsgs: ChatMsgInterface[] = [
  {
    avatar: "",
    side: "left",
    messages: ["대화를 입력해보세요 :)"],
  },
];

const ChatScreen = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState<string>("");
  const [chatMsgs, setChatMsgs] = useState<ChatMsgInterface[]>(tmpChatMsgs);
  const messagesRef = useRef<HTMLDivElement>(null);
  const textFieldRef = useRef<HTMLInputElement | null>(null);

  const handleGoBack = () => {
    navigate("/auth/personal");
  };

  const handleRefresh = () => {
    setChatMsgs(tmpChatMsgs);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    if (!!inputValue) {
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

      // focus on textfield
      textFieldRef.current?.blur();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !!inputValue) {
      handleSubmit();
    }
  };

  useEffect(() => {
    setInputValue("");

    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [chatMsgs]);

  return (
    <Grid container>
      <Container maxWidth="xs">
        <Header
          startIcon={<ArrowBackIcon />}
          onClickStartIcon={handleGoBack}
          endIcon={<RefreshIcon />}
          onClickEndIcon={handleRefresh}
        />
        <Box ref={messagesRef} sx={{ height: "70vh", overflow: "auto" }}>
          {chatMsgs?.map(({ avatar, side, messages }, i) => (
            <ChatMsg avatar={avatar} side={side} messages={messages} />
          ))}
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={10.5}>
            <TextField
              inputRef={textFieldRef}
              label="대화를 입력하세요"
              variant="outlined"
              // multiline
              fullWidth
              // autoFocus
              size="small"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              InputProps={{
                style: {
                  maxHeight: "100%",
                  overflow: "hidden",
                },
              }}
            />
          </Grid>
          <Grid item xs={0.5}>
            <IconButton color="primary" onClick={handleSubmit}>
              <SendIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
};

export default observer(ChatScreen);
