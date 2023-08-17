import { AxiosResponse, AxiosError } from "axios";
import { AuthRequest, SignInResponse, SignUpResponse } from "./interface";
import instance from "../instance";

async function signIn(data: AuthRequest): Promise<SignInResponse> {
  try {
    const response: AxiosResponse<SignInResponse> = await instance.post(`auth/signin`, data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
}

async function signUp(data: AuthRequest): Promise<SignUpResponse> {
  try {
    const response: AxiosResponse<SignUpResponse> = await instance.post(`auth/signup`, data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
}

export { signIn, signUp };
