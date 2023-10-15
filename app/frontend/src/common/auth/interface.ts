import React from "react";

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthContextType {
  isAuthenticated: boolean;
}
