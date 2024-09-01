import Head from 'next/head'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

export default function Home() {
  const supabase = useSupabaseClient()
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) console.log('Error fetching users:', error)
    else setUsers(data)
  }

  return (
    <div>
      <Head>
        <title>Order Management App</title>
        <meta name="description" content="Order Management App for Modular Kitchen Company" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Welcome to Order Management App
        </h1>

        <div>
          <h2>Users from Supabase:</h2>
          <ul>
            {users.map(user => (
              <li key={user.id}>{user.email}</li>
            ))}
          </ul>
        </div>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Next.js and Supabase
        </a>
      </footer>
    </div>
  )
}
