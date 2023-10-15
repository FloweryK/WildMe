type ChatMsgSide = "left" | "right";

export interface ChatMsgInterface {
  avatar: string;
  messages: string[];
  side: ChatMsgSide;
}
