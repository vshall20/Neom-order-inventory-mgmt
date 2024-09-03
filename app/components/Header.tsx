'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (pathname === '/login') {
    return null;
  }

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image src="/next.svg" alt="Logo" width={40} height={40} />
            <span className="text-2xl font-bold tracking-tight">Order Management</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-blue-200 transition duration-300">
              Dashboard
            </Link>
            <Link href="/add-order" className="text-sm font-medium hover:text-blue-200 transition duration-300">
              Add Order
            </Link>
            <Link href="/add-user" className="text-sm font-medium hover:text-blue-200 transition duration-300">
              Add User
            </Link>
            {user && (
              <button 
                onClick={handleLogout} 
                className="text-sm font-medium bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-full transition duration-300"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}