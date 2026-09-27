import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";
import profileReducer from "./redux/reducers/profileReducer";
import { API_BASE_URL } from "./api/client";

jest.mock("./components/Home/Home", () => () => <h1>Woof Paws home</h1>);

const user = {
  _id: "d9428888-122b-4c11-8c11-000000000001", name: "Ada", surname: "Lovelace",
  email: "ada@example.com", age: 30, description: "Looking to adopt.", picture: null, role: "user",
};
const token = "adoption-test-token";
const luna = {
  _id: "00000000-0000-4000-8000-000000000101", name: "Luna", breed: "Husky",
  age: 3, gender: "female", weight: 21.5, description: "Friendly.", isNeutered: true,
  isAdopted: false, images: [{ url: "/demo-dogs/luna.jpg" }],
};
const milo = { ...luna, _id: "00000000-0000-4000-8000-000000000102",
  name: "Milo", breed: "Beagle", age: 0.8, gender: "male", isNeutered: false };
const adoption = (dogId = luna._id) => ({
  _id: "request-" + dogId, dogId, status: "pending",
  createdAt: "2026-09-27T12:00:00.000Z", updatedAt: "2026-09-27T12:00:00.000Z",
});
const response = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body });
const originalFetch = global.fetch;
let savedRequests;
let availableDogs;
let submitHandler;
let listingHandler;

function renderMain(profile = user, accessToken = token) {
  window.history.replaceState({}, "", "/main");
  const store = configureStore({
    reducer: { loadedProfile: profileReducer },
    preloadedState: { loadedProfile: { isAuthenticated: true, currentUser: profile, accessToken } },
  });
  return { store, ...render(<Provider store={store}><App /></Provider>) };
}

function successfulSubmission(options) {
  const created = adoption(JSON.parse(options.body).dogId);
  savedRequests.push(created);
  return response(201, created);
}

const postCalls = () => global.fetch.mock.calls.filter(([url, options]) =>
  url === API_BASE_URL + "/adoptions" && options.method === "POST");

async function openModal(name = "Luna") {
  const card = await screen.findByRole("article", { name });
  const button = within(card).getByRole("button", { name: /I want to adopt/ });
  await waitFor(() => expect(button).toBeEnabled());
  fireEvent.click(button);
  return screen.findByRole("dialog", { name: "Adoption request for " + name });
}

beforeEach(() => {
  savedRequests = [];
  availableDogs = [luna, milo];
  submitHandler = successfulSubmission;
  listingHandler = (url) => {
    const offset = Number(url.searchParams.get("offset") || 0);
    return response(200, savedRequests.slice(offset, offset + 100));
  };
  global.fetch = jest.fn(async (url, options = {}) => {
    const parsed = new URL(url);
    if (parsed.pathname === "/users/me") return response(200, user);
    if (parsed.pathname === "/dogs") {
      // Fresh objects and a changed order catch state keyed by object identity.
      const rows = parsed.searchParams.get("sort") === "age" ? [...availableDogs].reverse() : availableDogs;
      return response(200, rows.map((dog) => ({ ...dog })));
    }
    if (parsed.pathname === "/adoptions/me") return listingHandler(parsed, options);
    if (parsed.pathname === "/adoptions" && options.method === "POST") return submitHandler(options);
    throw new Error("Unexpected API request: " + url);
  });
});
afterEach(() => { global.fetch = originalFetch; });

test("one confirmation modal names the selected dog and cancellation sends no request", async () => {
  renderMain();
  const dialog = await openModal("Milo");
  expect(screen.getAllByRole("dialog")).toHaveLength(1);
  expect(within(dialog).getByText(/Submitting it does not confirm an adoption/)).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(postCalls()).toHaveLength(0);
  expect(screen.queryByText("Pending review")).not.toBeInTheDocument();
});

