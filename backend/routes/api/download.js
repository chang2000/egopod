const { json } = require('express')
const express = require('express')
const { stringify } = require('uuid')
const router = express.Router()
const sqlQuery = require('../../db')
const fs = require('fs');
const request = require('request')

router.get('/', (req, res) => {
    let Url = req.query.link
    let destDir = req.query.destDir
    let podcastID = req.query.podcastID
    let episodeID = req.query.episodeID
    console.log(Url)
    //let file = fs.createWriteStream(destDir + "/" + podcastID + episodeID + "test.mp3")

    request.get(Url).on('error', function (err) {
        // handle error
        //console.log("something error")
        console.log(err)
    })
        .pipe(fs.createWriteStream('test.mp3'));


    res.status(200).send()
})


module.exports = router