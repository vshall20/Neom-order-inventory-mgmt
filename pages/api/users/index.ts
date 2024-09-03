import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the user is authenticated and is an admin
  const { user, error: authError } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check if the user is an admin
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userError || userData?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Only admins can manage users.' });
  }

  switch (req.method) {
    case 'GET':
      return getUsers(req, res);
    case 'POST':
      return createUser(req, res);
    case 'PUT':
      return updateUser(req, res);
    case 'DELETE':
      return deleteUser(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, role } = req.body;

  try {
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (!authUser.user) {
      throw new Error('User creation failed');
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: authUser.user.id, email, role });

    if (profileError) throw profileError;

    res.status(201).json({ userId: authUser.user.id });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  const { id, email, role } = req.body;

  try {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ email, role })
      .eq('id', id);

    if (updateError) throw updateError;

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    // Delete user from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id as string);
    if (authError) throw authError;

    // Delete user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (profileError) throw profileError;

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}