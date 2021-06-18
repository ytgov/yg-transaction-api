const {dbHost, dbUser, dbPassword, dbName} = require('../config')

const knex = require('knex')({
    client: 'mssql',
    connection: {
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbName
    }
});

module.exports = knex;
