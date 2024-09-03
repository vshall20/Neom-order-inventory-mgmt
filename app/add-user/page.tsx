'use client';

import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function AddUserPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('User added successfully');
    } else {
      setMessage(`Error: ${data.error}`);
    }
  };

  return (
    <div className="add-user-container">
      <form onSubmit={handleSubmit} className="add-user-form">
        <h2>Add User</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="add-user-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="add-user-input"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="add-user-select"
        >
          <option value="Admin">Admin</option>
          <option value="Member">Member</option>
        </select>
        <button type="submit" className="add-user-button">Add User</button>
        {message && <p className="message">{message}</p>}
      </form>
      <style jsx>{`
        .add-user-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f0f2f5;
        }
        .add-user-form {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .add-user-form h2 {
          margin-bottom: 1rem;
        }
        .add-user-input, .add-user-select {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .add-user-button {
          width: 100%;
          padding: 0.5rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .add-user-button:hover {
          background-color: #005bb5;
        }
        .message {
          margin-top: 1rem;
          color: green;
        }
      `}</style>
    </div>
  );
}