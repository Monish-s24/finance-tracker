const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// create
router.post('/', auth, async (req, res) => {
  const { amount, category_id, type, notes, txn_date } = req.body;
  const q = `INSERT INTO transactions (user_id, category_id, amount, type, notes, txn_date)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
  const r = await db.query(q, [req.user.userId, category_id || null, amount, type, notes || null, txn_date || new Date().toISOString().slice(0,10)]);
  res.json(r.rows[0]);
});

// list
router.get('/', auth, async (req, res) => {
  const { start, end, limit = 100 } = req.query;
  let q = `SELECT t.*, c.name as category_name FROM transactions t LEFT JOIN categories c ON c.id = t.category_id
           WHERE t.user_id = $1`;
  const params = [req.user.userId];
  if (start) { params.push(start); q += ` AND txn_date >= $${params.length}`; }
  if (end)   { params.push(end);   q += ` AND txn_date <= $${params.length}`; }
  q += ` ORDER BY txn_date DESC LIMIT ${parseInt(limit,10)}`;
  const r = await db.query(q, params);
  res.json(r.rows);
});

// summary
router.get('/summary', auth, async (req, res) => {
  const totalQ = `SELECT SUM(CASE WHEN type='income' THEN amount ELSE -amount END) as net_total FROM transactions WHERE user_id=$1`;
  const catQ = `SELECT c.name, c.type, SUM(t.amount) as total
                FROM transactions t JOIN categories c ON c.id = t.category_id
                WHERE t.user_id=$1 GROUP BY c.name, c.type ORDER BY total DESC`;
  const totalR = await db.query(totalQ, [req.user.userId]);
  const catR = await db.query(catQ, [req.user.userId]);
  res.json({ net: totalR.rows[0], categories: catR.rows });
});

module.exports = router;
