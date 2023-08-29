import { cookie } from "store";
import instance from "api/instance";
import { ChatRequest, ChatResponse } from "./interface";

const getChat = async (request: ChatRequest): Promise<ChatResponse> => {
  const response = await instance.post(`inference/chat`, request, {
    headers: { Authorization: cookie.get("accessToken") },
  });
  return response.data;
};

export { getChat };
