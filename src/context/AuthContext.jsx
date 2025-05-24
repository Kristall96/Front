// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import secureAxios from "../utils/secureAxios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ On initial load, check refresh token
  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await secureAxios.get("/auth/refresh", {
          withCredentials: true,
        });
        setUser(res.data.user || null);
        setAccessToken(res.data.accessToken || "");
      } catch (err) {
        console.warn("Session expired or no refresh token:", err.message);
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
      {/* Prevent rendering until refresh is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
