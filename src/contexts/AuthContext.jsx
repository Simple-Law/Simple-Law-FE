// // AuthContext.js
// import React, { createContext, useState, useContext } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [authToken, setAuthToken] = useState(localStorage.getItem("token"));

//   const login = token => {
//     localStorage.setItem("token", token);
//     setAuthToken(token);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setAuthToken(null);
//   };

//   return <AuthContext.Provider value={{ authToken, login, logout }}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);
// AuthContext.js
// AuthContext.js
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const login = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuthToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ authToken, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
