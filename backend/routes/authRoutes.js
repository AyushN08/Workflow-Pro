const express = require('express');
const admin = require('../firebase'); // Your firebase admin config
const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }
    
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Here you can create a session, store user info, etc.
    // For now, just return success
    res.json({ 
      message: 'Login successful', 
      uid: uid,
      email: decodedToken.email 
    });
    
  } catch (error) {
    console.error('Login verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }
    
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Here you can save user to your database
    // For now, just return success
    res.json({ 
      message: 'Signup successful', 
      uid: uid,
      email: decodedToken.email 
    });
    
  } catch (error) {
    console.error('Signup verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;