const nodemailer = require('nodemailer')

/**
 * Create the nodemailer transporter using env variables
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

/**
 * Send an email verification link to the user
 * @param {string} toEmail - Recipient email address
 * @param {string} name - Recipient's name for personalizing the email
 * @param {string} verificationUrl - Full URL the user clicks to verify
 */
const sendVerificationEmail = async (toEmail, name, verificationUrl) => {
  const transporter = createTransporter()

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #030712; color: #f9fafb; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 40px auto; background: #111827; border-radius: 12px; overflow: hidden; border: 1px solid #374151; }
        .header { background: linear-gradient(135deg, #0369a1, #0ea5e9); padding: 32px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; color: #fff; letter-spacing: -0.5px; }
        .header p { margin: 4px 0 0; color: rgba(255,255,255,0.8); font-size: 13px; }
        .body { padding: 32px; }
        .body p { color: #d1d5db; line-height: 1.6; margin: 0 0 16px; }
        .btn { display: inline-block; background: #0ea5e9; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 8px 0 24px; }
        .note { font-size: 12px; color: #6b7280; border-top: 1px solid #374151; padding-top: 16px; }
        .footer { background: #1f2937; padding: 16px 32px; text-align: center; font-size: 12px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 DevTrack</h1>
          <p>Developer Study Tracker</p>
        </div>
        <div class="body">
          <p>Hey <strong>${name}</strong>,</p>
          <p>Welcome aboard! You're one click away from starting your coding journey with DevTrack. Please verify your email address to activate your account.</p>
          <a href="${verificationUrl}" class="btn">✅ Verify My Email</a>
          <p>This link will expire in <strong>24 hours</strong>.</p>
          <p class="note">If you didn't create a DevTrack account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          DevTrack — Built for developers preparing for technical interviews
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `"DevTrack" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '✅ Verify your DevTrack email',
    html,
  })
}

/**
 * Send a password reset email
 * @param {string} toEmail - Recipient email address
 * @param {string} name - Recipient's name
 * @param {string} resetUrl - Full URL to reset password
 */
const sendPasswordResetEmail = async (toEmail, name, resetUrl) => {
  const transporter = createTransporter()

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #030712; color: #f9fafb; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 40px auto; background: #111827; border-radius: 12px; overflow: hidden; border: 1px solid #374151; }
        .header { background: linear-gradient(135deg, #dc2626, #ef4444); padding: 32px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; color: #fff; letter-spacing: -0.5px; }
        .header p { margin: 4px 0 0; color: rgba(255,255,255,0.8); font-size: 13px; }
        .body { padding: 32px; }
        .body p { color: #d1d5db; line-height: 1.6; margin: 0 0 16px; }
        .btn { display: inline-block; background: #ef4444; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 8px 0 24px; }
        .note { font-size: 12px; color: #6b7280; border-top: 1px solid #374151; padding-top: 16px; }
        .footer { background: #1f2937; padding: 16px 32px; text-align: center; font-size: 12px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 DevTrack</h1>
          <p>Password Reset Request</p>
        </div>
        <div class="body">
          <p>Hey <strong>${name}</strong>,</p>
          <p>We received a request to reset your password. Click the button below to set a new password.</p>
          <a href="${resetUrl}" class="btn">🔑 Reset My Password</a>
          <p>This link will expire in <strong>15 minutes</strong>.</p>
          <p class="note">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        </div>
        <div class="footer">
          DevTrack — Built for developers preparing for technical interviews
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `"DevTrack" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🔐 Reset your DevTrack password',
    html,
  })
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail }
