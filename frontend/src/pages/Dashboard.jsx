import React, { useEffect, useState } from 'react';
import API from '../api';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

export default function Dashboard() {
  const [txns, setTxns] = useState([]);
  const [summary, setSummary] = useState(null);
  useEffect(() => load(), []);
  async function load() {
    try {
      const res = await API.get('/transactions');
      setTxns(res.data);
      const s = await API.get('/transactions/summary');
      setSummary(s.data);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      <p>Total transactions: {txns.length}</p>

      <section>
        <h3>Recent</h3>
        <ul>
          {txns.slice(0,20).map(t => (
            <li key={t.id}>{t.txn_date} • {t.category_name || '—'} • {t.type} • ₹{t.amount}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Summary</h3>
        {summary && <>
          <div>Net total: {summary.net?.net_total ?? 0}</div>
          <div style={{ width: 320 }}>
            <Pie data={{
              labels: summary.categories.map(c=>c.name),
              datasets: [{ data: summary.categories.map(c=>Number(c.total)) }]
            }} />
          </div>
        </>}
      </section>
    </div>
  );
}
