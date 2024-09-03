'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../utils/supabaseClient';

interface Order {
  id: string;
  order_id: string;
  party_id: string;
  area: { name: string };
  order_type: { name: string };
  order_quantity: number;
  sqft: number;
  order_date: string;
  current_status: string;
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<{ [key: string]: number }>({});
  const [ordersByStatus, setOrdersByStatus] = useState<{ [key: string]: number }>({});
  const [dailyWork, setDailyWork] = useState<{ [key: string]: number }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            area:areas(name),
            order_type:order_types(name),
            current_status:statuses(name)
          `);

        if (error) {
          throw error;
        }

        setOrders(data || []);
        setFilteredOrders(data || []);
        calculateMetrics(data || []);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An error occurred while fetching orders');
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order => 
      (order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.party_id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === '' || order.current_status === statusFilter)
    );
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const calculateMetrics = (orders: Order[]) => {
    const pending: { [key: string]: number } = {};
    const byStatus: { [key: string]: number } = {};
    const daily: { [key: string]: number } = {};

    orders.forEach(order => {
      // Pending Orders
      if (order.current_status !== 'Completed') {
        pending[order.order_type.name] = (pending[order.order_type.name] || 0) + 1;
      }

      // Orders by Status
      byStatus[order.current_status] = (byStatus[order.current_status] || 0) + 1;

      // Daily Work (assuming current date for simplicity)
      if (new Date(order.order_date).toDateString() === new Date().toDateString()) {
        daily[order.current_status] = (daily[order.current_status] || 0) + 1;
      }
    });

    setPendingOrders(pending);
    setOrdersByStatus(byStatus);
    setDailyWork(daily);
  };

  if (error) {
    return (
      <main className="container mx-auto mt-8 px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto mt-8 px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricsCard title="Pending Orders" data={pendingOrders} />
        <MetricsCard title="Orders by Status" data={ordersByStatus} />
        <MetricsCard title="Daily Work" data={dailyWork} />
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">Orders</h2>
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by Order ID or Party ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Statuses</option>
          {Object.keys(ordersByStatus).map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      {filteredOrders.length === 0 ? (
        <p>No orders found. Please add some orders to get started.</p>
      ) : (
        <ul className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
          {filteredOrders.map((order) => (
            <li key={order.id} className="p-4 hover:bg-gray-50 transition duration-150">
              <h3 className="font-bold">{order.order_id}</h3>
              <p>Party: {order.party_id}</p>
              <p>Area: {order.area.name}</p>
              <p>Type: {order.order_type.name}</p>
              <p>Quantity: {order.order_quantity}</p>
              <p>SqFt: {order.sqft}</p>
              <p>Date: {new Date(order.order_date).toLocaleDateString()}</p>
              <p>Status: {order.current_status}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function MetricsCard({ title, data }: { title: string; data: { [key: string]: number } }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <ul>
        {Object.entries(data).map(([key, value]) => (
          <li key={key} className="flex justify-between items-center mb-2">
            <span>{key}</span>
            <span className="font-bold">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}