module.exports = {
  development: {
    debug : true,
    client: 'postgresql',
    connection: {
      host : 'localhost',
      port : 5432,
      user : 'restapi',
      password : '',
      database : 'SQL-dw-dev'
    },
    pool: {
      min: 0,
      max: 4,
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  production: {
    client: 'mssql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    }
  }

};
