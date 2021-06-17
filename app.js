const express = require('express')
const bodyParser = require('body-parser')
const sql = require("mssql")

const { dbHost } = require('./config/config')
const { dbUser } = require('./config/config')
const { dbPassword } = require('./config/config')
const { db } = require('./config/config')

const knex = require('knex')({
  client: 'mssql',
  connection: {
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: db
  }
});

const { body, validationResult } = require('express-validator')
const { GLRouter } = require('./routes/gl')

const app = express()
const port = 3034
const host = '0.0.0.0';

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var glRoutes = require('./routes/gl')
glRoutes(app)

app.use(express.static('public'))

app.listen(port, host, () => console.log(`Contract API listening on host ${host} at port ${port}!`))
