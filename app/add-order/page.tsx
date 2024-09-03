'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';

interface Area {
  id: number;
  name: string;
}

interface OrderType {
  id: number;
  name: string;
}

export default function AddOrderPage() {
  const router = useRouter();
  const [areas, setAreas] = useState<Area[]>([]);
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    order_id: '',
    party_id: '',
    area_id: '',
    order_type_id: '',
    order_quantity: '',
    sqft: '',
    order_date: '',
  });

  useEffect(() => {
    fetchAreas();
    fetchOrderTypes();
    fetchUserRole();
  }, []);

  const fetchAreas = async () => {
    const { data, error } = await supabase.from('areas').select('*');
    if (error) console.error('Error fetching areas:', error);
    else setAreas(data || []);
  };

  const fetchOrderTypes = async () => {
    const { data, error } = await supabase.from('order_types').select('*');
    if (error) console.error('Error fetching order types:', error);
    else setOrderTypes(data || []);
  };

  const fetchUserRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No active session');
      return;
    }

    try {
      const response = await fetch('/api/user/role', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);
      } else {
        console.error('Error fetching user role:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No active session');
      return;
    }

    const newOrder = {
      ...formData,
      created_by: session.user.id,
    };

    console.log('Submitting new order:', newOrder);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(newOrder),
      });

      if (response.ok) {
        console.log('Order added successfully');
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        console.error('Error adding order:', errorData);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Add New Order</h1>
      {userRole && (
        <p className="mb-4">Your role: <strong>{userRole}</strong></p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="order_id" className="block mb-1">Order ID</label>
          <input
            type="text"
            id="order_id"
            name="order_id"
            value={formData.order_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="party_id" className="block mb-1">Party ID</label>
          <input
            type="text"
            id="party_id"
            name="party_id"
            value={formData.party_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="area_id" className="block mb-1">Area</label>
          <select
            id="area_id"
            name="area_id"
            value={formData.area_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select an area</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>{area.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="order_type_id" className="block mb-1">Order Type</label>
          <select
            id="order_type_id"
            name="order_type_id"
            value={formData.order_type_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select an order type</option>
            {orderTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="order_quantity" className="block mb-1">Quantity</label>
          <input
            type="number"
            id="order_quantity"
            name="order_quantity"
            value={formData.order_quantity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="sqft" className="block mb-1">Square Feet</label>
          <input
            type="number"
            id="sqft"
            name="sqft"
            value={formData.sqft}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="order_date" className="block mb-1">Order Date</label>
          <input
            type="date"
            id="order_date"
            name="order_date"
            value={formData.order_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Order
        </button>
      </form>
    </div>
  );
}