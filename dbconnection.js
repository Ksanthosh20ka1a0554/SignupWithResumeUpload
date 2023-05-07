const mysql = require('mysql');

var connection = mysql.createConnection({
    host: "sql12.freemysqlhosting.net",
    user: "sql12616165",
    password: '9zaLtULG7L',
    database: 'sql12616165',
    port: 3306,
});

module.exports.conn = connection;