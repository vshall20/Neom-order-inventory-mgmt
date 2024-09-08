import React, { useState } from 'react';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090'); // Replace with your Pocketbase URL

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      console.log(authData);
      // Handle successful login (e.g., redirect to dashboard)
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error (e.g., show error message)
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
