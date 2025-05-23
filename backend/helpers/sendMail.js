
const nodemailer = require('nodemailer');
module.exports.sendMail = (email,subject,html) => {
const transporter = nodemailer.createTransport({
    service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  }
});

// Configure the mailoptions object
const mailOptions = {
  from: 'baovlhe172612@fpt.edu.vn',
  to: email,
  subject: subject,
  html: html
};

// Send the email
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log('Error occurred. ' + error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}