const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const authRoutes = require('./routes/authRoutes');

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Root check
app.get('/', (req, res) => {
  res.send('Workflow-Pro Backend (CommonJS) is Running ✅');
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/invite', async (req, res) => {
  const { email, teamName, inviter } = req.body;

  const mailOptions = {
    from: `"Workflow-Pro" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `You're invited to join the team "${teamName}" on Workflow-Pro`,
    html: `
      <p>Hi there,</p>
      <p><strong>${inviter}</strong> invited you to join the team "<strong>${teamName}</strong>" on <strong>Workflow-Pro</strong>.</p>
      <p>Click the link below to accept the invitation:</p>
      <p><a href="https://your-app-url.com/signup">Join Now</a></p>
      <p>If you don’t have an account, you can sign up for free.</p>
      <br/>
      <p>– The Workflow-Pro Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Invitation sent!' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

// MongoDB (optional)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log('MongoDB connected');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
