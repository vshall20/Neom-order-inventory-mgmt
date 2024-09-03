import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderTypeId } = req.query;

  if (req.method === 'GET') {
    const { data: statuses, error } = await supabase
      .from('order_statuses')
      .select('id, status')
      .eq('order_type_id', orderTypeId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ statuses });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}