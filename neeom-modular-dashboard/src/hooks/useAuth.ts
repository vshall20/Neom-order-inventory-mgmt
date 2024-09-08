import { useState, useEffect, useCallback } from "react";
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
      } catch (error) {
        console.error("Failed to refresh auth:", error);
        if (error.status === 401) {
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
    };
  }, [loadUser]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);
      setUser({
        id: authData.record.id,
        email: authData.record.email,
        role: authData.record.role,
      });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
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
