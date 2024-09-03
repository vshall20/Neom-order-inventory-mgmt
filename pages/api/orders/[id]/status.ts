import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { status, updated_by } = req.body;

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date() })
      .eq('id', id);

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    // Log order history
    const { error: historyError } = await supabase
      .from('order_history')
      .insert([{ order_id: id, status, updated_by, updated_at: new Date() }]);

    if (historyError) {
      return res.status(400).json({ error: historyError.message });
    }

    res.status(200).json({ message: 'Order status updated and history logged' });
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}