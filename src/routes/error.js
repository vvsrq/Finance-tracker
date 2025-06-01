const express = require('express');
const router = express.Router();

router.get('/error', (req, res) => {
  res.status(500).send('Simulated error');
});

module.exports = router;