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
    setPendingOrders([{ id: 1, type: 'Sample Order' }])
    setOrdersByStatus({ pending: 5, processing: 3, completed: 2 })
    setDailyWork([{ task: 'Sample Task', status: 'In Progress' }])
  }

  if (!user) return <div>Loading...</div>

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Pending Orders</h2>
      <ul>
        {pendingOrders.map(order => (
          <li key={order.id}>{order.type}</li>
        ))}
      </ul>
      <h2>Orders by Status</h2>
      <ul>
        {Object.entries(ordersByStatus).map(([status, count]) => (
          <li key={status}>{status}: {count}</li>
        ))}
      </ul>
      <h2>Daily Work</h2>
      <ul>
        {dailyWork.map((work, index) => (
          <li key={index}>{work.task}: {work.status}</li>
        ))}
      </ul>
    </div>
  )
}
