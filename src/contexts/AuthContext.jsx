import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const login = (tokens, user) => {
    const { accessToken, refreshToken, accessTokenExpiredAt, refreshTokenExpiredAt } = tokens;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("accessTokenExpiredAt", accessTokenExpiredAt);
    localStorage.setItem("refreshTokenExpiredAt", refreshTokenExpiredAt);
    localStorage.setItem("user", JSON.stringify(user));
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessTokenExpiredAt");
    localStorage.removeItem("refreshTokenExpiredAt");
    localStorage.removeItem("user");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
