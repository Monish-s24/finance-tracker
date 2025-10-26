const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const q = 'SELECT id, name, type FROM categories WHERE user_id = $1 ORDER BY name';
  const r = await db.query(q, [req.user.userId]);
  res.json(r.rows);
});

router.post('/', auth, async (req, res) => {
  const { name, type } = req.body;
  const q = 'INSERT INTO categories (user_id, name, type) VALUES ($1,$2,$3) RETURNING id, name, type';
  const r = await db.query(q, [req.user.userId, name, type]);
  res.json(r.rows[0]);
});

module.exports = router;
