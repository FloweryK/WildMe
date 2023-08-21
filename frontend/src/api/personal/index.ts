import { AxiosResponse, AxiosError } from "axios";
import { Cookies } from "react-cookie";
import { GetScheduleResponse, ReserveScheduleResponse } from "./interface";
import instance from "../instance";

export async function reserveSchedule(
  data: FormData
): Promise<ReserveScheduleResponse> {
  const cookies = new Cookies();

  try {
    const response: AxiosResponse<ReserveScheduleResponse> =
      await instance.post(`schedule/reserve`, data, {
        headers: { Authorization: cookies.get("accessToken") },
      });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
}

export async function getSchedule(): Promise<GetScheduleResponse[]> {
  const cookies = new Cookies();

  try {
    const response: AxiosResponse<GetScheduleResponse[]> = await instance.post(
      `schedule/read`,
      {},
      { headers: { Authorization: cookies.get("accessToken") } }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
}
