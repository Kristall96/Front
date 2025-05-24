// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import secureAxios from "../utils/secureAxios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Refresh session on initial load
  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await secureAxios.get("/auth/refresh", {
          withCredentials: true,
        });

        const { user, accessToken } = res.data;
        if (user && accessToken) {
          setUser(user);
          setAccessToken(accessToken);
          if (import.meta.env.DEV)
            console.log("✅ Session restored:", user.email);
        } else {
          if (import.meta.env.DEV)
            console.warn("⚠️ Invalid /auth/refresh response");
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          const msg = err.response?.data?.message || err.message;
          console.warn("⚠️ Refresh failed:", msg);
        }
        setUser(null);
        setAccessToken("");
      } finally {
        setLoading(false);
      }
    };

    refresh();
  }, []);

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
      if (import.meta.env.DEV) console.warn("Logout error:", err.message);
    } finally {
      setUser(null);
      setAccessToken("");
    }
  };

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
      {!loading && children}
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
