import { AxiosError, AxiosResponse } from "axios";
import { Cookies } from "react-cookie";
import { ChatRequest, ChatResponse } from "./interface";
import instance from "api/instance";

export async function getChat(data: ChatRequest): Promise<ChatResponse> {
  const cookies = new Cookies();

  try {
    const response: AxiosResponse<ChatResponse> = await instance.post(
      `inference/chat`,
      data,
      { headers: { Authorization: cookies.get("accessToken") } }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
}
