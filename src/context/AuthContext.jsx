// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import secureAxios from "../utils/secureAxios";
import { setAccessTokenBridge, setRefreshFunction } from "../utils/tokenBridge";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);

  // Sync accessToken with axios bridge
  useEffect(() => {
    setAccessTokenBridge(accessToken);
  }, [accessToken]);

  // Provide refresh function to axios bridge
  useEffect(() => {
    setRefreshFunction(refreshAccessToken);
  }, []);

  // ✅ Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await secureAxios.post(
          "/auth/refresh",
          {},
          { withCredentials: true }
        );

        const { user, accessToken } = res.data;
        setUser(user);
        setAccessToken(accessToken);
        if (import.meta.env.DEV) {
          console.log("✅ Session restored:", user.email);
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn("⚠️ Session restore failed:", err.message);
        }
        setUser(null);
        setAccessToken("");
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ✅ Access Token Refresh Logic (called from Axios)
  const refreshAccessToken = async () => {
    const res = await secureAxios.post(
      "/auth/refresh",
      {},
      { withCredentials: true }
    );
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res.data.accessToken;
  };

  const login = async (email, password) => {
    const res = await secureAxios.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );
    setUser(res.data.user);
    setAccessToken(res.data.accessToken);
  };

  const register = async (formData) => {
    const res = await secureAxios.post("/auth/register", formData, {
      withCredentials: true,
    });
    setUser(res.data.user);
    setAccessToken(res.data.accessToken);
  };

  const logout = async () => {
    try {
      await secureAxios.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn("Logout error:", err.message);
      }
    } finally {
      setUser(null);
      setAccessToken("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <span className="text-sm text-gray-400">Checking session...</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
};
