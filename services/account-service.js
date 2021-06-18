const knex = require("../data")


function getAccounts(input) {

    return new Promise((resolve, reject) => {
        knex("TABLES").select("column")
        .then(resp => {
            resolve(resp)
        })
        .catch(err => {
            reject("Database error");
        }) 
    })

}