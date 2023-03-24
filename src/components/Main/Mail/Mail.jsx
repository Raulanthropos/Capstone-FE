// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// export async function sendEmail(email) {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASS,
//       },
//     });
  
//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: `${email}`,
//       subject: "Welcome to Woof Paws",
//       text: "Thank You for your interest in fostering one of our doggos! Our team will review your application, and get back to you as soon as possible.",
//       html: `<html>
//       <head>
//         <meta charset="utf-8">
//         <style amp4email-boilerplate>body{visibility:hidden}</style>
//         <script async src="https://cdn.ampproject.org/v0.js"></script>
//         <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
//       </head>
//       <body>
//         <h1>Thank you for your interest in one of our dogs!</h1>
//         <img src="https://raw.githubusercontent.com/Raulanthropos/Capstone-FE/main/public/images/logo.PNG" alt="logo" height=60% width=60%/>
//         <h2>Sincerely,<br>The Woof Paws Team</h2>
  
//       </body>
//     </html>`,
//     };
  
//     try {
//       let info = await transporter.sendMail(mailOptions);
//       console.log("Email sent: " + info.response);
//     } catch (error) {
//       console.log(error);
//     }
//   }
  
//   module.exports = {
//     sendEmail,
//   };
  