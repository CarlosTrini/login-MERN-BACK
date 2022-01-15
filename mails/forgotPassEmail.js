const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env" });

const forgotPassEmail = async(email) => {
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
    const url = `${process.env.API_PATH}/forgot-password` ||  `http://localhost:4500/api/fake-site/forgot-password`;
    await transporter.sendMail({
      from: `"login MERN" <${process.env.FROM_EMAIL_NODEMAILER}>`, // sender address
      to: email, // list of receivers
      subject: "Cambio de contraseña", // Subject line
      html: `
              <b>Has solicitado el cambio de contraseña del sition 'Login MERN'!</b>
              <br>
              <b>Si tu no estas registrado en este sitio o no solicitaste el cambio de contraseña, solo ignora este mensaje</b>
              <br>
              <a href=${url}>${url}</a>
           `, // html body
    });
    return true;
  } catch (error) {
    console.log("SEND EMAIL ERROR ==> ", error);
    return false; 
  }
};

module.exports = forgotPassEmail;
