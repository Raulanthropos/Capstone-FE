import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";
import profileReducer from "./redux/reducers/profileReducer";
import Avatar from "./components/Avatar/Avatar";

const mockHandlers = {};
const mockDisconnect = jest.fn();
jest.mock("socket.io-client", () => ({
  io: () => ({
    on: (event, handler) => { mockHandlers[event] = handler; },
    disconnect: () => mockDisconnect(),
  }),
}));
jest.mock("./components/Home/Home", () => () => <h1>Woof Paws home</h1>);
const user = { _id: "user-id", name: "Ada", surname: "Lovelace", email: "ada@example.test", role: "user", description: "Looking to adopt.", picture: null };
const conversation = { _id: "request-id", dogName: "Luna", dogId: "dog-id", userId: user._id,
  applicantName: "Ada", applicantSurname: "Lovelace", status: "pending" };
const notice = { _id: "notice-id", requestId: conversation._id, kind: "adoption_approved",
  title: "Your adoption request for Luna was approved.", createdAt: "2026-09-27T12:00:00Z", readAt: null };
const initialMessage = { _id: 1, requestId: conversation._id, senderId: "admin-id",
  senderName: "Local", senderSurname: "Admin", body: "Hello, Ada.", createdAt: "2026-09-27T12:00:00Z" };
const originalFetch = global.fetch;
const originalCrypto = global.crypto;
const response = (status, body) => ({ ok: status < 400, status, json: async () => body });
let notices, history, sendHandler;
function renderPage(path) {
  window.history.replaceState({}, "", path);
  const store = configureStore({ reducer: { loadedProfile: profileReducer },
    preloadedState: { loadedProfile: { currentUser: user, accessToken: "test-token", isAuthenticated: true } } });
  return { store, ...render(<Provider store={store}><App /></Provider>) };
}
beforeEach(() => {
  Object.keys(mockHandlers).forEach((key) => delete mockHandlers[key]);
  notices = [{ ...notice }];
  history = [{ ...initialMessage }];
  Object.defineProperty(global, "crypto", { configurable: true, value: { randomUUID: () => "client-id" } });
  sendHandler = (body) => {
    const message = { ...initialMessage, ...body, _id: 2, senderId: user._id };
    history.push(message);
    return response(201, message);
  };
  global.fetch = jest.fn(async (url, options = {}) => {
    const { pathname } = new URL(url);
    if (pathname === "/users/me") return response(200, user);
    if (pathname === "/inbox/notifications") return response(200, { items: notices, total: notices.length, unread: notices.filter((item) => !item.readAt).length });
    if (pathname.endsWith("/read") || pathname.endsWith("/read-all")) {
      notices = notices.map((item) => ({ ...item, readAt: new Date().toISOString() }));
      return response(200, { read: true });
    }
    if (pathname === "/inbox/conversations") return response(200, { items: [conversation], total: 1 });
    if (pathname === "/inbox/conversations/request-id") return response(200, conversation);
    if (pathname === "/inbox/conversations/request-id/messages") {
      if (options.method === "POST") return sendHandler(JSON.parse(options.body));
      return response(200, { items: history.slice(), hasMore: false, nextBeforeId: null });
    }
    return response(404, { message: "Conversation not found." });
  });
});
afterEach(() => { global.fetch = originalFetch; Object.defineProperty(global, "crypto", { configurable: true, value: originalCrypto }); });

