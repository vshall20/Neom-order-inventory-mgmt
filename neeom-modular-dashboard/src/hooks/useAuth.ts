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
      if (!user || user.id !== pb.authStore.model?.id) {
        try {
          const userData = pb.authStore.model;
          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
            });
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Failed to load user data:", error);
          pb.authStore.clear();
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [user]);

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

  return { user, isAuthenticated, login, logout, loadUser };
};
