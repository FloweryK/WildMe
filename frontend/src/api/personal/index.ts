import { AxiosResponse, AxiosError } from "axios";
import { Cookies } from "react-cookie";
import instance from "../instance";
import {
  GetScheduleResponse,
  ReserveScheduleRequest,
  ReserveScheduleResponse,
} from "./interface";

export async function reserveSchedule(
  data: ReserveScheduleRequest
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
      {
        headers: { Authorization: cookies.get("accessToken") },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
}
