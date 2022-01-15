const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
   name: {
      type: String,
      trim: true,
      required: [true, 'necesitamos tu nombre'],
   },
   user: {
      type: String,
      trim: true,
      required: true,
      unique: true
   },
   email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      trim: true,
      required: true
   },
   birthdate: {
      type: Date,
      require: true
   },
   confirmemail: {
      type:Boolean,
      default: false
   }
},{
   timestamps: true
});

const authModel = new mongoose.model('authModel', authSchema, 'users'); //users = document name
module.exports = authModel;