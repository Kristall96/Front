// src/utils/tokenBridge.js
let token = "";
let refreshFn = null;

export const setAccessTokenBridge = (newToken) => {
  token = newToken;
};

export const getAccessTokenBridge = () => token;

export const setRefreshFunction = (fn) => {
  refreshFn = fn;
};

export const runTokenRefresh = async () => {
  if (refreshFn) {
    return await refreshFn();
  }
  throw new Error("Refresh function not available");
};
