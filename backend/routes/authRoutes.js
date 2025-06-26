const express = require('express');
const admin = require('../firebase');

const router = express.Router();

// Signup (optional — mostly handled from frontend)
router.post('/signup', async (req, res) => {
  const { email, password, displayName } = req.body;
  try {
    const user = await admin.auth().createUser({
      email,
      password,
      displayName
    });

    res.status(201).json({ uid: user.uid, email: user.email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login — verifies Firebase ID token
router.post('/login', async (req, res) => {
  const { idToken } = req.body;
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    res.status(200).json({
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || ''
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
