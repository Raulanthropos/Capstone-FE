import { apiRequest } from "./client";

export function inboxRequest(path, token, { body, method = "GET", signal } = {}) {
  return apiRequest("/inbox" + path, {
    method, signal,
    headers: { Authorization: "Bearer " + token, ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

export async function getNotificationSummary(token, signal) {
  const data = await inboxRequest("/notifications?limit=1", token, { signal });
  if (!Number.isInteger(data?.unread)) throw new Error("Notifications could not be loaded.");
  return data.unread;
}
