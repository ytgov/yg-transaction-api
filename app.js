var express = require('express')
var jwks = require('jwks-rsa');
var sql = require("mssql");

var environment = process.env.NODE_ENV || 'staging'
var config = require('./knexfile.js')[environment]
const knex = require('knex')(config);

const app = express()
const port = 3001
const host = '0.0.0.0';

//Initiallising connection string

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'))

app.get('/', function(req, res) {
  res.send("Hey!");
});

//peron
app.get('/person/:ynetID', function(req, res) {
  //res.send(req.params.ynetID);
});

app.get('/person/:ynetID/authorities', function(req, res) {
  res.send(req.params.ynetID + " authorities");
});

app.get('/person/:ynetID/card', function(req, res) {
  res.send(req.params.ynetID + " cards");
});

app.get('/person/:ynetID/transactions', function(req, res) {
  res.send(req.params.ynetID + " transactions");
});

app.get('/person/:ynetID/authorities', function(req, res) {
  res.send(req.params.ynetID + " authorities");
});

//account
app.get('/account/:account/authorities', function(req, res) {
  res.send(req.params.account + " authorities");
});

app.post('/account/:account/authorities', function(req, res) {
  res.send("create authroity " +req.params.account);
});

app.get('/authority/:authority', function(req, res) {
  res.send(req.params.authority + " authority");
});

app.post('/authority/:authority', function(req, res) {
  res.send("delete authroity " + req.params.authority);
});

app.post('/authority/:authority', function(req, res) {
  res.send("update authroity " + req.params.authority);
});

//transactions
app.get('/account/:authority/transactions', function(req, res) {
  res.send(req.params.authority + " transactions");
});

app.get('/account/:authority/transactions/:fiscalyear', function(req, res) {
  res.send(req.params.authority + " transactions for fiscal year " + req.params.fiscalyear);
});

//default?
app.get('/account/:department', function(req, res) {
  res.send("accounts in " + req.params.department);
});

app.get('/account/:department/:vote', function(req, res) {
  res.send("accounts in " + req.params.department + " that voted " + req.params.vote);
});

app.get('/account/:department/:vote/:program', function(req, res) {
  res.send("accounts in " + req.params.department + " that voted " + req.params.vote + " under program " + req.params.program);
});

app.get('/account/:department/:vote/:program/:object', function(req, res) {
  res.send("accounts in " + req.params.department + " that voted " + req.params.vote + " under program " + req.params.program + " with children " + req.params.object);
});

app.get('/account/:department/:vote/:program/:object/:ledger', function(req, res) {
  res.send("accounts in " + req.params.department + " that voted " + req.params.vote + " under program " + req.params.program + " with children " + req.params.object + " and subledgers " + req.params.ledger);
});

app.get('/contract/:contractNum', function(req, res) {
  knex.select('*')
    .from('dbo.purcontractdistfact')
    //.from('softstar.purcontractdistfact')
    .where({sccontractnum:req.params.contractNum})
    .then(sql_res => res.send(sql_res))
    .catch(e => res.send(e))
});

app.get('/contract', function(req, res) {
  knex.select('*')
    .from('dbo.purcontractdistfact')
    //.from('softstar.purcontractdistfact')
    .then(sql_res => res.send(sql_res))
    .catch(e => res.send(e))
});

app.get('/invoice', function(req, res) {
  knex.select('*')
    .from('dbo.arobligfact')
    //.from('softstar.arobligfact')
    .then(sql_res => res.send(sql_res))
    .catch(e => res.send(e))
});

app.get('/invoice/:arinvoice', function(req, res) {
  knex.select('*')
    .from('dbo.arobligfact')
    //.from('softstar.arobligfact')
    .where({arinvoice:req.params.arinvoice})
    .then(sql_res => res.send(sql_res))
    .catch(e => res.send(e))
});

app.get('/vendor', function(req, res) {
  knex.select('*')
    .from('dbo.vendordim')
    //.from('softstar.vendordim')
    .join('softstar.vendaddrdim', 'softstar.vendaddrdim.vendorkey', 'softstar.vendordim.vendorkey')
    .then(sql_res => res.send(sql_res))
    .catch(e => res.send(e))
});

app.listen(port, host, () => console.log(`Contract API listening on host ${host} at port ${port}!`))
