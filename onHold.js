
app.get('/account/:account/transactions', function(req, res) {
  res.send("Last 30 days of transactions for account: " + req.params.account);
});


app.get('/contract', function(req, res) {
  res.send("Last 30 days of transactions for account: " + pmdQuery);
});

//GET API
app.get("/api/contract/:contractNumber", function(req , res){
  //	res.send(contractQuery(req.params.contractNumber))
  knex.select(
    'scdeptname as department',
    'SCRevType as revisionType',
    'SCRevDescr as revisionDescription',
    'SCAuthName as authorizedBy',
    'SCAuthPosn as authorizedPosition',
    'SCCurrentVal as currentValue',
    'SCDeltaVal as deltaValue',
    'secaccount as account',
    'SCCommenceDate as contractStartDate',
    'SCContractNum as contractNumber',
    'SCExpiryDate as contractEndDate',
    'SCContMgr as contractManager',
    'SCAcqMethod as acquisitionMethod',
    'SCValuePrice as acquisitionEvaluation',
    'SCContractState as contractState')
  .from('dbo.PurContractDistFact')
  .where({SCContractNum: req.params.contractNumber})
});

//app.use(jwtCheck);

app.get('/authorized', jwtCheck, function (req, res) {
  res.json({message: ' Hello from a private endpoint!'});
});

app.get('/api/private-scoped', jwtCheck, checkScopes, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
  });
});
