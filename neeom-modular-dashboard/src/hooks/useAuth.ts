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
  const refreshTimeoutRef = useRef<number | null>(null);

  const loadUser = useCallback(async () => {
    if (pb.authStore.isValid) {
      try {
        const authData = await pb.collection("users").authRefresh();
        setUser({
          id: authData.record.id,
          email: authData.record.email,
          role: authData.record.role,
        });
        setIsAuthenticated(true);
      } catch (error: unknown) {
        console.error("Failed to refresh auth:", error);
        if (error instanceof Error && 'status' in error && error.status === 401) {
          pb.authStore.clear();
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    loadUser();

    const unsubscribe = pb.authStore.onChange(() => {
      loadUser();
    });

    return () => {
      unsubscribe();
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [loadUser]);

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
  }, []);

  return { user, isAuthenticated, login, logout };
};
