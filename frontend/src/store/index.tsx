import { makeAutoObservable } from "mobx";
import { Cookies } from "react-cookie";

class Cookie {
  cookies = new Cookies();

  set = (name: string, value: string, options?: any) => {
    return this.cookies.set(name, value, { ...options });
  };

  get = (name: string) => {
    return this.cookies.get(name);
  };

  remove = (name: string) => {
    this.cookies.remove(name);
  };
}

class ToastStore {
  open: boolean = false;
  severity: string = "success";
  text: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setOpen(open: boolean) {
    this.open = open;
  }

  setSeverity(severity: string) {
    this.severity = severity;
  }

  setText(text: string) {
    this.text = text;
  }

  setToast(state: any) {
    this.open = state.open;
    this.severity = state.severity;
    this.text = state.text;
  }
}

class AuthStore {
  isNameError: boolean = false;
  isPasswordError: boolean = false;
  isDuplicated: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setInputState(state: any) {
    this.isNameError = state.isNameError;
    this.isPasswordError = state.isPasswordError;
    this.isDuplicated = state.isDuplicated;
  }
}

class ChatStore {
  tag: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setTag(tag: string) {
    this.tag = tag;
  }
}

export const cookie = new Cookie();
export const toastStore = new ToastStore();
export const authStore = new AuthStore();
export const chatStore = new ChatStore();
