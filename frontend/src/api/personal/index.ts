import { AxiosResponse, AxiosError } from "axios";
import { Cookies } from "react-cookie";
import {
  DeleteScheduleRequest,
  GetScheduleResponse,
  ReserveScheduleResponse,
  StopScheduleRequest,
} from "./interface";
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

export async function stopSchedule(data: StopScheduleRequest): Promise<any> {
  const cookies = new Cookies();

  try {
    const response: AxiosResponse<GetScheduleResponse[]> = await instance.post(
      `schedule/stop`,
      data,
      { headers: { Authorization: cookies.get("accessToken") } }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
}

export async function deleteSchedule(
  data: DeleteScheduleRequest
): Promise<any> {
  const cookies = new Cookies();

  try {
    const response: AxiosResponse<GetScheduleResponse[]> = await instance.post(
      `schedule/delete`,
      data,
      { headers: { Authorization: cookies.get("accessToken") } }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
}
