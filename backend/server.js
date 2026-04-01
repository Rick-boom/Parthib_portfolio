require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Application middlewares
app.use(cors());
app.use(express.json());

// Notification setup: NodeMailer (Email)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Notification setup: Twilio (WhatsApp)
let twilioClient;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('Twilio WhatsApp initialized successfully.');
  } catch(e) {
    console.error('Failed to init twilio:', e);
  }
}

// Contact submission endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // Record submission into SQLite Database safely
  const isoDate = new Date().toISOString();
  db.run(
    `INSERT INTO messages (name, email, message, date) VALUES (?, ?, ?, ?)`,
    [name, email, message, isoDate],
    async function (sqliteErr) {
      if (sqliteErr) {
        console.error('Database insertion error:', sqliteErr);
        return res.status(500).json({ error: 'Failed to process inquiry in local storage.' });
      }

      // Concurrently dispatch notifications: Email + WA (if configured)
      const notifyContent = `Portfolio Contact Submission\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
      try {
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: process.env.GMAIL_USER, // The site owner
          subject: `New Portfolio Message from ${name}`,
          text: notifyContent,
        });

        if (twilioClient && process.env.TWILIO_WHATSAPP_FROM && process.env.YOUR_WHATSAPP_NUMBER) {
          await twilioClient.messages.create({
            from: process.env.TWILIO_WHATSAPP_FROM,
            to: process.env.YOUR_WHATSAPP_NUMBER,
            body: notifyContent,
          });
        }
        res.status(200).json({ success: true, message: 'Message securely passed and submitted.' });
      } catch (notifyErr) {
        console.error('Notification layer error:', notifyErr);
        // We do not fail the request if notification fails because db insertion was successful
        res.status(200).json({ success: true, message: 'Message saved securely, but notifications possibly interrupted.' });
      }
    }
  );
});

// Client queries their own messages. (Secret is needed from the query path)
app.get('/api/messages', (req, res) => {
  const { secret } = req.query;

  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Access Denied.' });
  }

  db.all('SELECT * FROM messages ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching contents' });
    }
    res.status(200).json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server live on http://localhost:${PORT}`);
});
