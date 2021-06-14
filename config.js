const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  db: process.env.DB_DB,
};