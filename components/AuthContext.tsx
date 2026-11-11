"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import LoginModal from "./LoginModal";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: "tenant" | "landlord";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: Omit<User, "id">) => void;
  signup: (userData: Omit<User, "id">) => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedUser = localStorage.getItem("digital_tolet_auth");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse stored auth user:", e);
      }
    }
  }, []);

  const login = (userData: Omit<User, "id">) => {
    const fullUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    setUser(fullUser);
    localStorage.setItem("digital_tolet_auth", JSON.stringify(fullUser));
    setIsLoginModalOpen(false);
  };

  const signup = (userData: Omit<User, "id">) => {
    const fullUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    setUser(fullUser);
    localStorage.setItem("digital_tolet_auth", JSON.stringify(fullUser));
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("digital_tolet_auth");
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user: isMounted ? user : null,
        login,
        signup,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </AuthContext.Provider>
  );
}
