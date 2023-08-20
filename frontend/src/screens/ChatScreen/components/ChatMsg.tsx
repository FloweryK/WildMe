import React from "react";
import { Avatar, Grid, Typography } from "@mui/material";
import { styled } from "styled-components";
import { defaultTheme } from "common/theme";

const RADIUS = "32px";

const StyledChatMsg = styled.div`
  p {
    margin-bottom: 4px;
    padding: 4px 16px;
    display: inline-block;
    word-break: break-word;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
    width: fit-content;
  }
  .left {
    p {
      text-align: left;
      border-top-right-radius: ${RADIUS};
      border-bottom-right-radius: ${RADIUS};
      background-color: ${defaultTheme.palette.secondary.main};

      &:first-child {
        border-top-left-radius: ${RADIUS};
      }
      &:last-child {
        border-bottom-left-radius: ${RADIUS};
      }
      &:first-child:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: ${RADIUS};
      }
    }
  }
  .right {
    align-items: flex-end;
    p {
      text-align: right;
      color: white;
      border-top-left-radius: ${RADIUS};
      border-bottom-left-radius: ${RADIUS};
      background-color: ${defaultTheme.palette.primary.main};

      &:first-child {
        border-top-right-radius: ${RADIUS};
      }
      &:last-child {
        border-bottom-right-radius: ${RADIUS};
      }
      &:first-child:last-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: ${RADIUS};
      }
    }
  }
`;

type ChatMsgSide = "left" | "right";

interface ChatMsgInterface {
  avatar: string;
  messages: string[];
  side: ChatMsgSide;
}

const ChatMsg = (props: ChatMsgInterface) => {
  const { avatar, messages, side } = props;

  return (
    <StyledChatMsg>
      <Grid
        container
        spacing={2}
        justifyContent={side === "right" ? "flex-end" : "flex-start"}
      >
        {side === "left" && (
          <Grid item>
            <Avatar src={avatar} />
          </Grid>
        )}
        <Grid item xs={8} className={side} sx={{ display: "flex", flexDirection: "column" }}>
          {messages.map((msg, i) => (
            <Typography key={`${msg}-${i}`}>{msg}</Typography>
          ))}
        </Grid>
      </Grid>
    </StyledChatMsg>
  );
};

export default ChatMsg;
