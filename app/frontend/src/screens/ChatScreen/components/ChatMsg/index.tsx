import { styled } from "styled-components";
import { Avatar, Grid, Typography } from "@mui/material";
import { defaultTheme } from "common/theme";
import { ChatMsgInterface } from "./interface";

const RADIUS = "32px";

const StyledChatMsg = styled.div`
  .chatMsgContainer {
    padding-top: 2px;
    padding-bottom: 2px;
  }
  p {
    text-align: left;
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
    margin-right: 10px;
    align-items: flex-end;
    p {
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

const ChatMsg = (props: ChatMsgInterface) => {
  const { avatar, messages, side } = props;
  const messagesSplitted = !!messages ? messages[0].split("[SEP]") : messages;

  return (
    <StyledChatMsg>
      <Grid
        className="chatMsgContainer"
        container
        spacing={2}
        justifyContent={side === "right" ? "flex-end" : "flex-start"}
      >
        {side === "left" && (
          <Grid item>
            <Avatar src={avatar} />
          </Grid>
        )}
        <Grid
          item
          xs={8}
          className={side}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          {messagesSplitted.map((msg, i) => (
            <Typography key={`${msg}-${i}`}>{msg}</Typography>
          ))}
        </Grid>
      </Grid>
    </StyledChatMsg>
  );
};

export default ChatMsg;
