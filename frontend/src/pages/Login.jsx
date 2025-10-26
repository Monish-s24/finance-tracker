import React, { useState } from 'react';
import API from '../api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [isRegister,setIsRegister] = useState(false);
  async function submit(e) {
    e.preventDefault();
    try {
      const url = `/auth/${isRegister ? 'register' : 'login'}`;
      const res = await API.post(url, { email, password });
      onLogin(res.data.token, res.data.user);
      window.location.href = '/dashboard';
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  }
  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /><br/>
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <p>
        <button onClick={() => setIsRegister(!isRegister)}>Switch to {isRegister ? 'Login' : 'Register'}</button>
      </p>
    </div>
  );
}
