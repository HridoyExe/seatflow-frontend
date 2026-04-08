import { createContext, useContext } from "react";
import useAuth from "../hooks/useAuth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const allContext = useAuth();

  return (
    <AuthContext.Provider value={allContext}>{children}</AuthContext.Provider>
  );
};

// Helper hook to consume the shared context
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};