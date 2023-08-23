import { makeAutoObservable } from "mobx";

class TokenStore {
  accessToken: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }
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
    this.isPasswordError = state.isPasswordErro;
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

export const tokenStore = new TokenStore();
export const toastStore = new ToastStore();
export const authStore = new AuthStore();
export const chatStore = new ChatStore();
