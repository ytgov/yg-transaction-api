

exports.vendorSearchByName = function(req, res) {
  let search = knex.select(
    'VendorID as vendorID',
    'VendName as vendorName',
    'VendShortName as vendorNameShort'
    )
    .from('dbo.vendordim')
    .where('VendName', 'like', '%'+req.query.search+'%')
    .orWhere('VendShortName', 'like', '%'+req.query.search+'%')
    .then(sql_res => res.send(sql_res))
    .catch(function(e){
        res.status(404).send('Not found');
        console.log(e);
    })
}

exports.personSearch = function(req, res){
  var query = knex.select(
    'v.VendName as vendorName',
    'v.VendShortName as vendorNameShort',
    'v.Org as org',
    'v.VendTypeCode as vendorTypeCode',
    'v.VendIsPerson as vendorIsPerson',
    'v.VendTransCurrency as vendorTransCurrency',
    'v.SIN',
    'v.Vend3rdParty as vendorThirdParty',
    'v.VendIsPayAllow as vendorIsPayAllow',
    'v.VendBank as vendBank',
    'v.VendIsVoucherAllow as vendorIsVoucherAllow',
    'v.VendIsPurchaseAllow as vendorIsPurchaseAllow',
    'v.VendPayTypeCode as vendorPayTypeCode',
    'v.VendPayType as vendorPayType',
    'v.VendTerms as vendorTerms',
    'v.VendNotes as vendorNotes',
    'va.VendAddrL1 as vendorAddr1',
    'va.VendAddrL2 as vendorAddrL2',
    'va.VendAddrL3 as vendorAddrL3',
    'va.VendAddrL4 as vendorAddrL3',
    'va.VendAddrCity as vendorAddrCity',
    'va.VendAddrProv as vendorAddrProv',
    'va.VendAddrPost as vendorAddrPost',
    'va.VendAddrCountry as vendorAddrCountry',
    'va.VendAddrIsDefault as vendorAddrIsDefault'
    )
    .from('dbo.vendordim as v')
    .join('dbo.vendaddrdim as va', 'v.vendorkey', 'va.vendorkey')
    .where('VendIsPerson', '1')
    if(typeof req.query.first != 'undefined') query.andWhere('VendName', 'like', req.query.first+' %')
    if(typeof req.query.last != 'undefined') query.andWhere('VendName', 'like', '%'+req.query.last)
    if(typeof req.query.middle != 'undefined') query.andWhere('VendName', 'like', '% '+req.query.middle+' %')
    if(typeof req.query.postal != 'undefined') query.andWhere('VendAddrPost', 'like', '% '+req.query.postal)
    query.then(function(sql_res){
      if(sql_res.length == 1) res.send(sql_res);
      else res.sendStatus(403);
    })
    query.catch(function(e){
        res.status(404).send('Not found');
        console.log(e);
    })
}

exports.businessSearch = function(req, res){
  var query = knex.select(
    'v.VendName as vendorName',
    'v.VendShortName as vendorNameShort',
    'v.Org as org',
    'v.VendTypeCode as vendorTypeCode',
    'v.VendIsPerson as vendorIsPerson',
    'v.VendTransCurrency as vendorTransCurrency',
    'v.SIN',
    'v.Vend3rdParty as vendorThirdParty',
    'v.VendIsPayAllow as vendorIsPayAllow',
    'v.VendBank as vendBank',
    'v.VendIsVoucherAllow as vendorIsVoucherAllow',
    'v.VendIsPurchaseAllow as vendorIsPurchaseAllow',
    'v.VendPayTypeCode as vendorPayTypeCode',
    'v.VendPayType as vendorPayType',
    'v.VendTerms as vendorTerms',
    'v.VendNotes as vendorNotes',
    'va.VendAddrL1 as vendorAddr1',
    'va.VendAddrL2 as vendorAddrL2',
    'va.VendAddrL3 as vendorAddrL3',
    'va.VendAddrL4 as vendorAddrL3',
    'va.VendAddrCity as vendorAddrCity',
    'va.VendAddrProv as vendorAddrProv',
    'va.VendAddrPost as vendorAddrPost',
    'va.VendAddrCountry as vendorAddrCountry',
    'va.VendAddrIsDefault as vendorAddrIsDefault'
    )
    .from('dbo.vendordim as v')
    .join('dbo.vendaddrdim as va', 'v.vendorkey', 'va.vendorkey')
    .where('VendName', 'like', '%'+req.query.name+'%')
    .orWhere('VendShortName', 'like', '%'+req.query.name+'%')
    query.then(sql_res => res.send(sql_res))
    query.catch(function(e){
        res.status(404).send('Not found');
        console.log(e);
    })
}


exports.vendorSearchByVendorID = function(req, res) {
  knex.select(
    'v.VendName as vendorName',
    'v.VendShortName as vendorNameShort',
    'v.Org as org',
    'v.VendTypeCode as vendorTypeCode',
    'v.VendIsPerson as vendorIsPerson',
    'v.VendTransCurrency as vendorTransCurrency',
    'v.SIN',
    'v.Vend3rdParty as vendorThirdParty',
    'v.VendIsPayAllow as vendorIsPayAllow',
    'v.VendBank as vendBank',
    'v.VendIsVoucherAllow as vendorIsVoucherAllow',
    'v.VendIsPurchaseAllow as vendorIsPurchaseAllow',
    'v.VendPayTypeCode as vendorPayTypeCode',
    'v.VendPayType as vendorPayType',
    'v.VendTerms as vendorTerms',
    'v.VendNotes as vendorNotes',
    'va.VendAddrL1 as vendorAddr1',
    'va.VendAddrL2 as vendorAddrL2',
    'va.VendAddrL3 as vendorAddrL3',
    'va.VendAddrL4 as vendorAddrL3',
    'va.VendAddrCity as vendorAddrCity',
    'va.VendAddrProv as vendorAddrProv',
    'va.VendAddrPost as vendorAddrPost',
    'va.VendAddrCountry as vendorAddrCountry',
    'va.VendAddrIsDefault as vendorAddrIsDefault'
    )
    .from('dbo.vendordim as v')
    .join('dbo.vendaddrdim as va', 'v.vendorkey', 'va.vendorkey')
    .where({'v.vendorID': req.params.vendorID})
    .then(sql_res => res.send(sql_res))
    .catch(function(e){
        res.status(404).send('Not found');
        console.log(e);
    })
}

exports.invoiceSearchByBusinessID = function(req, res) {
  knex.select('dbo.apdistfact.*')
    .from('dbo.vendordim')
    .join('dbo.apdistfact', 'dbo.vendordim.vendorkey', 'dbo.apdistfact.vendorkey')
    .where({vendorID : req.params.vendorID})
    .then(sql_res => res.send(sql_res))
    .catch(function(e){
        res.status(404).send('Not found');
        console.log(e);
    })
}

exports.customerSearchByCustomerId = function(req, res) {
  knex.select('dbo.arobligfact.*', 'dbo.arobligpayfact.*')
    .from('dbo.customerdim')
    .join('dbo.arobligfact', 'dbo.customerdim.customerkey', 'dbo.arobligfact.customerkey')
    .join('dbo.arobligpayfact', 'dbo.arobligpayfact.arinvoice', 'dbo.arobligfact.arinvoice')
    .where({customerID : req.params.customerID})
    .then(sql_res => res.send(sql_res))
    .catch(function(e){
        res.status(404).send('Not found');
        console.log(e);
    })
}
