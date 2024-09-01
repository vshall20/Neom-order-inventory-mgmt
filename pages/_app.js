import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);

        if (event === 'SIGNED_IN' && currentUser) {
          router.push('/');
        }
        if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
      }
    );

    checkUser();

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const user = supabase.auth.user();
    setUser(user);
  }

  return (
    <Component {...pageProps} user={user} />
  );
}

export default MyApp;
