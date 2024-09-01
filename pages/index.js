import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [pendingOrders, setPendingOrders] = useState([])
  const [ordersByStatus, setOrdersByStatus] = useState({})
  const [dailyWork, setDailyWork] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    // Fetch pending orders, orders by status, and daily work
    // This is a placeholder and should be replaced with actual API calls
  }

  if (!user) return <div>Loading...</div>

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Display dashboard components here */}
    </div>
  )
}
