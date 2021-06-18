
const knex = require('knex')({
    client: 'mssql',
    connection: {
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: db
    }
});

module.exports = knex;
