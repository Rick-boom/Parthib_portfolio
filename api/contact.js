import nodemailer from 'nodemailer';
import twilio from 'twilio';

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
  } catch (e) {
    console.error('Failed to init twilio:', e);
  }
}

export default async function handler(req, res) {
  // We only allow POST requests for this endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const notifyContent = `Portfolio Contact Submission\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
  
  try {
    // 1. Send Email Notification
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER, // Sending to yourself
        subject: `New Portfolio Message from ${name}`,
        text: notifyContent,
      });
    }

    // 2. Send WhatsApp Notification (If variables exist)
    if (twilioClient && process.env.TWILIO_WHATSAPP_FROM && process.env.YOUR_WHATSAPP_NUMBER) {
      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: process.env.YOUR_WHATSAPP_NUMBER,
        body: notifyContent,
      });
    }

    // Since we removed SQLite, successfully sending the messages means we are done!
    return res.status(200).json({ success: true, message: 'Message sent successfully.' });

  } catch (err) {
    console.error('Notification error:', err);
    return res.status(500).json({ error: 'Failed to send notifications. Check server configuration.' });
  }
}
