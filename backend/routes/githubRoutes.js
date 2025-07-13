require('dotenv').config();

const express = require('express');
const axios = require('axios');
const router = express.Router();

// Access environment variables (they should be loaded by server.js)
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

// Debug environment variables in this file
console.log('=== GitHub Routes Environment Check ===');
console.log('CLIENT_ID:', CLIENT_ID ? 'Set ✅' : 'Missing ❌');
console.log('CLIENT_SECRET:', CLIENT_SECRET ? 'Set ✅' : 'Missing ❌');
console.log('CALLBACK_URL:', CALLBACK_URL || 'Missing ❌');
console.log('========================================');

// Step 1: Redirect to GitHub for authorization
router.get('/login', (req, res) => {
  // Validate environment variables
  if (!CLIENT_ID || !CLIENT_SECRET || !CALLBACK_URL) {
    console.error('Missing GitHub OAuth configuration in routes file');
    return res.status(500).json({
      error: 'Missing GitHub OAuth configuration',
      details: {
        CLIENT_ID: !!CLIENT_ID,
        CLIENT_SECRET: !!CLIENT_SECRET,
        CALLBACK_URL: !!CALLBACK_URL
      }
    });
  }

  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(CALLBACK_URL)}&scope=repo`;
  console.log('Redirecting to GitHub:', redirectUrl);
  res.redirect(redirectUrl);
});

// Step 2: GitHub redirects back with a code
router.get('/callback', async (req, res) => {
  const { code, error, error_description } = req.query;
  
  console.log('GitHub callback received:', { code: !!code, error, error_description });

  if (error) {
    console.error('GitHub OAuth error:', error, error_description);
    return res.status(400).json({
      error: 'GitHub OAuth error',
      details: error_description
    });
  }

  if (!code) {
    return res.status(400).json({
      error: 'Missing authorization code',
      query: req.query
    });
  }

  try {
    // Step 3: Exchange code for access token
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: CALLBACK_URL,
      },
      {
        headers: {
          accept: 'application/json',
        },
      }
    );

    console.log('GitHub token response:', tokenRes.data);

    const accessToken = tokenRes.data.access_token;
    const tokenError = tokenRes.data.error;

    if (tokenError) {
      console.error('Token exchange error:', tokenRes.data);
      return res.status(500).json({
        error: 'Token exchange failed',
        details: tokenRes.data
      });
    }

    if (!accessToken) {
      return res.status(500).json({
        error: 'Failed to retrieve access token',
        response: tokenRes.data
      });
    }

    // Step 4: Use access token to get user's GitHub profile
    const userRes = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const username = userRes.data.login;
    console.log('GitHub user authenticated:', username);
    
    // Redirect to frontend with success
    res.redirect(`http://localhost:3000/github-success?token=${accessToken}&username=${username}`);

  } catch (err) {
    console.error('GitHub OAuth error:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Authentication failed',
      details: err.response?.data || err.message
    });
  }
});

// Step 5: Get user's GitHub repos
router.get('/repos', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Missing GitHub token' });
  }

  try {
    const reposRes = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(reposRes.data);
  } catch (err) {
    console.error('Error fetching GitHub repos:', err.response?.data || err.message);
    res.status(500).json({ 
      message: 'Failed to fetch repositories',
      details: err.response?.data || err.message
    });
  }
});

module.exports = router;