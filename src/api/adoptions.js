import { apiRequest } from "./client";

function isAdoptionRequest(value) {
  return value && typeof value._id === "string" && typeof value.dogId === "string" &&
    typeof value.status === "string";
}

export async function getMyAdoptionRequests(accessToken, signal) {
  const requests = [];
  const limit = 100;
  // Load every page: an existing request can be older than the first 100.
  for (let offset = 0; offset <= 100000; offset += limit) {
    const page = await apiRequest("/adoptions/me?limit=" + limit + "&offset=" + offset, {
      headers: { Authorization: "Bearer " + accessToken }, signal,
    });
    if (!Array.isArray(page) || page.length > limit || !page.every(isAdoptionRequest)) {
      throw new Error("Your adoption requests could not be loaded. Please try again.");
    }
    requests.push(...page);
    if (page.length < limit) return requests;
  }
  throw new Error("Your adoption requests could not be fully loaded. Please try again.");
}

export async function createAdoptionRequest(dogId, accessToken, signal) {
  const request = await apiRequest("/adoptions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + accessToken },
    body: JSON.stringify({ dogId }),
    signal,
  });
  if (!isAdoptionRequest(request) || request.dogId !== dogId) {
    throw new Error("The server did not confirm your request. Please try again.");
  }
  return request;
}
