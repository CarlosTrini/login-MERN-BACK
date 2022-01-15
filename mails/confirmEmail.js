const nodemailer = require("nodemailer");
require('dotenv').config('.env');
const confirmEmailToken = require('../generateTokens/confirmEmailToken');

// ++++++++++++++++++++++ +++++++++++ SEND-CONFIRM-EMAIL

const sendConfirmEmail = async (email) => {
   const token = await confirmEmailToken(email);
   if (!token) return false;
 
   //token generated
   const url = `${process.env.API_PATH}/confirm-email/${token}` ||  `http://localhost:4500/api/fake-site/confirm-email/${token}`;
   const transporter = nodemailer.createTransport({
    host: `${process.env.HOST_EMAIL_NODEMAILER}`,
     port: 587,
     secure: false,
     auth: {
       user: `${process.env.APP_EMAIL_NODEMAILER}`,
       pass: `${process.env.APP_PASSWORD_NODEMAILER}`,
     },
   });
 
   try {
     await transporter.sendMail({
      from: `"login MERN" <${process.env.FROM_EMAIL_NODEMAILER}>`, // sender address
       to: email, // list of receivers
       subject: "Registro exitoso", // Subject line
       html: `
               <b>Ahora estás registrado a nuestro sitio (fake). Gracias!</b>
               <b>Para verificar tu correo, entra al siguiente enlace y terminar el proceso</b>
               <a href=${url}>${url}</a>
              <br>
               <small> Tu correo será eliminado de la base de datos de este login dentro de unas horas... Gracias</small>
            `, // html body
     });
     
     return true;
   } catch (error) {
     console.log("SEND EMAIL ERROR ==> ", error);
   }
 };


 module.exports= sendConfirmEmail;