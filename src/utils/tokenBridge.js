import axios from "axios";

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
    // Use custom refresh function if defined
    return await refreshFn();
  }
  // Default: use built-in POST
  try {
    const response = await axios.post(
      "/api/auth/refresh",
      {},
      { withCredentials: true }
    );
    const { accessToken } = response.data;
    setAccessTokenBridge(accessToken);
    return accessToken;
  } catch (err) {
    setAccessTokenBridge("");
    throw err;
  }
};
