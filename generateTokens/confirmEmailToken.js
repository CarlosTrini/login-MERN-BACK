const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });

// ++++++++++++++++++++++ +++++++++++ CONFIRM-EMAIL-TOKEN
const confirmEmailToken = (email) => {
  try {
    const payload = { email };
    return jwt.sign(payload, `${process.env.SECRET_WORD_CONFIRMATION}`, {
      expiresIn: "2d",
    });
  } catch (error) {
     console.log('ERROR TOKEN ==> ', error);
  }
};

module.exports = confirmEmailToken;
