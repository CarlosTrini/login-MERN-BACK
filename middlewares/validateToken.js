require("dotenv").config({ path: ".env" });
const jwt = require("jsonwebtoken");

// ++++++++++++++++++++++++ VALIDATE TOKEN LOGIN
const validateToken = async (req, res, next) => {
  //check if token exists
  const token = req.headers.authorization;

  //token does not exists
  if (!token)
    return res.status(401).json({ error: true, msg: "Acceso no autorizado" });

  //token exists
  try {
    var decode = await jwt.verify(token, process.env.SECRET_PASSWORD_JWT);
    req.currentUser = {
      _id: decode._id,
      name: decode.name,
      user: decode.user,
    };
    next();
  } catch (error) {
    console.log("TOKEN ERROR ==> ", error);
    res
      .status(401)
      .json({ error: true, msg: "Acceso no autorizado. token inválido" });
  }
};

// ++++++++++++++++++++ VALIDATE TOKEN EMAIL CONFIRM
const validateEmailToken = async(req, res, next) => {
  const token = req.params.token;

  //if token does not exists
  if (!token) return res.status(404).send("<p>El token no es válido</p>");

  //if token exists
  try {
    var decode = await jwt.verify(token, process.env.SECRET_WORD_CONFIRMATION);
    req.confirmEmail = {email: decode.email} 
    if (!decode) throw new Error("El token no pudo ser confirmado");
    next();
  } catch (error) {
    console.log("TOKEN ERROR ==> ", error);
    res
      .status(401)
      .json({ error: true, msg: "Acceso no autorizado. token inválido" });
  }
};

module.exports = {
  validateToken,
  validateEmailToken,
};
