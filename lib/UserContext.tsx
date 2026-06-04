"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export interface UserData {
  name: string;
  email: string;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export function useUser() {
  return useContext(UserContext);
}

const STORAGE_KEY = "nexus_user";

function normalizeSessionUser(sessionUser: any): UserData | null {
  if (!sessionUser) return null;
  const name =
    sessionUser.user_metadata?.full_name ||
    sessionUser.user_metadata?.name ||
    sessionUser.email?.split("@")[0] ||
    "Student";
  const email = sessionUser.email || "";
  return { name, email };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const persistUser = (data: UserData | null) => {
    setUserState(data);
    if (typeof window === "undefined") return;
    if (data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (typeof window === "undefined") return;

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setUserState(JSON.parse(stored));
        }
      } catch {
        // ignore parse errors
      }

      if (supabase) {
        const { data } = await supabase.auth.getSession();
        const sessionUser = normalizeSessionUser(data?.session?.user || null);
        if (sessionUser && mounted) {
          persistUser(sessionUser);
        }
      }

      if (mounted) {
        setHydrated(true);
      }
    };

    initialize();

    const { data: authListener } =
      supabase?.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          persistUser(normalizeSessionUser(session.user));
        } else {
          persistUser(null);
        }
      }) ?? { data: null };

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  const setUser = (data: UserData | null) => {
    persistUser(data);
  };

  const logout = () => {
    if (supabase) {
      supabase.auth.signOut();
    }
    persistUser(null);
  };

  if (!hydrated) return null;

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
