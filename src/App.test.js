import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";
import profileReducer from "./redux/reducers/profileReducer";
import { API_BASE_URL } from "./api/client";

jest.mock("./components/Home/Home", () => () => <h1>Woof Paws home</h1>);

const user = {
  _id: "d9428888-122b-4c11-8c11-000000000001",
  name: "Ada", surname: "Lovelace", email: "ada@example.com",
  age: 30, description: "I would like to adopt a dog.", picture: null, role: "user",
};
const token = "test-access-token";
const originalFetch = global.fetch;
const response = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body });

function renderPage(path, session) {
  window.history.replaceState({}, "", path);
  const store = configureStore({
    reducer: { loadedProfile: profileReducer },
    ...(session ? { preloadedState: { loadedProfile: session } } : {}),
  });
  render(<Provider store={store}><App /></Provider>);
  return store;
}

function fillLogin() {
  fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: user.email } });
  fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: "Local-test-password-42" } });
}

function fillRegistration(password2 = "Local-test-password-42") {
  for (const [label, value] of [
    [/First Name/i, user.name], [/Last Name/i, user.surname], [/Email address/i, user.email],
    [/^Password/i, "Local-test-password-42"], [/Retype password/i, password2],
    [/^Age/i, String(user.age)], [/Description/i, user.description],
  ]) {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  }
}

beforeEach(() => {
  global.fetch = jest.fn();
  localStorage.clear();
});
afterEach(() => { global.fetch = originalFetch; });

test("register, login, profile and local logout work through the configured API", async () => {
  global.fetch
    .mockResolvedValueOnce(response(201, { _id: user._id }))
    .mockResolvedValueOnce(response(200, { user, accessToken: token }))
    .mockResolvedValueOnce(response(200, user));
  const store = renderPage("/register");
  await screen.findByRole("heading", { name: "Register" });
  fillRegistration();
  fireEvent.click(screen.getByRole("button", { name: "Register" }));
  await screen.findByRole("heading", { name: "Login" });

  const [registerUrl, registerOptions] = global.fetch.mock.calls[0];
  expect(registerUrl).toBe(API_BASE_URL + "/users/register");
  expect(registerOptions.body).toBeInstanceOf(FormData);
  expect(Object.fromEntries(registerOptions.body.entries())).toEqual({
    name: user.name, surname: user.surname, email: user.email, age: "30",
    password: "Local-test-password-42", description: user.description,
  });

  fillLogin();
  fireEvent.click(screen.getByRole("button", { name: "Login" }));
  await screen.findByText("Ada Lovelace");
  expect(window.location.pathname).toBe("/users/me");
  expect(global.fetch.mock.calls[1][0]).toBe(API_BASE_URL + "/users/login");
  expect(JSON.parse(global.fetch.mock.calls[1][1].body)).toEqual({
    email: user.email, password: "Local-test-password-42",
  });
  expect(global.fetch.mock.calls[2]).toEqual([
    API_BASE_URL + "/users/me", { headers: { Authorization: "Bearer " + token } },
  ]);
  expect(store.getState().loadedProfile.isAuthenticated).toBe(true);
  expect(screen.getByRole("img", { name: "Profile" })).toHaveAttribute("src", "/images/ai-generated-user.jpeg");
  expect(screen.getByRole("button", { name: "Edit Profile" })).toBeDisabled();

  fireEvent.click(screen.getByRole("button", { name: "Logout" }));
  await screen.findByRole("heading", { name: "Login" });
  expect(store.getState().loadedProfile).toMatchObject({
    isAuthenticated: false, accessToken: null, currentUser: null,
  });
  expect(global.fetch).toHaveBeenCalledTimes(3);
});

