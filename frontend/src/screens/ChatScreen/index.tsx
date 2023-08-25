import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
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
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !!inputValue) {
      handleSubmit();

      // blur textfield
      // textFieldRef.current?.blur();
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
        <Box ref={messagesRef} sx={{ height: "80vh", overflow: "auto" }}>
          {chatMsgs?.map(({ avatar, side, messages }, i) => (
            <ChatMsg
              key={`${side}-${i}`}
              avatar={avatar}
              side={side}
              messages={messages}
            />
          ))}
        </Box>
        <AppBar
          color="primary"
          elevation={0}
          position="fixed"
          sx={{ top: "auto", bottom: 0, backgroundColor: "white" }}
        >
          <Container
            maxWidth="xs"
            sx={{
              paddingBottom: 2,
              paddingTop: 1,
              display: "flex",
              backgroundColor: "white",
            }}
          >
            <TextField
              inputRef={textFieldRef}
              label="대화를 입력하세요"
              variant="outlined"
              fullWidth
              size="small"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              InputProps={{
                style: {
                  maxHeight: "100%",
                  overflow: "hidden",
                  flex: 9,
                },
              }}
            />
            <IconButton color="primary" onClick={handleSubmit} sx={{ flex: 1 }}>
              <SendIcon />
            </IconButton>
          </Container>
        </AppBar>
      </Container>
    </Grid>
  );
};

export default observer(ChatScreen);
