const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const dbConnection = () =>
  mongoose
    .connect(process.env.MONGO_ATLAS_DB, {
      useNewUrlParser: true,
    })
    .then((res) => console.log("connection established..."))
    .catch((err) => console.log("Connection error ==> ", err.message));

module.exports = dbConnection;