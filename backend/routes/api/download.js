const { json } = require('express')
const express = require('express')
const { stringify } = require('uuid')
const router = express.Router()
const sqlQuery = require('../../db')
const fs = require('fs');
const request = require('request')
const ffmpeg = require('ffmpeg');

router.get('/', async (req, res) => {

    
    let Url = req.query.link
    let podcastID = req.query.podcastID
    let episodeID = req.query.episodeID
    let timeStamp = req.query.timeStamp
    let userEmail = req.query.userEmail
    let startTime = ""
    let tS = timeStamp.split(":")
    console.log(Url)

    tS = tS.map((items) => {
        return Number(items)
    })
    if (tS[1] >= 1) {
        tS[1] -= 1
    } else {
        if (tS[0] >= 1) {
            tS[0] -= 1
            tS[1] += 59
        }
        else {
            tS[0] = 0
            tS[1] = 0
            tS[2] = 0
        }
    }
    console.log(tS)
    if (tS[0] < 10) {
        startTime += "0" + tS[0].toString()
    } else {
        startTime += tS[0].toString()
    }
    startTime += ":"
    if (tS[1] < 10) {
        startTime += "0" + tS[1].toString()
    } else {
        startTime += tS[1].toString()
    }
    startTime += ":"
    if (tS[2] < 10) {
        startTime += "0" + tS[2].toString()
    } else {
        startTime += tS[2].toString()
    }
    console.log(startTime)

    delFile("public/" + userEmail + ".mp3")
    //let file = fs.createWriteStream(destDir + "/" + podcastID + episodeID + "test.mp3")

    await request.get(Url).on('error', (err) => {
        // handle error
        //console.log("something error")
        console.log(err)
    }).pipe(fs.createWriteStream('public/instance.mp3')).on('finish', () => {
        try {
            new ffmpeg('public/instance.mp3', (err, video) => {
                if (!err) {
                    console.log('The video is ready to be processed')
                    video
                        .setVideoStartTime(startTime)
                        .setVideoDuration(120)
                        .save("public/" + userEmail + ".mp3", (err, file => {
                            if (!err) {
                                console.log('Video file: ' + file);
                            } else {
                                console.log("process error")
                            }

                        }))
                } else {
                    console.log('load audio fail Error: ' + err)
                }
            })
        } catch (e) {
            console.log(e.code)
            console.log(e.msg)
        }
        res.status(200).send()
    })





})


function delFile(path, reservePath) {
    if (fs.existsSync(path)) {
        if (fs.statSync(path).isDirectory()) {
            let files = fs.readdirSync(path);
            files.forEach((file, index) => {
                let currentPath = path + "/" + file;
                if (fs.statSync(currentPath).isDirectory()) {
                    delFile(currentPath, reservePath);
                } else {
                    fs.unlinkSync(currentPath);
                }
            });
            if (path != reservePath) {
                fs.rmdirSync(path);
            }
        } else {
            fs.unlinkSync(path);
        }
    }
}
module.exports = router