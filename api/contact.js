import nodemailer from 'nodemailer';

// Notification setup: NodeMailer (Email)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export default async function handler(req, res) {
  // We only allow POST requests for this endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // CRITICAL: Check for credentials
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return res.status(500).json({ 
      error: 'Portfolio email system is not configured. Please add GMAIL_USER and GMAIL_APP_PASSWORD to Environment Variables.' 
    });
  }

  const notifyContent = `Portfolio Contact Submission\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
  
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 1. Send Email Notification
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Sending to yourself
      subject: `New Portfolio Message from ${name}`,
      text: notifyContent,
    });

    // 2. Send WhatsApp Notification via CallMeBot (If variables exist)
    if (process.env.CALLMEBOT_PHONE && process.env.CALLMEBOT_API_KEY) {
      try {
        const whatsappUrl = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(process.env.CALLMEBOT_PHONE)}&text=${encodeURIComponent(notifyContent)}&apikey=${encodeURIComponent(process.env.CALLMEBOT_API_KEY)}`;
        const waResponse = await fetch(whatsappUrl);
        if (!waResponse.ok) {
          console.error('CallMeBot WhatsApp notification failed:', await waResponse.text());
        }
      } catch (waErr) {
        console.error('WhatsApp fetch error:', waErr);
      }
    }

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });

  } catch (err) {
    console.error('Notification error:', err);
    return res.status(500).json({ 
      error: `Failed to send email: ${err.message}. Ensure App Password is correct.` 
    });
  }
}
