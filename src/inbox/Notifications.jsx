import { useEffect, useRef, useState } from "react";
import { Alert, Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { inboxRequest } from "../api/inbox";
import { logoutUser } from "../redux/actions/profileAction";
import { notifyError, notifySuccess } from "../ui/feedback";
import { useInbox } from "./InboxProvider";

function NotificationList({ token }) {
  const [page, setPage] = useState({ items: [], unread: 0, total: 0 });
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { revision, refresh } = useInbox();
  const dispatch = useDispatch();
  const readController = useRef(null);
  useEffect(() => () => readController.current?.abort(), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    inboxRequest("/notifications?limit=20&offset=" + offset, token, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          if (!Array.isArray(data?.items)) throw new Error("Notifications could not be loaded.");
          setPage(data);
        }
      }).catch((error) => {
        if (controller.signal.aborted) return;
        if (error.status === 401) dispatch(logoutUser());
        else setError(error.message);
      }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [token, revision, offset, dispatch]);

  const read = async (id) => {
    if (busy) return;
    setBusy(true);
    const controller = new AbortController();
    readController.current = controller;
    try {
      await inboxRequest(id ? "/notifications/" + id + "/read" : "/notifications/read-all",
        token, { method: id ? "PATCH" : "POST", body: {}, signal: controller.signal });
      if (controller.signal.aborted) return;
      refresh();
      notifySuccess(id ? "Notification marked as read." : "All notifications marked as read.");
    } catch (error) {
      if (controller.signal.aborted) return;
      if (error.status === 401) dispatch(logoutUser());
      else { setError(error.message); notifyError(error); }
    } finally { if (!controller.signal.aborted) setBusy(false); }
  };

  return <Container className="page-section">
    <div className="page-heading"><div><span className="eyebrow">YOUR UPDATES</span><h1>Notifications</h1></div>
      <Button variant="outline-dark" disabled={busy || loading || !page.unread} onClick={() => read()}>Mark all as read</Button></div>
    <p className="text-muted">Adoption decisions, new requests and conversations, all in one place.</p>
    {error && <Alert variant="danger">{error} <Button variant="link" onClick={refresh}>Retry</Button></Alert>}
    {loading && <p role="status">Loading notifications...</p>}
    {!loading && !error && !page.items.length && <div className="empty-state"><h2>You're all caught up.</h2><p>Your next update will appear here.</p></div>}
    <div className="notification-list">{page.items.map((item) => <article key={item._id}
      className={"notification-item " + (!item.readAt ? "is-unread" : "")}>
      <div><span className="eyebrow">{item.readAt ? "READ" : "NEW"}</span><h2 className="h5">{item.title}</h2>
        <time className="text-muted">{new Date(item.createdAt).toLocaleString()}</time>
        <div><Link to={item.kind === "adoption_created" ? "/admin/adoptions" : "/messages/" + item.requestId}>
          {item.kind === "adoption_created" ? "Review request" : "Open conversation"} <span aria-hidden="true">↗</span></Link></div>
      </div>
      {!item.readAt && <Button variant="outline-secondary" disabled={busy} onClick={() => read(item._id)}>Mark as read</Button>}
    </article>)}</div>
    {page.total > 20 && <div className="pagination-row">
      <Button variant="outline-dark" disabled={!offset || loading} onClick={() => setOffset(offset - 20)}>Previous</Button>
      <span>{offset + 1}–{Math.min(offset + 20, page.total)} of {page.total}</span>
      <Button variant="outline-dark" disabled={offset + 20 >= page.total || loading} onClick={() => setOffset(offset + 20)}>Next</Button>
    </div>}
  </Container>;
}

export default function Notifications() {
  const { isAuthenticated, accessToken } = useSelector((state) => state.loadedProfile);
  return isAuthenticated ? <NotificationList key={accessToken} token={accessToken} />
    : <Navigate to="/login" replace state={{ message: "Please log in to see your notifications." }} />;
}
