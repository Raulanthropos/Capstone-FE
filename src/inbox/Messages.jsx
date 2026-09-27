import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useParams } from "react-router-dom";
import { inboxRequest } from "../api/inbox";
import { logoutUser } from "../redux/actions/profileAction";
import { notifyError } from "../ui/feedback";
import { useInbox } from "./InboxProvider";

function Conversation({ id, token, currentUser }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [older, setOlder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState("");
  const [sendError, setSendError] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const pending = useRef(null);
  const sendController = useRef(null);
  const olderController = useRef(null);
  const inFlight = useRef(false);
  const historyViewport = useRef(null);
  const followLatest = useRef(true);
  const restoreHeight = useRef(null);
  const { revision, refresh, connected } = useInbox();
  const dispatch = useDispatch();

  useEffect(() => () => { sendController.current?.abort(); olderController.current?.abort(); }, []);

  useEffect(() => {
    const controller = new AbortController();
    setError("");
    Promise.all([
      inboxRequest("/conversations/" + id, token, { signal: controller.signal }),
      inboxRequest("/conversations/" + id + "/messages", token, { signal: controller.signal }),
    ]).then(([item, page]) => {
      if (controller.signal.aborted) return;
      if (!Array.isArray(page?.items)) throw new Error("Messages could not be loaded.");
      setConversation(item);
      // Reload the latest page after reconnect; older history remains available.
      setMessages((current) => [...new Map([...current, ...page.items].map((message) => [message._id, message])).values()].sort((a,b) => a._id - b._id));
      setOlder(page.nextBeforeId);
    }).catch((error) => {
      if (controller.signal.aborted) return;
      if (error.status === 401) dispatch(logoutUser());
      else {
        if ([403, 404].includes(error.status)) { setConversation(null); setMessages([]); }
        setError(error.message);
      }
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id, token, revision, dispatch]);

  useLayoutEffect(() => {
    const viewport = historyViewport.current;
    if (!viewport) return;
    if (restoreHeight.current !== null) {
      viewport.scrollTop += viewport.scrollHeight - restoreHeight.current;
      restoreHeight.current = null;
    } else if (followLatest.current) viewport.scrollTop = viewport.scrollHeight;
  }, [messages]);

  const loadOlder = async () => {
    if (!older || loadingOlder) return;
    const controller = new AbortController();
    olderController.current = controller;
    setLoadingOlder(true);
    try {
      const page = await inboxRequest("/conversations/" + id + "/messages?beforeId=" + older, token, { signal: controller.signal });
      if (controller.signal.aborted) return;
      restoreHeight.current = historyViewport.current?.scrollHeight ?? null;
      setMessages((current) => [...new Map([...page.items, ...current].map((message) => [message._id, message])).values()].sort((a,b) => a._id - b._id));
      setOlder(page.nextBeforeId);
    } catch (error) {
      if (!controller.signal.aborted) {
        if (error.status === 401) dispatch(logoutUser());
        else { setError(error.message); notifyError(error); }
      }
    } finally { if (!controller.signal.aborted) setLoadingOlder(false); }
  };

  const send = async (event) => {
    event.preventDefault();
    if (inFlight.current || !text.trim() || !conversation) return;
    inFlight.current = true;
    setSending(true);
    setSendError("");
    const body = text.trim();
    const controller = new AbortController();
    sendController.current = controller;
    try {
      if (!pending.current || pending.current.body !== body) {
        pending.current = { body, clientMessageId: crypto.randomUUID() };
      }
      const message = await inboxRequest("/conversations/" + id + "/messages", token,
        { method: "POST", body: pending.current, signal: controller.signal });
      if (controller.signal.aborted) return;
      if (!Number.isInteger(message?._id)) throw new Error("Message delivery could not be confirmed. Please retry.");
      followLatest.current = true;
      setMessages((current) => [...new Map([...current, message].map((item) => [item._id, item])).values()].sort((a,b) => a._id - b._id));
      pending.current = null;
      setText("");
      refresh();
    } catch (error) {
      if (controller.signal.aborted) return;
      if (error.status === 401) dispatch(logoutUser());
      else { setSendError(error.message); notifyError(error); }
    } finally {
      inFlight.current = false;
      if (!controller.signal.aborted) setSending(false);
    }
  };

  return <section className="conversation-panel" aria-label="Conversation">
    {loading && <p role="status">Loading conversation...</p>}
    {error && <Alert variant="danger">{error} <Button variant="link" onClick={refresh}>Retry</Button></Alert>}
    {conversation && <>
      <header className="conversation-heading"><div><span className="eyebrow">ADOPTION CONVERSATION</span>
        <h2>{conversation.dogName}</h2><p>{currentUser.role === "admin"
          ? conversation.applicantName + " " + conversation.applicantSurname : "Woof Paws adoption team"} · {conversation.status}</p></div>
        <span className={"connection-label " + (connected ? "is-connected" : "")}>{connected ? "Live" : "Reconnecting…"}</span></header>
      <div className="message-history" aria-label="Messages" ref={historyViewport}
        onScroll={(event) => { const view = event.currentTarget; followLatest.current = view.scrollHeight - view.scrollTop - view.clientHeight < 80; }}>
        {older && <Button variant="outline-secondary" disabled={loadingOlder} onClick={loadOlder}>{loadingOlder ? "Loading..." : "Load earlier messages"}</Button>}
        {!messages.length && <div className="empty-state"><h3>Say hello.</h3><p>Ask a question or discuss the next steps for {conversation.dogName}.</p></div>}
        {messages.map((message) => <article key={message._id} className={"message-bubble " + (message.senderId === currentUser._id ? "is-mine" : "")}>
          <strong>{message.senderId === currentUser._id ? "You" : message.senderName + " " + message.senderSurname}</strong>
          <p>{message.body}</p><time>{new Date(message.createdAt).toLocaleString()}</time>
        </article>)}
      </div>
      <Form onSubmit={send} className="message-composer">
        {sendError && <Alert variant="danger">{sendError} Your draft is still here; you can retry.</Alert>}
        <Form.Group controlId="message-text"><Form.Label>Message</Form.Label>
          <Form.Control as="textarea" rows={3} maxLength={2000} required value={text} disabled={sending}
            placeholder="Write to the adoption team…" onChange={(event) => setText(event.target.value)} /></Form.Group>
        <div className="composer-actions"><small className="text-muted">{text.length}/2000</small>
          <Button type="submit" disabled={sending || !text.trim() || Boolean(error)}>{sending ? "Sending..." : "Send message"}</Button></div>
      </Form>
    </>}
  </section>;
}

function Inbox({ token, user }) {
  const { requestId } = useParams();
  const [page, setPage] = useState({ items: [], total: 0 });
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { revision, refresh } = useInbox();
  const dispatch = useDispatch();
  useEffect(() => {
    const controller = new AbortController();
    setError("");
    inboxRequest("/conversations?limit=20&offset=" + offset, token, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          if (!Array.isArray(data?.items)) throw new Error("Conversations could not be loaded.");
          setPage(data);
        }
      }).catch((error) => {
        if (controller.signal.aborted) return;
        if (error.status === 401) dispatch(logoutUser());
        else setError(error.message);
      }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [token, revision, offset, dispatch]);
  return <Container className="page-section">
    <span className="eyebrow">A LITTLE CONVERSATION GOES A LONG WAY</span><h1>Messages</h1>
    <p className="text-muted">A private space for each adoption request, shared with the applicant and our admin team.</p>
    <div className="inbox-layout"><aside className="conversation-list" aria-label="Adoption conversations">
      {loading && <p role="status">Loading conversations...</p>}
      {error && <Alert variant="danger">{error} <Button variant="link" onClick={refresh}>Retry</Button></Alert>}
      {!loading && !error && !page.items.length && <p>No conversations yet. Submit an adoption request to start one.</p>}
      {page.items.map((item) => <Link className={"conversation-link " + (requestId === item._id ? "is-selected" : "")}
        key={item._id} to={"/messages/" + item._id} aria-current={requestId === item._id ? "page" : undefined}>
        <strong>{item.dogName}</strong><span>{user.role === "admin" ? item.applicantName + " " + item.applicantSurname : "Adoption team"} · {item.status}</span>
        <small>{item.lastMessage?.body || "Start the conversation"}</small>
      </Link>)}
      {page.total > 20 && <div className="pagination-row"><Button variant="outline-dark" disabled={!offset} onClick={() => setOffset(offset - 20)}>Previous</Button>
        <Button variant="outline-dark" disabled={offset + 20 >= page.total} onClick={() => setOffset(offset + 20)}>Next</Button></div>}
    </aside>
      {requestId ? <Conversation key={token + requestId} id={requestId} token={token} currentUser={user} />
        : <div className="empty-state conversation-panel"><h2>Every good match starts with a hello.</h2><p>Choose an adoption conversation to get started.</p></div>}
    </div>
  </Container>;
}

export default function Messages() {
  const { accessToken, isAuthenticated, currentUser } = useSelector((state) => state.loadedProfile);
  return isAuthenticated && currentUser ? <Inbox key={accessToken} token={accessToken} user={currentUser} />
    : <Navigate to="/login" replace state={{ message: "Please log in to see your messages." }} />;
}
