// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import secureAxios from "../utils/secureAxios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Try to refresh access token on initial load
  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await secureAxios.get("/auth/refresh", {
          withCredentials: true,
        });

        if (res.data?.user && res.data?.accessToken) {
          setUser(res.data.user);
          setAccessToken(res.data.accessToken);
          console.log("✅ Session restored:", res.data.user.email);
        } else {
          console.warn("⚠️ Invalid session data returned from /auth/refresh");
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.message;
        console.warn("⚠️ Refresh failed:", msg);
        setUser(null);
        setAccessToken("");
      } finally {
        setLoading(false);
      }
    };

    refresh();
  }, []);

  // ✅ Login
  const login = async (email, password) => {
    const res = await secureAxios.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );
    setUser(res.data.user);
    setAccessToken(res.data.accessToken);
  };

  // ✅ Register
  const register = async (formData) => {
    const res = await secureAxios.post("/auth/register", formData, {
      withCredentials: true,
    });
    setUser(res.data.user);
    setAccessToken(res.data.accessToken);
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await secureAxios.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.warn("Logout error:", err.message);
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
