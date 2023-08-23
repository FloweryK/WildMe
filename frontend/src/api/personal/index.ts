import { AxiosResponse, AxiosError } from "axios";
import { tokenStore } from "store";
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
  try {
    const response: AxiosResponse<ReserveScheduleResponse> =
      await instance.post(`schedule/reserve`, data, {
        headers: { Authorization: tokenStore.accessToken },
      });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
}

export async function getSchedule(): Promise<GetScheduleResponse[]> {
  try {
    const response: AxiosResponse<GetScheduleResponse[]> = await instance.post(
      `schedule/read`,
      {},
      { headers: { Authorization: tokenStore.accessToken } }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
}

export async function stopSchedule(data: StopScheduleRequest): Promise<any> {
  try {
    const response: AxiosResponse<GetScheduleResponse[]> = await instance.post(
      `schedule/stop`,
      data,
      { headers: { Authorization: tokenStore.accessToken } }
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
  try {
    const response: AxiosResponse<GetScheduleResponse[]> = await instance.post(
      `schedule/delete`,
      data,
      { headers: { Authorization: tokenStore.accessToken } }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
}
