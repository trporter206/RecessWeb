/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const mailTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Your SMTP server
    port: 465,
    secure: true, // True for 465, false for other ports
    auth: {
      user: 'tr.porter206@gmail.com', // Your email
      pass: 'kaiatvcabdphfrrf', // Your email password
    },
});

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
    const email = user.email; // The email of the user.
    const displayName = user.displayName || 'New User';
  
    const mailOptions = {
      from: '"Recess" <torriporter@recessleagues.com>',
      to: email,
      subject: 'Welcome to Recess!',
      text: `Hello ${displayName}! Welcome to our app. We're glad you're here.`,
      html: `<h1>Hello ${displayName}!</h1><p>Welcome to our app. We're glad you're here.</p>`,
    };
  
    return mailTransport.sendMail(mailOptions)
      .then(() => console.log(`Welcome email sent to: ${email}`))
      .catch((error) => console.error('There was an error while sending the email:', error));
  });