test("notification badge reflects persisted unread notifications and mark-all survives a refresh", async () => {
  renderPage("/notifications");
  await screen.findByRole("link", { name: "Notifications, 1 unread" });
  const item = screen.getByRole("article");
  expect(within(item).getByText(notice.title)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Mark all as read" }));
  await screen.findByText("All notifications marked as read.");
  await screen.findByRole("link", { name: "Notifications" });
  expect(screen.getByRole("button", { name: "Mark all as read" })).toBeDisabled();
  act(() => mockHandlers["inbox:changed"]());
  await waitFor(() => expect(within(screen.getByRole("article")).getByText("READ")).toBeInTheDocument());
});

test("incoming socket events refresh the conversation and unread badge", async () => {
  renderPage("/messages/request-id");
  await screen.findByText("Hello, Ada.");
  act(() => mockHandlers.connect());
  await screen.findByText("Live");
  history.push({ ...initialMessage, _id: 2, body: "Can you visit tomorrow?" });
  notices.push({ ...notice, _id: "second" });
  act(() => mockHandlers["inbox:changed"]());
  await screen.findByText("Can you visit tomorrow?");
  await screen.findByRole("link", { name: "Notifications, 2 unread" });
});

test("sending waits for confirmation, disables double clicks and renders message text safely", async () => {
  let finish;
  sendHandler = (body) => new Promise((resolve) => { finish = () => {
    const message = { ...initialMessage, ...body, _id: 2, senderId: user._id };
    history.push(message);
    resolve(response(201, message));
  }; });
  renderPage("/messages/request-id");
  await screen.findByText("Hello, Ada.");
  fireEvent.change(screen.getByLabelText("Message"), { target: { value: "<script>alert('x')</script>" } });
  fireEvent.click(screen.getByRole("button", { name: "Send message" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Sending..." })).toBeDisabled());
  fireEvent.click(screen.getByRole("button", { name: "Sending..." }));
  expect(global.fetch.mock.calls.filter(([,options]) => options.method === "POST")).toHaveLength(1);
  expect(screen.queryByText("<script>alert('x')</script>", { selector: "p" })).not.toBeInTheDocument();
  await act(async () => finish());
  await screen.findByText("<script>alert('x')</script>", { selector: "p" });
  expect(document.querySelector("script")).toBeNull();
  expect(screen.getByLabelText("Message")).toHaveValue("");
});

test("a lost response keeps the draft and retry reuses the message identifier", async () => {
  sendHandler = () => { throw new TypeError("Failed to fetch"); };
  renderPage("/messages/request-id");
  await screen.findByText("Hello, Ada.");
  fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hello team" } });
  fireEvent.click(screen.getByRole("button", { name: "Send message" }));
  await screen.findByRole("alert");
  expect(screen.getByLabelText("Message")).toHaveValue("Hello team");
  const first = global.fetch.mock.calls.find(([,options]) => options.method === "POST")[1].body;
  sendHandler = (body) => {
    const message = { ...initialMessage, ...body, _id: 2, senderId: user._id };
    history.push(message);
    return response(200, message);
  };
  fireEvent.click(screen.getByRole("button", { name: "Send message" }));
  await screen.findByText("Hello team", { selector: "p" });
  const sends = global.fetch.mock.calls.filter(([,options]) => options.method === "POST");
  expect(sends[1][1].body).toBe(first);
  expect(screen.getByLabelText("Message")).toHaveValue("");
});

test("socket disconnect and reconnect recover missed messages; logout closes the socket", async () => {
  renderPage("/messages/request-id");
  await screen.findByText("Hello, Ada.");
  act(() => mockHandlers.disconnect());
  await screen.findByText("Reconnecting…");
  history.push({ ...initialMessage, _id: 2, body: "Arrived while offline." });
  act(() => mockHandlers.connect());
  await screen.findByText("Arrived while offline.");
  fireEvent.click(screen.getByRole("button", { name: "Account menu" }));
  fireEvent.click(screen.getByText("Logout"));
  await screen.findByRole("heading", { name: "Woof Paws home" });
  expect(mockDisconnect).toHaveBeenCalled();
  expect(screen.queryByText("Arrived while offline.")).not.toBeInTheDocument();
});

test("expired socket session clears the account and returns a protected inbox to login", async () => {
  const { store } = renderPage("/messages/request-id");
  await screen.findByText("Hello, Ada.");
  act(() => mockHandlers["session:expired"]());
  await screen.findByRole("heading", { name: "Login" });
  expect(store.getState().loadedProfile.accessToken).toBeNull();
  expect(mockDisconnect).toHaveBeenCalled();
});

test("a forbidden conversation cannot display messages or send a draft", async () => {
  renderPage("/messages/another-request");
  expect(await screen.findByRole("alert")).toHaveTextContent("Conversation not found.");
  expect(screen.queryByLabelText("Message")).not.toBeInTheDocument();
});

test("account menu opens by click and navigation closes the mobile menu", async () => {
  renderPage("/users/me");
  await screen.findByText("Ada Lovelace");
  const toggle = screen.getByRole("button", { name: "Toggle navigation" });
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(screen.getByRole("button", { name: "Account menu" }));
  fireEvent.click(screen.getByText("Settings"));
  await waitFor(() => expect(toggle).toHaveAttribute("aria-expanded", "false"));
  expect(screen.getByRole("img", { name: "Profile" })).toHaveTextContent("AL");
});

test("a broken user photo falls back to initials and another user's photo can load", () => {
  const page = render(<Avatar user={{ ...user, picture: "/broken.jpg" }} label="Profile" />);
  fireEvent.error(screen.getByRole("img", { name: "Profile" }));
  expect(screen.getByRole("img", { name: "Profile" })).toHaveTextContent("AL");
  page.rerender(<Avatar user={{ ...user, _id: "other", name: "Grace", surname: "Hopper", picture: "/grace.jpg" }} label="Profile" />);
  expect(screen.getByRole("img", { name: "Profile" })).toHaveAttribute("src", "/grace.jpg");
});
