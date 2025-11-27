"use client";
import { IUser } from "@/types/user.type";
import React, { createContext, useEffect, useState } from "react";

type UserContextType = {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  userLoading: boolean;
};

type Props = {
  children: React.ReactNode;
};

const UserContext = createContext<UserContextType | null>(null);

const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const provideValue = {
    user,
    setUser,
    userLoading: loading,
  };

  // Reusable fetch function
  const refetchUser = async () => {
    try {
      const res = await fetch("/api/member/me", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Fetch user error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchUser();
  }, []);

  return (
    <UserContext.Provider value={provideValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

export default UserProvider;
