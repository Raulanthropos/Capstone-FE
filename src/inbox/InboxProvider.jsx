import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { API_BASE_URL } from "../api/client";
import { getNotificationSummary } from "../api/inbox";
import { logoutUser } from "../redux/actions/profileAction";
import { notifyError } from "../ui/feedback";

const empty = { unread: 0, revision: 0, connected: false, refresh: () => {}, summaryError: "" };
const InboxContext = createContext(empty);
export const useInbox = () => useContext(InboxContext);

function SessionInbox({ token, children }) {
  const [unread, setUnread] = useState(0);
  const [revision, setRevision] = useState(0);
  const [connected, setConnected] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const dispatch = useDispatch();
  const summaryController = useRef(null);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  const expire = useCallback(() => {
    dispatch(logoutUser());
    notifyError("Your session has expired. Please log in again.");
  }, [dispatch]);

  useEffect(() => {
    const controller = new AbortController();
    summaryController.current?.abort();
    summaryController.current = controller;
    getNotificationSummary(token, controller.signal).then((count) => {
      if (!controller.signal.aborted) { setUnread(count); setSummaryError(""); }
    }).catch((error) => {
      if (controller.signal.aborted) return;
      if (error.status === 401) expire();
      else setSummaryError(error.message);
    });
    return () => controller.abort();
  }, [token, revision, expire]);

  useEffect(() => {
    const socket = io(API_BASE_URL, { auth: { token }, reconnectionDelayMax: 5000 });
    let retry;
    const changed = () => refresh();
    socket.on("connect", () => { setConnected(true); refresh(); });
    socket.on("disconnect", () => setConnected(false));
    socket.on("inbox:changed", changed);
    socket.on("session:expired", expire);
    socket.on("connect_error", (error) => {
      setConnected(false);
      if (error.data?.code === "UNAUTHENTICATED") expire();
      else if (!socket.active) {
        window.clearTimeout(retry);
        retry = window.setTimeout(() => socket.connect(), 5000);
      }
    });
    const visible = () => { if (document.visibilityState === "visible") refresh(); };
    window.addEventListener("focus", changed);
    document.addEventListener("visibilitychange", visible);
    // REST recovery also covers a missed event between a commit and a restart.
    const recovery = window.setInterval(visible, 30_000);
    return () => {
      window.clearTimeout(retry);
      socket.disconnect();
      window.clearInterval(recovery);
      window.removeEventListener("focus", changed);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [token, refresh, expire]);

  return <InboxContext.Provider value={{ unread, revision, connected, refresh, summaryError }}>
    {children}
  </InboxContext.Provider>;
}

export default function InboxProvider({ children }) {
  const { accessToken, isAuthenticated } = useSelector((state) => state.loadedProfile);
  return isAuthenticated && accessToken
    ? <SessionInbox key={accessToken} token={accessToken}>{children}</SessionInbox>
    : <InboxContext.Provider value={empty}>{children}</InboxContext.Provider>;
}
