const mysql = require('mysql2');

// Configuration de la base de données
const DBNAME = process.env.DB_NAME;
const DBHOST = process.env.DB_HOST;
const DBUSER = process.env.DB_USER;
const DBPASS = process.env.DB_PASS;

// Créer un pool de connexions
const pool = mysql.createPool({
    host: DBHOST,
    user: DBUSER,
    password: DBPASS,
    database: DBNAME,
});

// Promisifier le pool pour pouvoir utiliser async/await
const promisePool = pool.promise();

module.exports = promisePool;