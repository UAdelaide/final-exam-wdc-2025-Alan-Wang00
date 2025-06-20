const express = require('express');
const router = express.Router();
const axios = require('axios');



const db = require('./db');


router.get('/api/dogs', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT d.name AS dog_name, d.size, u.username AS owner_username
       FROM Dogs d
       JOIN Users u ON d.owner_id = u.user_id`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        wr.request_id,
        d.name AS dog_name,
        wr.requested_time,
        wr.duration_minutes,
        wr.location
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      WHERE wr.status = 'open'
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});


router.get('/api/walkers/summary', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        u.username AS walker_username,
        COUNT(wr.rating_id) AS total_ratings,
        ROUND(AVG(wr.rating), 1) AS average_rating,
        COUNT(DISTINCT wq.request_id) AS completed_walks
      FROM Users u
      LEFT JOIN WalkRatings wr ON u.user_id = wr.walker_id
      LEFT JOIN WalkApplications wa ON u.user_id = wa.walker_id AND wa.status = 'accepted'
      LEFT JOIN WalkRequests wq ON wa.request_id = wq.request_id AND wq.status = 'completed'
      WHERE u.role = 'walker'
      GROUP BY u.user_id, u.username
      ORDER BY u.username
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/api/dogs/randomimage', async (req, res) => {
  try {
    const response = await axios.get('https://dog.ceo/api/breeds/image/random');

    res.json({ image: response.data.message });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dog image' });
  }
});
module.exports = router;
