const { json } = require('express')
const express = require('express')
const { stringify } = require('uuid')
const router = express.Router()
const sqlQuery = require('../../db')

router.get('/addts', async (req, res) => {
    //console.log(req.query)
    let sqlStr = "insert into note (useremail,podcastID,episodeID,timestamp,noteString) values (?,?,?,?,?);"
    let arr = [req.query.userEmail, req.query.podcastID, req.query.episodeID, req.query.timeStamp, req.query.noteString]
    let result = await sqlQuery(sqlStr, arr)
    console.log(result)
    res.status(200).send()
})

router.get('/delts', async (req, res) => {
    console.log(req.query)
    let sqlStr = "delete from note where useremail= '" + req.query.userEmail + "'"
    if (req.query.podcastID != undefined) {
        sqlStr = sqlStr + "AND podcastID = '" + req.query.podcastID + "'"
    }
    if (req.query.episodeID != undefined) {
        sqlStr = sqlStr + "AND podcastID = '" + req.query.episodeID + "'"
    }
    if (req.query.timestamp != undefined) {
        sqlStr = sqlStr + "AND podcastID = '" + req.query.timeStamp + "'"
    }
    sqlStr = sqlStr + ';'
    console.log(sqlStr)
    let result = await sqlQuery(sqlStr)
    console.log(result)
    res.status(200).send()
})

router.get('/queryAll', async (req, res) => {

    //console.log(req.query)
    //let sqlStr = "select * from timestamp where useremail=? and podcastID=? and episodeID=?;"
    let sqlStr = "select podcastID,episodeID,timestamp,noteString from note where userEmail = '" + req.query.userEmail + "'"
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
    sqlStr = sqlStr + ';'
    let result = await sqlQuery(sqlStr)
    let reply = { userEmail: req.query.userEmail, Note: result }
    res.status(200).json(reply)
})

module.exports = router