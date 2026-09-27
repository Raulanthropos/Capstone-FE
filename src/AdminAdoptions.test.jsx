import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";
import profileReducer from "./redux/reducers/profileReducer";
import { API_BASE_URL } from "./api/client";

jest.mock("./inbox/InboxProvider", () => ({
  __esModule: true,
  default: ({ children }) => children,
  useInbox: () => ({ unread: 0, revision: 0, connected: false, summaryError: "", refresh: () => {} }),
}));

jest.mock("./components/Home/Home", () => () => <h1>Woof Paws home</h1>);

const admin = { _id: "admin-id", name: "Local", surname: "Admin", email: "admin@example.test",
  age: 30, description: "Administrator.", role: "admin", picture: null };
const applicant = { _id: "user-id", name: "Ada", surname: "Lovelace", email: "ada@example.test",
  age: 30, description: "A fenced garden and experience caring for dogs.", role: "user", picture: null };
const dog = { _id: "dog-id", name: "Luna", breed: "Husky", age: 3, weight: 21.5,
  gender: "female", description: "Friendly dog.", location: "Athens", isAdopted: false };
const initialRequest = {
  _id: "request-id", status: "pending", user: applicant, dog,
  createdAt: "2026-09-27T12:00:00.000Z", updatedAt: "2026-09-27T12:00:00.000Z",
  reviewedBy: null, reviewedAt: null,
};
const token = "admin-test-token";
const response = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body });
const originalFetch = global.fetch;
let rows;
let profile;
let listingHandler;
let reviewHandler;

function renderPage(path = "/admin/adoptions") {
  window.history.replaceState({}, "", path);
  const store = configureStore({
    reducer: { loadedProfile: profileReducer },
    preloadedState: { loadedProfile: { accessToken: token, currentUser: profile, isAuthenticated: true } },
  });
  return { store, ...render(<Provider store={store}><App /></Provider>) };
}
function listPage(url) {
  const status = url.searchParams.get("status");
  const matching = rows.filter((row) => status === "all" || row.status === status);
  const offset = Number(url.searchParams.get("offset"));
  return response(200, { items: matching.slice(offset, offset + 20), total: matching.length, limit: 20, offset });
}
function successfulReview(url, options) {
  const id = url.pathname.split("/").pop();
  const status = JSON.parse(options.body).status;
  rows = rows.map((row) => row._id === id ? {
    ...row, status, dog: { ...row.dog, isAdopted: status === "approved" },
    reviewedBy: admin._id, reviewedAt: "2026-09-27T14:00:00.000Z",
  } : row);
  return response(200, { _id: id, status, closedRequests: 0 });
}
const patchCalls = () => global.fetch.mock.calls.filter(([, options]) => options?.method === "PATCH");

async function choose(decision = "Approve request") {
  const card = await screen.findByRole("article", { name: "Luna - Ada Lovelace" });
  fireEvent.click(within(card).getByRole("button", { name: decision }));
  return screen.findByRole("dialog");
}

beforeEach(() => {
  profile = admin;
  rows = [{ ...initialRequest, dog: { ...dog } }];
  listingHandler = listPage;
  reviewHandler = successfulReview;
  global.fetch = jest.fn(async (url, options = {}) => {
    const parsed = new URL(url);
    if (parsed.pathname === "/users/me") return response(200, profile);
    if (parsed.pathname === "/adoptions") return listingHandler(parsed, options);
    if (parsed.pathname.startsWith("/adoptions/") && options.method === "PATCH") return reviewHandler(parsed, options);
    throw new Error("Unexpected API request: " + url);
  });
});
afterEach(() => { global.fetch = originalFetch; });

