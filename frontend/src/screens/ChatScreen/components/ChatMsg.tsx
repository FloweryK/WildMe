import React from "react";
import { Avatar, Grid, Typography } from "@mui/material";
import { styled } from "styled-components";

const StyledChatMsg = styled.div`
  .leftfirst {
    text-align: left;
  }
  .leftmid {
    text-align: left;
  }
  .leftlast {
    text-align: left;
  }
  .rightfirst {
    text-align: right;
  }
  .rightmid {
    text-align: right;
  }
  .rightlast {
    text-align: right;
  }
`;

type ChatMsgSide = "left" | "right";
type ChatMsgOrder = "first" | "mid" | "last";

interface ChatMsgInterface {
  avatar: string;
  messages: string[];
  side: ChatMsgSide;
}

const getOrder = (total: number, i: number): ChatMsgOrder => {
  if (i === 0) {
    return "first";
  } else if (i === total - 1) {
    return "last";
  } else {
    return "mid";
  }
};

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
        <Grid item xs={8}>
          {messages.map((msg, i) => (
            <div>
              <Typography className={side + getOrder(msg.length, i)}>{msg}</Typography>
            </div>
          ))}
        </Grid>
      </Grid>
    </StyledChatMsg>
  );
};

export default ChatMsg;
