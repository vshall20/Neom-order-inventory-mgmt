import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
    if (error) console.log('Error fetching orders:', error)
    else setOrders(data)
  }

  return (
    <div>
      <h1>Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Party ID</th>
            <th>Date</th>
            <th>Order Age</th>
            <th>Last Updated On</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.party_id}</td>
              <td>{order.date}</td>
              <td>{order.order_age}</td>
              <td>{order.last_updated_on}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
