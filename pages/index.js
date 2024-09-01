import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Home({ user }) {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>You are logged in as: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
      {/* Add your dashboard content here */}
    </div>
  );
}
