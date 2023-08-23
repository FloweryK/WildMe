import { SignInResponse, SignRequest, SignUpResponse } from "./interface";
import instance from "../instance";

const signUp = async (request: SignRequest): Promise<SignUpResponse> => {
  const response = await instance.post("auth/signup", request);
  return response.data;
};

const signIn = async (request: SignRequest): Promise<SignInResponse> => {
  const response = await instance.post("auth/signin", request);
  return response.data;
};

export { signIn, signUp };
