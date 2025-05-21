// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import secureAxios from "../utils/secureAxios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true); // prevent UI flicker on load

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
    await secureAxios.post("/auth/logout", {}, { withCredentials: true });
    setUser(null);
    setAccessToken("");
  };

  // ✅ Refresh on load
  const refresh = async () => {
    try {
      const res = await secureAxios.get("/auth/refresh", {
        withCredentials: true,
      });
      setUser(res.data.user || null); // if user is returned
      setAccessToken(res.data.accessToken || "");
    } catch (err) {
      console.warn("No active session:", err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        register,
        logout,
        refresh,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
