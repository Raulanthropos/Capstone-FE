import { apiRequest } from "../../api/client";

export const SET_USER_INFO = "SET_USER_INFO";
export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN";
export const SET_AUTHENTICATED = "SET_AUTHENTICATED";
export const UPDATE_USER = "UPDATE_USER";
export const DELETE_USER = "DELETE_USER";
export const LOG_OUT_USER = "LOG_OUT_USER";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

export const setAccessToken = (value) => ({ type: SET_ACCESS_TOKEN, payload: value });

// JWTs currently have no server-side session to revoke. Clear this browser's
// session without calling the legacy MongoDB logout endpoint.
export const logoutUser = () => ({ type: LOG_OUT_USER });

async function readProfile(accessToken) {
  const user = await apiRequest("/users/me", {
    headers: { Authorization: "Bearer " + accessToken },
  });
  if (!user?._id) throw new Error("Your profile could not be loaded. Please log in again.");
  return user;
}

export const getAccessToken = (credentials) => async (dispatch) => {
  dispatch(logoutUser());
  const result = await apiRequest("/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!result?.accessToken) throw new Error("Login could not be completed. Please try again.");
  const user = await readProfile(result.accessToken);
  // Publish one complete session only after both requests succeed.
  dispatch({ type: LOGIN_SUCCESS, payload: { user, accessToken: result.accessToken } });
};

export const restoreSession = () => async (dispatch, getState) => {
  const accessToken = getState().loadedProfile.accessToken;
  if (!accessToken) {
    dispatch(logoutUser());
    return;
  }
  try {
    const user = await readProfile(accessToken);
    dispatch({ type: LOGIN_SUCCESS, payload: { user, accessToken } });
  } catch {
    dispatch(logoutUser());
  }
};

// These endpoints are still awaiting backend migration.
export const updateUser = (user) => async (dispatch, getState) => {
  const updatedUser = await apiRequest("/users/" + user._id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getState().loadedProfile.accessToken,
    },
    body: JSON.stringify({
      name: user.name, surname: user.surname, email: user.email,
      description: user.description, picture: user.picture,
    }),
  });
  dispatch({ type: UPDATE_USER, payload: updatedUser });
};

export const deleteUser = (accessToken, userId) => async (dispatch) => {
  await apiRequest("/users/" + userId, {
    method: "DELETE", headers: { Authorization: "Bearer " + accessToken },
  });
  dispatch(logoutUser());
};
