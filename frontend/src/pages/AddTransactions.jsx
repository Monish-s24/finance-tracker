import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AddTransaction() {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState('expense');
  const [notes, setNotes] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get('/categories').then(r => setCategories(r.data)).catch(()=>setCategories([]));
  }, []);

  async function submit(e) {
    e.preventDefault();
    await API.post('/transactions', { amount, category_id: categoryId || null, type, notes });
    window.location.href = '/dashboard';
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Transaction</h2>
      <form onSubmit={submit}>
        <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required /><br/>
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          <option value="">--Choose category (optional)--</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
        </select><br/>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select><br/>
        <input placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} /><br/>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
