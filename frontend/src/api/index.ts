import axios, { AxiosResponse, AxiosError } from "axios";
import { SignInRequest, SignInResponse } from "./interface";

const API_BASE_URL = "http://localhost:8080";

const instance = axios.create({
  baseURL: API_BASE_URL,
});

async function signIn(data: SignInRequest): Promise<SignInResponse> {
  try {
    const response: AxiosResponse<SignInResponse> = await instance.post(
      `auth/signin`,
      data
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      // Request was made and server responded with a status code outside of the 2xx range
      console.error("Server responded with:", axiosError.response.data);
      console.error("Status code:", axiosError.response.status);
    } else if (axiosError.request) {
      // Request was made but no response was received
      console.error("No response received:", axiosError.request);
    } else {
      // Something went wrong while setting up the request
      console.error("Error setting up request:", axiosError.message);
    }
    throw axiosError;
  }
}

export { signIn };
