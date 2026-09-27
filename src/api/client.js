export const API_BASE_URL = (
  process.env.REACT_APP_API_URL || "http://127.0.0.1:3001"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(API_BASE_URL + path, options);
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError("Cannot connect to the server. Please try again.", 0);
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.errors?.[0]?.message || data?.message || "The request could not be completed.";
    throw new ApiError(message, response.status);
  }
  return data;
}
