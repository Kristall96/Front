// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import secureAxios from "../utils/secureAxios";

const AuthContext = createContext(null); // explicitly set default null

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Refresh session on mount
  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await secureAxios.get("/auth/refresh", {
          withCredentials: true,
        });
        setUser(res.data.user || null); // ✅ Make sure backend returns this
        setAccessToken(res.data.accessToken || "");
      } catch (err) {
        console.warn("Session expired:", err.message);
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
    await secureAxios.post("/auth/logout", {}, { withCredentials: true });
    setUser(null);
    setAccessToken("");
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

// ✅ Safe hook: throws clear error if used outside provider
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
};
