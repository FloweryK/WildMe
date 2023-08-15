import React, { ReactNode, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Navigate, Outlet, redirect, useNavigate } from "react-router-dom";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  isAuthenticated: boolean;
}

interface AuthWrapperProps {}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const isAuthenticated = !!cookies.accessToken;
  console.log(cookies.accessToken);
  console.log(isAuthenticated);
  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthWrapper: React.FC<AuthWrapperProps> = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return <Outlet />;
};
