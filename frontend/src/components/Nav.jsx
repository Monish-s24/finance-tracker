import React from 'react';
export default function Nav({ onLogout }) {
  const token = localStorage.getItem('token');
  return (
    <nav style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
      <a href="/dashboard" style={{ marginRight: 12 }}>Dashboard</a>
      <a href="/add" style={{ marginRight: 12 }}>Add</a>
      {token ? <button onClick={onLogout}>Logout</button> : <a href="/login">Login</a>}
    </nav>
  );
}
