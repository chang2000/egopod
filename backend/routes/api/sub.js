const express = require('express')
const sqlQuery = require('../../db')
const router = express.Router()

router.get('/addsub', async (req, res) => {
    console.log(req.query)
    let strSql = "insert ignore into subscription (useremail,podcastID) values ('" + req.query.userEmail + "','" + req.query.podcastID + "');"
    console.log(strSql)
    let result = await sqlQuery(strSql)
    //console.log("result = " + result)
    res.status(200).send()
})

router.get('/unsub', async (req, res) => {
    console.log(req.query)
    let strSql = "delete from subscription where useremail = '" + req.query.userEmail + "' and podcastID = '" + req.query.podcastID + "';"
    console.log(strSql)
    let result = await sqlQuery(strSql)
    //console.log("result = " + result)
    res.status(200).send()
})

router.get('/queryAll', async (req, res) => {
    console.log(req.query)
    let strSql = "select podcastID from subscription where useremail = '" + req.query.userEmail + "';"
    console.log(strSql)
    let result = await sqlQuery(strSql)
    console.log(JSON.stringify(result))
    let result_new = result.map((items)=>{
        return items["podcastID"]
    })
    console.log(JSON.stringify(result_new))
    let reply = {userEmail: req.query.userEmail,subscribedIDs:result_new}

    res.status(200).send(reply)
})

module.exports = router