test("registration keeps entered fields and displays the duplicate-email error", async () => {
  global.fetch.mockResolvedValueOnce(response(409, { message: "A user with this email already exists." }));
  renderPage("/register");
  await screen.findByRole("heading", { name: "Register" });
  fillRegistration();
  fireEvent.click(screen.getByRole("button", { name: "Register" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("A user with this email already exists.");
  expect(screen.getByLabelText(/Email address/i)).toHaveValue(user.email);
  expect(screen.getByLabelText(/First Name/i)).toHaveValue(user.name);
  expect(screen.getByRole("button", { name: "Register" })).toBeEnabled();
});

test("registration catches mismatched passwords before submitting", async () => {
  renderPage("/register");
  await screen.findByRole("heading", { name: "Register" });
  fillRegistration("another-password");
  fireEvent.click(screen.getByRole("button", { name: "Register" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Passwords do not match.");
  expect(global.fetch).not.toHaveBeenCalled();
});

test("wrong credentials leave the user on login with a visible error", async () => {
  global.fetch.mockResolvedValueOnce(response(401, { message: "Invalid email or password." }));
  const store = renderPage("/login");
  await screen.findByRole("heading", { name: "Login" });
  fillLogin();
  fireEvent.click(screen.getByRole("button", { name: "Login" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Invalid email or password.");
  expect(store.getState().loadedProfile.isAuthenticated).toBe(false);
  expect(store.getState().loadedProfile.accessToken).toBeNull();
  expect(window.location.pathname).toBe("/login");
});

test("login waits for the profile and does not store a partially authenticated session", async () => {
  let finishProfile;
  global.fetch.mockResolvedValueOnce(response(200, { accessToken: token }))
    .mockImplementationOnce(() => new Promise((resolve) => { finishProfile = resolve; }));
  const store = renderPage("/login");
  await screen.findByRole("heading", { name: "Login" });
  fillLogin();
  fireEvent.click(screen.getByRole("button", { name: "Login" }));
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  expect(screen.getByRole("button", { name: "Logging in..." })).toBeDisabled();
  expect(store.getState().loadedProfile.isAuthenticated).toBe(false);
  finishProfile(response(500, { message: "An unexpected error occurred." }));
  expect(await screen.findByRole("alert")).toHaveTextContent("An unexpected error occurred.");
  expect(store.getState().loadedProfile.accessToken).toBeNull();
  expect(window.location.pathname).toBe("/login");
});

test("an unavailable API produces a visible login error", async () => {
  global.fetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));
  renderPage("/login");
  await screen.findByRole("heading", { name: "Login" });
  fillLogin();
  fireEvent.click(screen.getByRole("button", { name: "Login" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Cannot connect to the server.");
});

test("a restored session loads a fresh profile instead of trusting persisted profile data", async () => {
  global.fetch.mockResolvedValueOnce(response(200, user));
  const store = renderPage("/users/me", {
    accessToken: token, isAuthenticated: true, currentUser: { ...user, name: "Old name" },
  });
  await screen.findByText("Ada Lovelace");
  expect(screen.queryByText(/Old name/)).not.toBeInTheDocument();
  expect(store.getState().loadedProfile.currentUser).toEqual(user);
  expect(global.fetch).toHaveBeenCalledWith(API_BASE_URL + "/users/me", {
    headers: { Authorization: "Bearer " + token },
  });
});

test("an expired stored token is cleared and the protected profile returns to login", async () => {
  global.fetch.mockResolvedValueOnce(response(401, { message: "Please log in again." }));
  const store = renderPage("/users/me", { accessToken: token, isAuthenticated: true, currentUser: user });
  await screen.findByRole("heading", { name: "Login" });
  expect(store.getState().loadedProfile.accessToken).toBeNull();
  expect(store.getState().loadedProfile.currentUser).toBeNull();
  expect(window.location.pathname).toBe("/login");
});

test("dog service unavailability displays a message instead of breaking the page", async () => {
  global.fetch.mockImplementation(async (url) => {
    if (url === API_BASE_URL + "/users/me") return response(200, user);
    if (url.startsWith(API_BASE_URL + "/adoptions/me?")) return response(200, []);
    return response(503, { message: "This feature is temporarily unavailable." });
  });
  renderPage("/main", { accessToken: token, isAuthenticated: true, currentUser: user });
  expect(await screen.findByRole("alert")).toHaveTextContent("Dogs are temporarily unavailable.");
  expect(global.fetch).toHaveBeenCalledWith(API_BASE_URL + "/dogs?sort=name", expect.objectContaining({ signal: expect.any(AbortSignal) }));
  expect(screen.getByText("Welcome, Ada!")).toBeInTheDocument();
});
