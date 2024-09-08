import { useState, useEffect, useCallback, useRef } from "react";
import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

interface User {
  id: string;
  email: string;
  role: "admin" | "member";
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadUser = useCallback(async () => {
    if (pb.authStore.isValid && !user) {
      try {
        const authData = await pb.collection("users").authRefresh();
        setUser({
          id: authData.record.id,
          email: authData.record.email,
          role: authData.record.role,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to refresh auth:", error);
        if (error.status === 401) {
          pb.authStore.clear();
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } else if (!pb.authStore.isValid) {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [user]);

  const debouncedLoadUser = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    refreshTimeoutRef.current = setTimeout(loadUser, 30000);
  }, [loadUser]);

  useEffect(() => {
    debouncedLoadUser();

    const unsubscribe = pb.authStore.onChange(() => {
      debouncedLoadUser();
    });

    return () => {
      unsubscribe();
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [debouncedLoadUser]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);
      const userData = {
        id: authData.record.id,
        email: authData.record.email,
        role: authData.record.role,
      };
      setUser(userData);
      setIsAuthenticated(true);
      console.log("Login successful:", userData);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    pb.authStore.clear();
    setUser(null);
    setIsAuthenticated(false);
    // Force a reload of the application to ensure all states are reset
    window.location.href = "/";
  }, []);

  return { user, isAuthenticated, login, logout };
};
