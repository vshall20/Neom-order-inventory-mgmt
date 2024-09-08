import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PocketBase from 'pocketbase';
import { useAuth } from '../hooks/useAuth';

const pb = new PocketBase('http://127.0.0.1:8090');

interface Area {
  id: string;
  name: string;
}

interface OrderType {
  id: string;
  name: string;
}

const AddOrder: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    order_id: '',
    party_id: '',
    area: '',
    order_type: '',
    order_quantity: '',
    sqft: '',
    order_date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    created_by: user?.id || '',
  });
  const [areas, setAreas] = useState<Area[]>([]);
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAreasAndOrderTypes = async () => {
      try {
        const areasResult = await pb.collection('areas').getFullList<Area>();
        const orderTypesResult = await pb.collection('order_types').getFullList<OrderType>();
        setAreas(areasResult);
        setOrderTypes(orderTypesResult);
      } catch (error) {
        console.error('Error fetching areas and order types:', error);
      }
    };

    fetchAreasAndOrderTypes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pb.collection('orders').create(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="h-14 w-14 bg-indigo-500 rounded-full flex flex-shrink-0 justify-center items-center text-white text-2xl font-mono">+</div>
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <h2 className="leading-relaxed">Add New Order</h2>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose">Order ID</label>
                  <input
                    type="text"
                    name="order_id"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Order ID"
                    value={formData.order_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Party ID</label>
                  <input
                    type="text"
                    name="party_id"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Party ID"
                    value={formData.party_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Order Type</label>
                  <select
                    name="order_type"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    value={formData.order_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Order Type</option>
                    {orderTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Area</label>
                  <select
                    name="area"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Area</option>
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Order Quantity</label>
                  <input
                    type="number"
                    name="order_quantity"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Order Quantity"
                    value={formData.order_quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">SqFt</label>
                  <input
                    type="number"
                    name="sqft"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="SqFt"
                    value={formData.sqft}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Order Date</label>
                  <input
                    type="date"
                    name="order_date"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    value={formData.order_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="pt-4 flex items-center space-x-4">
                <button
                  className="bg-indigo-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                  type="submit"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrder;
