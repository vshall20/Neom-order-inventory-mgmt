import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { data: areas, error: areasError } = await supabase
      .from('areas')
      .select('id, name');

    const { data: orderTypes, error: orderTypesError } = await supabase
      .from('order_types')
      .select('id, name');

    if (areasError || orderTypesError) {
      return res.status(400).json({ error: areasError?.message || orderTypesError?.message });
    }

    res.status(200).json({ areas, orderTypes });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}