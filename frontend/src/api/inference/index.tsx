import instance from "api/instance";
import { getCookie } from "common/cookie";
import { ChatRequest, ChatResponse } from "./interface";

const getChat = async (request: ChatRequest): Promise<ChatResponse> => {
  const response = await instance.post(`inference/chat`, request, {
    headers: { Authorization: getCookie("accessToken") },
  });
  return response.data;
};

export { getChat };
