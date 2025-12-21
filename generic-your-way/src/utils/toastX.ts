import { toast, type ToastOptions } from "react-toastify";

const base: ToastOptions = {
  autoClose: 2500,
};

export const toastSuccess = (msg: string, opts?: ToastOptions) =>
  toast.success(msg, { ...base, ...opts });

export const toastInfo = (msg: string, opts?: ToastOptions) =>
  toast.info(msg, { ...base, ...opts });

export const toastWarn = (msg: string, opts?: ToastOptions) =>
  toast.warning(msg, { ...base, ...opts });

export const toastError = (msg: string, opts?: ToastOptions) =>
  toast.error(msg, { ...base, ...opts });

export const toastApiError = (e: any, fallback = "Something went wrong") => {
  const msg =
    e?.response?.data?.message ||
    e?.message ||
    fallback;

  toastError(msg);
};
