import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import Nav from './components/Nav';
import { setAuthToken } from './api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  useEffect(() => setAuthToken(token), [token]);
  return (
    <BrowserRouter>
      <Nav onLogout={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); setToken(null); }} />
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<Login onLogin={(t,user) => { localStorage.setItem('token', t); localStorage.setItem('user', JSON.stringify(user)); setToken(t);} } />} />
        <Route path="/dashboard" element={ token ? <Dashboard /> : <Navigate to="/login" /> } />
        <Route path="/add" element={ token ? <AddTransaction /> : <Navigate to="/login" /> } />
      </Routes>
    </BrowserRouter>
  );
}
