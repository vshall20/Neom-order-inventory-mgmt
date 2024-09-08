import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090'); // Replace with your Pocketbase URL

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setIsAuthenticated(pb.authStore.isValid);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};
