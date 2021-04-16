const express = require('express')
const sqlQuery = require('../../db')
const router = express.Router()

router.get('/addbm', async (req, res) => {
    console.log(req.query)
    let strSql = "insert ignore into bookmark (useremail,podcastID,episodeID) values ('" + req.query.userEmail + "','" + req.query.podcastID + "','" + req.query.episodeID + "');"
    console.log(strSql)
    let result = await sqlQuery(strSql)
    //console.log("result = " + result)
    res.status(200).send()
})

router.get('/unbm', async (req, res) => {
    console.log(req.query)
    let strSql = "delete from bookmark where useremail = '" + req.query.userEmail + "' and podcastID = '" + req.query.podcastID + "'and episodeID = '" + req.query.episodeID + "';"
    console.log(strSql)
    let result = await sqlQuery(strSql)
    //console.log("result = " + result)
    res.status(200).send()
})

router.get('/queryAll', async (req, res) => {
    console.log(req.query)
    let strSql = "select podcastID,episodeID from bookmark where useremail = '" + req.query.userEmail + "';"
    console.log(strSql)
    let result = await sqlQuery(strSql)
    console.log(JSON.stringify(result))
    // let result_new = result.map((items)=>{
    //     return items["podcastID","episodeID"]
    // })
    // console.log(JSON.stringify(result_new))
    
    let reply = {userEmail: req.query.userEmail,subscribedIDs:result}

    res.status(200).send(reply)
})

module.exports = router