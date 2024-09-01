import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Navbar() {
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      router.push('/login')
    }
  }

  return (
    <nav>
      <Link href="/">Dashboard</Link>
      <Link href="/orders">Orders</Link>
      <button onClick={handleSignOut}>Sign Out</button>
    </nav>
  )
}