test("admin can open reviews from the profile and inspect the applicant and dog", async () => {
  renderPage("/users/me");
  fireEvent.click(await screen.findByRole("button", { name: "Review adoption requests" }));
  const card = await screen.findByRole("article", { name: "Luna - Ada Lovelace" });
  expect(within(card).getByText(applicant.description)).toBeInTheDocument();
  expect(within(card).getByText(dog.description)).toBeInTheDocument();
  expect(card).toHaveTextContent(applicant.email);
  expect(global.fetch).toHaveBeenCalledWith(
    API_BASE_URL + "/adoptions?status=pending&limit=20&offset=0",
    expect.objectContaining({ headers: { Authorization: "Bearer " + token } })
  );
});

test("regular users cannot open the admin page or call the review listing", async () => {
  profile = applicant;
  renderPage();
  expect(await screen.findByRole("alert")).toHaveTextContent("Administrator access required.");
  expect(global.fetch.mock.calls.map(([url]) => url)).toEqual([API_BASE_URL + "/users/me"]);
});

test("approval confirmation explains the consequences and cancelling sends no decision", async () => {
  renderPage();
  const dialog = await choose();
  expect(within(dialog).getByText(/mark this dog as adopted and decline all other pending requests/)).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(patchCalls()).toHaveLength(0);
});

