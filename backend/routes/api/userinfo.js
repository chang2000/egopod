const express = require('express')
const sqlQuery = require('../../db')
const router = express.Router()

router.get('/', async (req, res) => {
    //res.json({ test: 'test' })
    //console.log(req.url)
    let queryStr = req.url.split('?')[1]
    //split input, 0 is user, 1 is email
    let input = queryStr.split('&')
    //store each value into query
    let query = {}
    input.forEach(function (item, i) {
        let key = item.split('=')[0]
        let value = item.split('=')[1]
        query[key] = value
    })
    console.log(query)
    let strSql = "select * from userinfo where useremail = '" + query.useremail + "';"
    console.log(strSql)
    let result = await sqlQuery(strSql)
    console.log("result = " + json(Array.from(result)))
    res.status(200).json(Array.from(result))

})

router.get('/favourite', async (req, res) => {
    console.log(req.query)
    let strSql = "insert ignore into userfavourite (useremail,favouriteid) values ('" + req.query.userEmail + "','" + req.query.favouriteid + "');"
    console.log(strSql)
    let result = await sqlQuery(strSql)
    //console.log("result = " + result)
    res.status(200)
})

router.get('/delete', async (req, res) => {
    console.log(req.query)
    let strSql = "delete from userfavourite (useremail,favouriteid) where useremail = '" + req.query.userEmail + "' and favouriteid = '" + req.query.favouriteid + "';"
    console.log(strSql)
    let result = await sqlQuery(strSql)
    //console.log("result = " + result)
    res.status(200)
})

router.get('/timestamp', async (req, res) => {
    console.log(req.query)
    let strSql = "insert ignore into timestamp (useremail,boardcast,timestamp) values ('"+ req.query.userEmail +"','"+req.query.boardcast+"','"+ req.query.timestamp +"');"
    console.log(strSql)
    let result = await sqlQuery(strSql)
    //console.log("result = " + result)
    res.status(200)
})

module.exports = router