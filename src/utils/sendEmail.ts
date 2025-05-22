import * as sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY); 

export async function sendEmailBySendgrid(to: string, subject: string, text: string, html?: string) {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent to :', to);
    return true
  } catch (error) {
    console.error('SendGrid Error:', error.response?.body || error.message);
  }
}
