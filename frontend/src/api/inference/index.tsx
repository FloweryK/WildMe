import { AxiosError, AxiosResponse } from "axios";
import { tokenStore } from "store";
import instance from "api/instance";
import { ChatRequest, ChatResponse } from "./interface";

export async function getChat(data: ChatRequest): Promise<ChatResponse> {
  try {
    const response: AxiosResponse<ChatResponse> = await instance.post(
      `inference/chat`,
      data,
      { headers: { Authorization: tokenStore.accessToken } }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
}
