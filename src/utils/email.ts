import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html: string;
}

export async function sendEmail(options: EmailOptions) {
    try {
        const info = await transporter.sendMail({
            from: '"MonoCart" <no-reply@monocart.com>',
      ...options,
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Could not send email');
    }
}