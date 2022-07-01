import { toast } from "react-toastify";
import * as type from "../constants/index";
export const delay = (number) => {
  return new Promise((res) => setTimeout(res, number));
};
export const getSocket = (data) => {
  return {
    type: type.SOCKET,
    payload: data,
  };
};
export const messageSuccess = (text) =>
  toast.info(text, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

export const messageFail = (text) =>
  toast.error(text, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
