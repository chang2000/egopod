const { json } = require('express')
const express = require('express')
const { stringify } = require('uuid')
const router = express.Router()
const sqlQuery = require('../../db')

router.get('/addts', async (req, res) => {
    //console.log(req.query)
    let sqlStr = "insert ignore into timestamp (useremail,podcastID,episodeID,timestamp) values (?,?,?,?);"
    let arr = [req.query.userEmail, req.query.podcastID, req.query.episodeID, req.query.timeStamp]
    let result = await sqlQuery(sqlStr, arr)
    console.log(result)
    res.status(200).send()
})

router.get('/delts', async (req, res) => {
    console.log(req.query)
    let sqlStr = "delete from timestamp where useremail=? and podcastID=? and episodeID=? and timestamp = ?;"
    let arr = [req.query.userEmail, req.query.podcastID, req.query.episodeID, req.query.timeStamp]
    let result = await sqlQuery(sqlStr, arr)
    res.status(200).send()
})

router.get('/queryAll', async (req, res) => {

    //console.log(req.query)
    //let sqlStr = "select * from timestamp where useremail=? and podcastID=? and episodeID=?;"
    let sqlStr = "select podcastID,episodeID,timestamp from timestamp where userEmail = '" + req.query.userEmail + "';"
    //console.log(sqlStr)
    if (req.query.podcastID != undefined) {
        sqlStr = sqlStr + "AND podcastID = '" + req.query.podcastID + "'"
    }
    if (req.query.episodeID != undefined) {
        sqlStr = sqlStr + "AND podcastID = '" + req.query.episodeID + "'"
    }
    if (req.query.timestamp != undefined) {
        sqlStr = sqlStr + "AND podcastID = '" + req.query.timeStamp + "'"
    }
    //let arr = [req.query.useremail,req.query.podcastID,req.query.episodeID,req.query.timestamp]
    //console.log(arr)
    let result = await sqlQuery(sqlStr)
    //console.log(result)
    // let result_new = result.map((items)=>{
    //     return items[]
    // })
    let reply = { userEmail: req.query.userEmail, timeStamps: result }
    res.status(200).json(reply)
})

module.exports = router