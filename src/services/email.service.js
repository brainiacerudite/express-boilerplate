const nodemailer = require("nodemailer");
const config = require("../config");

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: config.mail.port === 465,
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
});

const sendEmail = async (data) => {
  const mailOptions = {
    from: `${config.mail.from.name} <${config.mail.from.email}>`,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  };

  return await transporter.sendMail(mailOptions);
};

// Email Templates
const sendVerificationEmail = async (email, token, expiresIn) => {
  const htmlContent = `
    <h1>Verify your account</h1>
    <p>Your verification code is:</p>
    <h2>${token}</h2>
    <p>This code will expire in ${expiresIn} minutes.</p>
  `;

  await sendEmail({
    to: email,
    subject: "Verify your email",
    html: htmlContent,
  });
};

const sendPasswordResetEmail = async (email, token, expiresIn) => {
  const htmlContent = `
    <h1>Password Reset</h1>
    <p>Your password reset code is:</p>
    <h2>${token}</h2>
    <p>This code will expire in ${expiresIn} minutes.</p>
  `;

  await sendEmail({
    to: email,
    subject: "Password Reset",
    html: htmlContent,
  });
};

const emailService = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
};
module.exports = emailService;
