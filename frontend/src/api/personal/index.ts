import { AxiosResponse } from "axios";
import { getCookie } from "common/cookie";
import {
  DeleteScheduleRequest,
  GetScheduleResponse,
  ReserveScheduleResponse,
  StopScheduleRequest,
} from "./interface";
import instance from "../instance";

const reserveSchedule = async (
  request: FormData
): Promise<ReserveScheduleResponse> => {
  const headers = { Authorization: getCookie("accessToken") };
  const response = await instance.post("schedule/reserve", request, {
    headers: headers,
  });
  return response.data;
};

const getSchedule = async (): Promise<GetScheduleResponse[]> => {
  const headers = { Authorization: getCookie("accessToken") };
  const response = await instance.post(
    "schedule/read",
    {},
    { headers: headers }
  );
  return response.data;
};

const stopSchedule = async (request: StopScheduleRequest): Promise<any> => {
  const headers = { Authorization: getCookie("accessToken") };
  const response: AxiosResponse<GetScheduleResponse[]> = await instance.post(
    "schedule/stop",
    request,
    { headers: headers }
  );
  return response.data;
};

const deleteSchedule = async (request: DeleteScheduleRequest): Promise<any> => {
  const headers = { Authorization: getCookie("accessToken") };
  const response: AxiosResponse<GetScheduleResponse[]> = await instance.post(
    `schedule/delete`,
    request,
    { headers: headers }
  );
  return response.data;
};

export { reserveSchedule, getSchedule, stopSchedule, deleteSchedule };
