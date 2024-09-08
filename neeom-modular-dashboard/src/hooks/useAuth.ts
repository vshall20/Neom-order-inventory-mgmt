import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const loadUser = async () => {
      if (pb.authStore.isValid) {
        try {
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
        }
      }
    };

    loadUser();

    return pb.authStore.onChange((token, model) => {
      setIsAuthenticated(!!model);
      if (model) {
        setUser({
          id: model.id,
          email: model.email,
          role: model.role,
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  const login = async (email: string, password: string) => {
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
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, isAuthenticated, login, logout };
};
