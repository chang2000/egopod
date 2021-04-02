const express = require('express')
const router = express.Router()
const sqlQuery = require('../../db')
const { OAuth2Client, UserRefreshClient } = require('google-auth-library')


const clientID = "81834534286-ksipb13ampj692eia95sqaed3r67jeje.apps.googleusercontent.com" // Secret
const client = new OAuth2Client(clientID)
router.post("/", async (req, res) => {
    const { tokenId } = req.body
    client.verifyIdToken({ idToken: tokenId, audience: clientID })
        .then(oauth_res => {
            const { email_verified, name, email } = oauth_res.payload;
            console.log(oauth_res.payload)
            res.status(200).json({ userName: name, userEmail: email })
            /*
            let strSql = "select * from user where email = " + query.userEmail + ";"
            let result = await sqlQuery(strSql)
            if (result === []) {
                console.log("no user info, register")
            } else {
                strSql = "insert into userinfo (username,useremail) values ('" + name + "','" + email + "');"
            }
            console.log(result)*/
        })

})



module.exports = router