import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContextType, AuthProviderProps } from "./interface";
import { cookie } from "store";

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const isAuthenticated = !!cookie.get("accessToken");
  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return <Outlet />;
};
