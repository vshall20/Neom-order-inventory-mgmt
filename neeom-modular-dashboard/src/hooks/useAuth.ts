import { useState, useEffect, useCallback, useRef } from 'react';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

interface User {
  id: string;
  email: string;
  role: 'admin' | 'member';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
  const lastRefreshTime = useRef(0);
  const refreshTimeoutId = useRef<NodeJS.Timeout | null>(null);

  const loadUser = useCallback(async () => {
    if (pb.authStore.isValid && !user) {
      const now = Date.now();
      if (now - lastRefreshTime.current < 60000) {
        // If less than 1 minute has passed since the last refresh, don't refresh
        return;
      }

      try {
        lastRefreshTime.current = now;
        const authData = await pb.collection('users').authRefresh();
        setUser({
          id: authData.record.id,
          email: authData.record.email,
          role: authData.record.role,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to refresh auth:', error);
        pb.authStore.clear();
        setIsAuthenticated(false);
        setUser(null);
      }
    } else if (!pb.authStore.isValid) {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [user]);

  useEffect(() => {
    loadUser();

    const unsubscribe = pb.authStore.onChange(() => {
      if (refreshTimeoutId.current) {
        clearTimeout(refreshTimeoutId.current);
      }
      refreshTimeoutId.current = setTimeout(loadUser, 100);
    });

    return () => {
      unsubscribe();
      if (refreshTimeoutId.current) {
        clearTimeout(refreshTimeoutId.current);
      }
    };
  }, [loadUser]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      setUser({
        id: authData.record.id,
        email: authData.record.email,
        role: authData.record.role,
      });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
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
