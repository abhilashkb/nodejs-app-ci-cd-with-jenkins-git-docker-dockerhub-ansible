const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'mypassword',
  database: 'user'
});

module.exports = connection;
