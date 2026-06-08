const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    let transporter;

    // Use Ethereal for development if no SMTP credentials configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }

    const mailOptions = {
      from: `"Voleergo Jobs" <${process.env.SMTP_USER || 'noreply@voleergo.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log preview URL for Ethereal
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('📧 Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    console.log('📧 Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    // Don't throw — email failure shouldn't break the app flow
  }
};

const getStatusEmailHtml = (candidateName, jobTitle, company, status, note) => {
  const statusColors = {
    'Applied': '#6366f1',
    'Reviewing': '#f59e0b',
    'Shortlisted': '#10b981',
    'Interview': '#3b82f6',
    'Offered': '#22c55e',
    'Rejected': '#ef4444'
  };

  const statusMessages = {
    'Applied': 'Your application has been received.',
    'Reviewing': 'Your application is currently being reviewed.',
    'Shortlisted': 'Congratulations! You have been shortlisted.',
    'Interview': 'Great news! You have been selected for an interview.',
    'Offered': 'Congratulations! You have received a job offer!',
    'Rejected': 'Unfortunately, your application was not selected to move forward.'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; color: white; }
        .body { padding: 32px; }
        .status-badge { display: inline-block; padding: 8px 20px; border-radius: 999px; font-weight: 600; font-size: 14px; color: white; background: ${statusColors[status] || '#6366f1'}; }
        .info { background: #0f172a; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .info p { margin: 8px 0; color: #94a3b8; }
        .info strong { color: #e2e8f0; }
        .message { color: #cbd5e1; line-height: 1.6; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; border-top: 1px solid #334155; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Application Status Update</h1>
        </div>
        <div class="body">
          <p class="message">Hi <strong>${candidateName}</strong>,</p>
          <p class="message">${statusMessages[status] || 'Your application status has been updated.'}</p>
          
          <div class="info">
            <p><strong>Position:</strong> ${jobTitle}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Status:</strong> <span class="status-badge">${status}</span></p>
            ${note ? `<p><strong>Note:</strong> ${note}</p>` : ''}
          </div>

          <p class="message">Log in to your Voleergo account to view more details about your application.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Voleergo. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = { sendEmail, getStatusEmailHtml };
