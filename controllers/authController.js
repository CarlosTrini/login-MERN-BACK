const path = require("path");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });

const authModel = require("../models/authModel");
const sendConfirmEmail = require("../mails/confirmEmail");
const forgotPassEmail = require("../mails/forgotPassEmail");

// ++++++++++++++++++++++ +++++++++++ LOGIN CONTROLLER
const loginController = async (req, res) => {
  try {
    let userExists = null;
    let areEquals = false;
    let userData = {}; //can be use in the frontEnd

    //check if userExists and get data
    try {
      userExists = await authModel.findOne({ user: req.body.user });
      if (!userExists)
        return res
          .status(400)
          .json({ error: true, msg: "Este usuario no existe" });
    } finally {
    }


    //check if user email has been confirmed
    const isConfirmed = userExists.confirmemail;
    if(!isConfirmed) return res.status(400).json({error:true, msg: 'No puedes acceder hasta confirmar tu registro visitando el enlace que te fue enviado a tu correo'});


    //check if the passwords are the same
    try {
      areEquals = await bcryptjs.compareSync(
        req.body.password,
        userExists.password
      );
      if (!areEquals)
        return res
          .status(400)
          .json({ error: true, msg: "Revisar usuario o contraseña" });
    } finally {
    }

    //set userData for the frontEnd
    userData = {
      name: userExists.name,
      _id: userExists._id,
      user: userExists.user,
      email: userExists.email,
    };

    //generate json-web-token
    const payload = {
      _id: userExists._id,
      name: userExists.name,
      user: userExists.user,
    };

    jwt.sign(
      payload,
      `${process.env.SECRET_PASSWORD_JWT}`,
      {
        expiresIn: "1d",
      },
      (error, token) => {
        console.log("TOKEN ERROR ==> ", error);
        return error
          ? res.status(500).json({
              error: true,
              msg: "Ha ocurrido un error, intenta más tarde o comunicate con el administrador",
            })
          : res.status(200).json({ error: false, msg: { token, userData } });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      msg: "Ha ocurrido un error, intenta más tarde o comunicate con el administrador",
    });
  }
};

// ++++++++++++++++++++++ +++++++++++ REGISTER CONTROLLER

const registerController = async (req, res) => {
  // check passwords
  const areEquals = req.body.password === req.body.passwordCheck;
  if (!areEquals)
    return res
      .status(400)
      .json({ error: true, msg: "Contraseñas no coinciden" });

  //encrypt pass
  const salt = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(req.body.password, salt);

  //create new userObj
  //dataUser will be saved NOT req.body
  const dataUser = { ...req.body, password: hash };
  delete dataUser.passwordCheck;

  try {
    //check if the email already exists
    try {
      const emailExists = await authModel.findOne({ email: dataUser.email });
      if (emailExists)
        return res
          .status(400)
          .json({ error: true, msg: "Este email ya existe" });
    } finally {
    }

    //check if the user already exists
    try {
      const userExists = await authModel.findOne({ user: dataUser.user });
      if (userExists)
        return res
          .status(400)
          .json({ error: true, msg: "Este usuario ya existe" });
    } finally {
    }

    //create new user
    const newUser = new authModel(dataUser);
    //save user
    await newUser.save();
    await sendConfirmEmail(dataUser.email);
    res.status(200).json({
      error: false,
      msg: "El usuario ha sido registrado... Por favor revisa tu correo eléctronico para poder confirmar tu correo",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      msg: "Ha ocurrido un error, intenta más tarde o comunicate con el administrador",
    });
  }
};

// ++++++++++++++++++++++ +++++++++++ CONFIRM-EMAIL-CONTROLLER
const confirmEmailController = async (req, res) => {
  const emailConfirm = req.confirmEmail.email;

  try {
    await authModel.updateOne({ email: emailConfirm }, { confirmemail: true });
    return res.sendFile(
      path.resolve(__dirname, "../templates/confirmEmail.html")
    );
  } catch (error) {
    console.log("ERROR UPDATE EMAIL-CONFIRM ==>", error);
    res
      .status(500)
      .send(
        "Algo falló al intentar validar el token. Contacte al administrador"
      );
  }
};

// ++++++++++++++++++++++ +++++++++++ FORGOT PASSWORD
const forgotPassControllerPOST = async (req, res) => {
  const email = req.body.email;

  try {
    const wasSent = await forgotPassEmail(email);

    if (!wasSent)
      return res.status(500).json({
        error: true,
        msg: "Ocurrió un error al interntar enviar mensaje de recuperación. Inteta más tarde",
      });

    res.status(500).json({
      error: false,
      msg: "Hemos enviado un mensaje a tu correo. Ve  para poder continuar",
    });
  } catch (error) {
    console.log("FORGOT PASS EMAIL ==>", error);
    if (!wasSent)
      res.status(500).json({
        error: true,
        msg: "Ocurrió un error al interntar enviar mensaje de recuperación. Inteta más tarde",
      });
  }
};

const forgotPassControllerGET = (req, res) => {
  res
    .status(200)
    .sendFile(path.resolve(__dirname, "../templates/forgotPassword.html"));
};

const forgotPassControllerPUT = async(req, res) => {
  // check passwords
  const areEquals = req.body.password === req.body.passwordCheck;
  if (!areEquals)
    return res
      .status(400)
      .json({ error: true, msg: "Contraseñas no coinciden" });

  //encrypt pass
  const salt = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(req.body.password, salt);

  try {
    const response = await authModel.findOneAndUpdate(
      { email: req.body.email },
      { password: hash }
    );
    if (!response) return res.status(400).json({error: true, msg: 'Error al localizar este correo'});

   res.status(200).json({error:false, msg: 'Tu contraseña ha sido actualizada!'});

  } catch (error) {
     console.log('ERROR FORGOT PASS ==> ', error);
     res.status(500).json({
      error: true,
      msg: "Ocurrió un error al interntar enviar mensaje de recuperación. Inteta más tarde",
    });
  }
};

module.exports = {
  loginController,
  registerController,
  confirmEmailController,
  forgotPassControllerPOST,
  forgotPassControllerGET,
  forgotPassControllerPUT,
};
