/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// const { doc, getDoc } = require('firebase/firestore'); 

require('dotenv').config();
const {SENDER_EMAIL, SENDER_PASSWORD} = process.env;

const mailTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Your SMTP server
    port: 465,
    secure: true, // True for 465, false for other ports
    auth: {
      user: SENDER_EMAIL, // Your email
      pass: SENDER_PASSWORD, // Your email password
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

exports.deleteOldGames = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const db = admin.firestore();
  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - 24); // 24 hours ago

  const oldGamesQuery = db.collection('Games').where('date', '<=', cutoffDate);
  
  const snapshot = await oldGamesQuery.get();
  
  const batch = db.batch();
  
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  console.log(`Deleted ${snapshot.size} old game documents.`);
});

//   exports.sendClubCreationEmail = functions.firestore.document('Clubs/{clubId}')
//   .onCreate(async (snap, context) => {
//       console.log('New club created: sending email');
//       const newClubData = snap.data();
//       const organizerId = newClubData.organizer;
  
//       try {
//           const organizerRef = doc(db, 'Users', organizerId);
//           const organizerSnap = await getDoc(organizerRef);
  
//           if (!organizerSnap.exists()) {
//               console.error(`Organizer with ID ${organizerId} not found`);
//               return; 
//           }
  
//           const organizerEmail = organizerSnap.get('email'); // Fetch the 'email' field
  
//           if (!organizerEmail) {
//               console.error(`Organizer ${organizerId} does not have an email address.`);
//               return;
//           }
  
//           const mailOptions = {
//               from: '"Recess" <torriporter@recessleagues.com>',
//               to: organizerEmail, 
//               subject: 'Congrats on creating your club!',
//               text: `Hey ${organizerSnap.get('firstName') || 'Organizer'}, Your club "${newClubData.name}" has been created!`, // Customize with firstName if available
//               html: `<h1>Hey ${organizerSnap.get('firstName') || 'Organizer'},</h1><p>Your club "${newClubData.name}" has been created!</p>`, 
//           };
  
//           await mailTransport.sendMail(mailOptions); 
//           console.log(`Club creation email sent to: ${organizerEmail}`);
  
//       } catch (error) {
//           console.error('Error fetching organizer email or sending email:', error);
//       }
//   });