test("approval waits for the server, disables double clicks and refreshes pending requests", async () => {
  let finish;
  reviewHandler = (url, options) => new Promise((resolve) => { finish = () => resolve(successfulReview(url, options)); });
  renderPage();
  const dialog = await choose();
  const confirm = within(dialog).getByRole("button", { name: "Confirm approval" });
  fireEvent.click(confirm);
  fireEvent.click(confirm);
  expect(within(dialog).getByRole("button", { name: "Saving decision..." })).toBeDisabled();
  expect(within(dialog).getByRole("button", { name: "Cancel" })).toBeDisabled();
  expect(patchCalls()).toHaveLength(1);
  const [url, options] = patchCalls()[0];
  expect(url).toBe(API_BASE_URL + "/adoptions/request-id");
  expect(JSON.parse(options.body)).toEqual({ status: "approved" });
  expect(options.headers.Authorization).toBe("Bearer " + token);
  expect(screen.queryByText("Approved the adoption of Luna.")).not.toBeInTheDocument();
  await act(async () => finish());
  await screen.findByText("Approved the adoption of Luna.");
  await screen.findByText("No requests match this status.");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("decline sends the rejected status and the decision can be seen under the declined filter", async () => {
  renderPage();
  const dialog = await choose("Decline request");
  await act(async () => fireEvent.click(within(dialog).getByRole("button", { name: "Confirm decline" })));
  await screen.findByText("Declined the request for Luna.");
  fireEvent.change(screen.getByLabelText("Request status"), { target: { value: "rejected" } });
  const card = await screen.findByRole("article", { name: "Luna - Ada Lovelace" });
  expect(within(card).getByText("Declined")).toBeInTheDocument();
  expect(within(card).queryByRole("button", { name: "Approve request" })).not.toBeInTheDocument();
  expect(JSON.parse(patchCalls()[0][1].body)).toEqual({ status: "rejected" });
});

test.each(["server", "network"])("%s failures keep the decision unconfirmed and allow retry", async (failure) => {
  reviewHandler = () => {
    if (failure === "network") throw new TypeError("Failed to fetch");
    return response(500, { message: "An unexpected error occurred." });
  };
  renderPage();
  const dialog = await choose();
  fireEvent.click(within(dialog).getByRole("button", { name: "Confirm approval" }));
  expect(await within(dialog).findByRole("alert")).toHaveTextContent(
    failure === "network" ? "Cannot connect to the server." : "An unexpected error occurred."
  );
  expect(within(dialog).getByRole("button", { name: "Confirm approval" })).toBeEnabled();
  expect(screen.queryByText("Approved the adoption of Luna.")).not.toBeInTheDocument();
  reviewHandler = successfulReview;
  await act(async () => fireEvent.click(within(dialog).getByRole("button", { name: "Confirm approval" })));
  await screen.findByText("Approved the adoption of Luna.");
});

test("a decision made by another admin is refreshed after 409 and cannot be overwritten", async () => {
  reviewHandler = () => {
    rows = rows.map((row) => ({ ...row, status: "approved" }));
    return response(409, { message: "This request has already been reviewed. Refresh the list." });
  };
  renderPage();
  const dialog = await choose();
  await act(async () => fireEvent.click(within(dialog).getByRole("button", { name: "Confirm approval" })));
  expect(within(dialog).getByRole("alert")).toHaveTextContent("already been reviewed");
  expect(within(dialog).getByRole("button", { name: "Confirm approval" })).toBeDisabled();
  expect(patchCalls()).toHaveLength(1);
  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
  await screen.findByText("No requests match this status.");
});

test("listing failure has a retry and does not report an empty queue", async () => {
  listingHandler = () => response(500, { message: "An unexpected error occurred." });
  renderPage();
  expect(await screen.findByRole("alert")).toHaveTextContent("An unexpected error occurred.");
  expect(screen.queryByText("No requests match this status.")).not.toBeInTheDocument();
  listingHandler = listPage;
  fireEvent.click(screen.getByRole("button", { name: "Retry loading requests" }));
  await screen.findByRole("article", { name: "Luna - Ada Lovelace" });
});

test.each(["listing", "decision"])("expired credentials during %s return to login and clear the session", async (phase) => {
  if (phase === "listing") listingHandler = () => response(401, { message: "Authentication required." });
  else reviewHandler = () => response(401, { message: "Authentication required." });
  const { store } = renderPage();
  if (phase === "decision") {
    const dialog = await choose();
    fireEvent.click(within(dialog).getByRole("button", { name: "Confirm approval" }));
  }
  await screen.findByRole("heading", { name: "Login" });
  expect(screen.getByRole("alert")).toHaveTextContent("Authentication required. Please log in again.");
  expect(store.getState().loadedProfile.accessToken).toBeNull();
});

test("a revoked admin role returns the server's 403 without displaying private records", async () => {
  listingHandler = () => response(403, { message: "Administrator access required." });
  renderPage();
  expect(await screen.findByRole("alert")).toHaveTextContent("Administrator access required.");
  expect(screen.queryByRole("article")).not.toBeInTheDocument();
});

test("pagination and status changes request the correct page without keeping the old page number", async () => {
  rows = Array.from({ length: 21 }, (_, index) => ({
    ...initialRequest, _id: "request-" + index, dog: { ...dog, name: "Dog " + index },
  }));
  renderPage();
  await screen.findByRole("article", { name: "Dog 0 - Ada Lovelace" });
  fireEvent.click(screen.getByRole("button", { name: "Next page" }));
  await screen.findByRole("article", { name: "Dog 20 - Ada Lovelace" });
  expect(screen.getByText("21-21 of 21")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Request status"), { target: { value: "approved" } });
  await screen.findByText("No requests match this status.");
  expect(global.fetch).toHaveBeenLastCalledWith(
    API_BASE_URL + "/adoptions?status=approved&limit=20&offset=0", expect.any(Object)
  );
});

test("navigation aborts an unfinished decision and ignores a late success response", async () => {
  let finish;
  reviewHandler = () => new Promise((resolve) => { finish = resolve; });
  const page = renderPage();
  const dialog = await choose();
  fireEvent.click(within(dialog).getByRole("button", { name: "Confirm approval" }));
  const signal = patchCalls()[0][1].signal;
  page.unmount();
  expect(signal.aborted).toBe(true);
  renderPage();
  await screen.findByRole("article", { name: "Luna - Ada Lovelace" });
  await act(async () => finish(response(200, { _id: "request-id", status: "approved", closedRequests: 0 })));
  expect(screen.queryByText("Approved the adoption of Luna.")).not.toBeInTheDocument();
});
