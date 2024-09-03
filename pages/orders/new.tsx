import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function NewOrder() {
  const [formData, setFormData] = useState({
    party_id: '',
    area_id: '',
    order_type_id: '',
    order_quantity: '',
    sqft: '',
    order_date: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = useSupabaseClient();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      router.push('/orders');
    } else {
      const data = await response.json();
      setError(data.error || 'An error occurred while creating the order.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create New Order</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="party_id">Party ID:</label>
        <input type="text" id="party_id" name="party_id" value={formData.party_id} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="area_id">Area:</label>
        <select id="area_id" name="area_id" value={formData.area_id} onChange={handleChange} required>
          <option value="">Select an area</option>
          {/* Populate options from your areas table */}
        </select>
      </div>
      <div>
        <label htmlFor="order_type_id">Order Type:</label>
        <select id="order_type_id" name="order_type_id" value={formData.order_type_id} onChange={handleChange} required>
          <option value="">Select an order type</option>
          {/* Populate options from your order_types table */}
        </select>
      </div>
      <div>
        <label htmlFor="order_quantity">Order Quantity:</label>
        <input type="number" id="order_quantity" name="order_quantity" value={formData.order_quantity} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="sqft">SqFt:</label>
        <input type="number" id="sqft" name="sqft" value={formData.sqft} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="order_date">Order Date:</label>
        <input type="date" id="order_date" name="order_date" value={formData.order_date} onChange={handleChange} required />
      </div>
      <button type="submit">Create Order</button>
    </form>
  );
}