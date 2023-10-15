import axios from "axios";
import { toastStore } from "store";
import { toastStates } from "common/Toast";
import { status } from "common/status";

const instance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_HOST,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    switch (error.response.status) {
      case status.UNAUTHORIZED:
        if (error.config.url !== "auth/signin") {
          toastStore.setToast(toastStates.UNAUTHORIZED);
          return new Promise(() => {});
        } else {
          return Promise.reject(error);
        }
      case status.INTERNAL_SERVER_ERROR:
        toastStore.setToast(toastStates.INTERNAL_SERVER_ERROR);
        return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

export default instance;
