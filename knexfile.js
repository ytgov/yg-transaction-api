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
      min: 2,
      max: 10,
    }
  },

  staging: {
    client: 'mssql',
    connection: {
      host : 'sql-dw-dev',
      user : 'restapi',
      password : 'time-SUNDAY-etching-mark',
      database : 'EDW-Finance-Stage'
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
