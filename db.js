const mysql = require('mysql');

// config dotenv module
require('dotenv').config();

// connection instance
const connection = mysql.createPool({
    connectionLimit:100,
    host:"database-1.cjdefajqur3p.us-east-2.rds.amazonaws.com",
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD || '',
    database:process.env.DB_NAME
    // insecureAuth:true
});


module.exports = connection;