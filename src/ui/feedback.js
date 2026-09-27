import { toast } from "react-toastify";

// Action feedback lives outside individual routes, so navigation does not hide it.
// Keep form errors inline as well; users can still read them after a toast closes.
export function notifySuccess(message) {
  toast.success(message, { toastId: "success:" + message });
}

export function notifyError(error) {
  const message = typeof error === "string" ? error : error?.message || "Something went wrong. Please try again.";
  toast.error(message, { toastId: "error:" + message, autoClose: 8000 });
}

export function notifyLogout() {
  toast.dismiss();
  toast.clearWaitingQueue();
  notifySuccess("You have logged out.");
}
