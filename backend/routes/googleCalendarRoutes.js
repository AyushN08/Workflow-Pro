const express = require('express');
const { auth } = require('firebase-admin');
const { google } = require('googleapis');
const router = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Redirect user to consent screen
router.get('/login', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
    });
    res.redirect(authUrl);
});

// Handle callback
router.get('/callback', async (req, res) => {
    try {
        const code = req.query.code;
        
        if (!code) {
            return res.status(400).send('Authorization code missing');
        }

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Store tokens in session or database as needed
        res.redirect(`http://localhost:3000/google-calendar-success?access_token=${tokens.access_token}&token_type=${tokens.token_type || 'Bearer'}&expires_in=${tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600}`);
    } catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).send('OAuth callback failed');
    }
});

// Store Google Calendar token (NEW ROUTE)
router.post('/store-token', async (req, res) => {
    try {
        const { accessToken, tokenType, expiresIn, scope } = req.body;
        
        // Here you would typically:
        // 1. Validate the token
        // 2. Store it in your database associated with the user
        // 3. Set up refresh token logic
        
        console.log('Storing Google Calendar token:', {
            tokenType,
            expiresIn,
            scope,
            tokenPreview: accessToken.substring(0, 20) + '...'
        });
        
        // For now, just acknowledge receipt
        res.json({ 
            success: true,
            message: 'Google Calendar token stored successfully'
        });
    } catch (error) {
        console.error('Error storing Google Calendar token:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to store token'
        });
    }
});

// Get the upcoming events
router.get('/events', async (req, res) => {
    try {
        console.log('Events endpoint hit');
        console.log('Headers:', req.headers);
        
        const authHeader = req.headers.authorization;
        console.log('Auth header:', authHeader);
        
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token missing from authorization header' });
        }

        console.log('Token received:', token.substring(0, 20) + '...');

        // Set up OAuth2 client with the token
        oauth2Client.setCredentials({ access_token: token });
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        console.log('Fetching calendar events...');
        
        const result = await calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });

        console.log('Events fetched successfully:', result.data.items.length, 'events');
        
        // Make sure we're returning JSON with proper headers
        res.setHeader('Content-Type', 'application/json');
        res.json(result.data.items || []);
        
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        
        // Make sure error responses are also JSON
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ 
            error: 'Failed to fetch events', 
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router;