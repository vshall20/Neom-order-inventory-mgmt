import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the user is authenticated
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Invalid authorization header format' });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized', details: authError?.message });
  }

  switch (req.method) {
    case 'GET':
      return getOrders(req, res, user);
    case 'POST':
      return createOrder(req, res, user);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getOrders(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      party:parties(name),
      area:areas(name),
      order_type:order_types(name),
      current_status:statuses(name)
    `)
    .order('order_date', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}

async function createOrder(req: NextApiRequest, res: NextApiResponse, user: any) {
  console.log('Received order data:', req.body);

  // Check if the user is an admin
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userError) {
    console.error('Error fetching user role:', userError);
    return res.status(500).json({ error: 'Internal server error' });
  }

  if (!userData || userData.role.toLowerCase() !== 'admin') {
    console.log('User role:', userData?.role);
    return res.status(403).json({ error: 'Forbidden. Only admins can create orders.' });
  }

  const { order_id, party_id, area_id, order_type_id, order_quantity, sqft, order_date } = req.body;

  // Validate input
  if (!order_id || !party_id || !area_id || !order_type_id || !order_quantity || !sqft || !order_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newOrder = {
    order_id,
    party_id,
    area_id,
    order_type_id,
    order_quantity,
    sqft,
    order_date,
    created_by: user.id,
    current_status_id: 1 // You might want to set an initial status here
  };

  console.log('Inserting new order:', newOrder);

  // Insert the new order
  const { data, error } = await supabase
    .from('orders')
    .insert(newOrder)
    .select()
    .single();

  if (error) {
    console.error('Error inserting order:', error);
    return res.status(500).json({ error: error.message });
  }

  console.log('Order inserted successfully:', data);

  // If the order was created successfully, add an entry to the order_status_logs table
  if (data) {
    const { error: logError } = await supabase
      .from('order_status_logs')
      .insert({
        order_id: data.id,
        status_id: data.current_status_id,
        updated_by: user.id
      });

    if (logError) {
      console.error('Failed to create status log:', logError);
    }
  }

  return res.status(201).json(data);
}