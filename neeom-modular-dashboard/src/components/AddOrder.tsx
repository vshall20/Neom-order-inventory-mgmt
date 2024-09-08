import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PocketBase from 'pocketbase';

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
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState('');
  const [area, setArea] = useState('');
  const [orderDetails, setOrderDetails] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pb.collection('orders').create({
        customer_name: customerName,
        order_type: orderType,
        area: area,
        order_details: orderDetails,
      });
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
                  <label className="leading-loose">Customer Name</label>
                  <input
                    type="text"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Order Type</label>
                  <select
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
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
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
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
                  <label className="leading-loose">Order Details</label>
                  <textarea
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    rows={4}
                    placeholder="Enter order details"
                    value={orderDetails}
                    onChange={(e) => setOrderDetails(e.target.value)}
                    required
                  ></textarea>
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
