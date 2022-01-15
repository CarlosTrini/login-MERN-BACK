const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config({path: '.env'});
const dbConnection = require('./config/db');

const PORT = process.env.PORT || 5000;


//MIDDLEWARES
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//DB CONNECTION
dbConnection();

// ROUTES
const baseUrl = '/api/fake-site/';
// home => /api/fake-site/
app.use(baseUrl, require('./routes/homeRoutes'));
//  login => /api/fake-site/login  
//register => /api/fake-site/register
// confirm email => /api/fake-site/confirm-email
app.use(baseUrl, require('./routes/authRoutes') ); 


// start server
app.listen(PORT, '0.0.0.0', (error) => {
   error
   ? console.log('Error ==> ', error)
   : console.log(`Server running ==> , ${PORT}`)
});