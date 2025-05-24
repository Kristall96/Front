// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import secureAxios from "../utils/secureAxios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Restore session from refreshToken on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await secureAxios.get("/auth/refresh", {
          withCredentials: true,
        });

        const { user, accessToken } = res.data;
        if (user && accessToken) {
          setUser(user);
          setAccessToken(accessToken);
          if (import.meta.env.DEV) {
            console.log("✅ Session restored:", user.email);
          }
        } else {
          throw new Error("Invalid refresh response");
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          const msg = err.response?.data?.message || err.message;
          console.warn("⚠️ Session restore failed:", msg);
        }
        setUser(null);
        setAccessToken("");
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
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
      if (import.meta.env.DEV) {
        console.warn("Logout error:", err.message);
      }
    } finally {
      setUser(null);
      setAccessToken("");
    }
  };

  // ✅ Guard against UI rendering until session is known
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