test("submission waits for success, prevents double clicks and restores only that dog's status after remount", async () => {
  let finishSubmission;
  submitHandler = (options) => new Promise((resolve) => {
    finishSubmission = () => resolve(successfulSubmission(options));
  });
  const firstPage = renderMain();
  const dialog = await openModal();
  const submit = within(dialog).getByRole("button", { name: "Submit adoption request" });
  fireEvent.click(submit);
  fireEvent.click(submit);
  await waitFor(() => expect(postCalls()).toHaveLength(1));
  expect(within(dialog).getByRole("button", { name: "Submitting..." })).toBeDisabled();
  expect(within(dialog).getByRole("button", { name: "Cancel" })).toBeDisabled();
  expect(screen.queryByText("Pending review")).not.toBeInTheDocument();
  const [url, options] = postCalls()[0];
  expect(url).toBe(API_BASE_URL + "/adoptions");
  expect(options.headers).toEqual({ "Content-Type": "application/json", Authorization: "Bearer " + token });
  expect(JSON.parse(options.body)).toEqual({ dogId: luna._id });
  await act(async () => finishSubmission());
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(within(screen.getByRole("article", { name: "Luna" })).getByText("Pending review")).toBeInTheDocument();
  const otherDialog = await openModal("Milo");
  fireEvent.click(within(otherDialog).getByRole("button", { name: "Cancel" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(within(screen.getByRole("article", { name: "Luna" })).getByText("Pending review")).toBeInTheDocument();

  firstPage.unmount();
  renderMain();
  await screen.findByText("Pending review");
  expect(within(screen.getByRole("article", { name: "Luna" })).queryByRole("button")).not.toBeInTheDocument();
  expect(within(screen.getByRole("article", { name: "Milo" })).getByRole("button", { name: /I want to adopt/ })).toBeEnabled();
  expect(postCalls()).toHaveLength(1);
});

test("sorting and neutered filtering retain the request status by dog ID", async () => {
  savedRequests = [adoption()];
  renderMain();
  await screen.findByText("Pending review");
  fireEvent.change(screen.getByLabelText("Sort by:"), { target: { value: "age" } });
  await waitFor(() => expect(screen.getAllByRole("article").map((card) => card.getAttribute("aria-label"))).toEqual(["Milo", "Luna"]));
  expect(within(screen.getByRole("article", { name: "Luna" })).getByText("Pending review")).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText("Neutered only"));
  await waitFor(() => expect(screen.queryByRole("article", { name: "Milo" })).not.toBeInTheDocument());
  expect(screen.getByText("Pending review")).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText("Neutered only"));
  await screen.findByRole("article", { name: "Milo" });
  expect(within(screen.getByRole("article", { name: "Luna" })).getByText("Pending review")).toBeInTheDocument();
});

test.each(["server", "network"])("%s submission failures keep the modal open and allow a real retry", async (failure) => {
  submitHandler = () => {
    if (failure === "network") throw new TypeError("Failed to fetch");
    return response(500, { message: "An unexpected error occurred." });
  };
  renderMain();
  const dialog = await openModal();
  fireEvent.click(within(dialog).getByRole("button", { name: "Submit adoption request" }));
  expect(await within(dialog).findByRole("alert")).toHaveTextContent(
    failure === "network" ? "Cannot connect to the server." : "An unexpected error occurred."
  );
  expect(within(dialog).getByRole("button", { name: "Submit adoption request" })).toBeEnabled();
  expect(screen.queryByText("Pending review")).not.toBeInTheDocument();
  submitHandler = successfulSubmission;
  fireEvent.click(within(dialog).getByRole("button", { name: "Submit adoption request" }));
  await screen.findByText("Pending review");
  expect(postCalls()).toHaveLength(2);
});

test("a duplicate conflict reloads the stored request instead of inventing success", async () => {
  submitHandler = () => {
    savedRequests = [adoption()];
    return response(409, { message: "You have already requested adoption of this dog." });
  };
  renderMain();
  const dialog = await openModal();
  await act(async () => {
  fireEvent.click(within(dialog).getByRole("button", { name: "Submit adoption request" }));
  });
  expect(await within(dialog).findByRole("alert")).toHaveTextContent("already requested adoption");
  expect(within(dialog).getByRole("button", { name: "Submit adoption request" })).toBeDisabled();
  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(within(screen.getByRole("article", { name: "Luna" })).getByText("Pending review")).toBeInTheDocument();
  expect(postCalls()).toHaveLength(1);
});

test("an unavailable-dog conflict refreshes dogs without displaying a pending request", async () => {
  submitHandler = () => {
    availableDogs = [milo];
    return response(409, { message: "This dog is no longer available for adoption." });
  };
  renderMain();
  const dialog = await openModal();
  await act(async () => {
  fireEvent.click(within(dialog).getByRole("button", { name: "Submit adoption request" }));
  });
  expect(await within(dialog).findByRole("alert")).toHaveTextContent("no longer available");
  await waitFor(() => expect(within(dialog).getByRole("button", { name: "Submit adoption request" })).toBeDisabled());
  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(screen.queryByRole("article", { name: "Luna" })).not.toBeInTheDocument();
  expect(screen.queryByText("Pending review")).not.toBeInTheDocument();
  expect(screen.getByRole("article", { name: "Milo" })).toBeInTheDocument();
});

test("failed request lookup blocks submission until retry succeeds", async () => {
  listingHandler = () => response(500, { message: "An unexpected error occurred." });
  renderMain();
  expect(await screen.findByRole("alert")).toHaveTextContent("We could not check your adoption requests.");
  const card = await screen.findByRole("article", { name: "Luna" });
  expect(within(card).getByRole("button", { name: /I want to adopt/ })).toBeDisabled();
  expect(postCalls()).toHaveLength(0);
  listingHandler = () => response(200, [adoption()]);
  fireEvent.click(screen.getByRole("button", { name: "Retry loading requests" }));
  await screen.findByText("Pending review");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(within(screen.getByRole("article", { name: "Milo" })).getByRole("button", { name: /I want to adopt/ })).toBeEnabled();
});

test.each(["lookup", "submission"])("a 401 during %s clears the session and explains the return to login", async (phase) => {
  if (phase === "lookup") listingHandler = () => response(401, { message: "Authentication required." });
  else submitHandler = () => response(401, { message: "Authentication required." });
  const { store } = renderMain();
  if (phase === "submission") {
    const dialog = await openModal();
    fireEvent.click(within(dialog).getByRole("button", { name: "Submit adoption request" }));
  }
  await screen.findByRole("heading", { name: "Login" });
  expect(screen.getByRole("alert")).toHaveTextContent("Your session has expired. Please log in again.");
  expect(store.getState().loadedProfile).toMatchObject({
    accessToken: null, currentUser: null, isAuthenticated: false,
  });
  expect(window.location.pathname).toBe("/login");
});

test("request history beyond the first page still disables an existing dog's adoption action", async () => {
  savedRequests = [
    ...Array.from({ length: 100 }, (_, index) => adoption("older-dog-" + index)),
    adoption(),
  ];
  renderMain();
  await screen.findByText("Pending review");
  const reads = global.fetch.mock.calls.filter(([url]) => url.includes("/adoptions/me?"));
  expect(reads.map(([url]) => url)).toEqual([
    API_BASE_URL + "/adoptions/me?limit=100&offset=0",
    API_BASE_URL + "/adoptions/me?limit=100&offset=100",
  ]);
  expect(reads.every(([, options]) => options.headers.Authorization === "Bearer " + token)).toBe(true);
  expect(within(screen.getByRole("article", { name: "Luna" })).queryByRole("button")).not.toBeInTheDocument();
});

test("reviewed requests show their actual status and do not allow a second application", async () => {
  savedRequests = [{ ...adoption(), status: "approved" }, { ...adoption(milo._id), status: "rejected" }];
  renderMain();
  await screen.findByText("Request approved");
  expect(screen.getByText("Request declined")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /I want to adopt/ })).not.toBeInTheDocument();
});

test("leaving the page aborts an unfinished submission and a later mount reads the server afresh", async () => {
  let finishSubmission;
  submitHandler = () => new Promise((resolve) => { finishSubmission = resolve; });
  const first = renderMain();
  const dialog = await openModal();
  fireEvent.click(within(dialog).getByRole("button", { name: "Submit adoption request" }));
  await waitFor(() => expect(postCalls()).toHaveLength(1));
  const signal = postCalls()[0][1].signal;
  first.unmount();
  expect(signal.aborted).toBe(true);
  renderMain();
  await openModal("Milo");
  // Simulate a late response even if a transport ignores the abort signal.
  await act(async () => finishSubmission(response(201, adoption())));
  expect(screen.queryByText("Pending review")).not.toBeInTheDocument();
  expect(first.store.getState().loadedProfile).not.toHaveProperty("adoptionRequest");
});
