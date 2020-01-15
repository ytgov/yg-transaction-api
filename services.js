exports.fiscalKeyToFiscalPeriod = function(req , res) {
 knex.select('fiscperiod as fiscalPeriod')
   .from('dbo.fiscperdim')
   .where({fiscperkey:req.params.fiscalKey})
   .then(sql_res => res.send(sql_res))
   .catch(function(e){
     res.status(404).send('Not found');
     console.log(e);
   })
}

exports.dateToFiscalPeriod = function(req , res) {
  knex.select('fiscperiod as fiscalPeriod')
    .from('dbo.fiscperdim')
    .where('PerStartDt', '<=', req.query.date)
    .where('PerEndDt', '>=', req.query.date)
    .first()
    .then(sql_res => res.send(sql_res))
    .catch(function(e){
      res.status(404).send('Not found');
      console.log(e);
    })
}
