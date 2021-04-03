const express = require('express')
const router = express.Router()
const sqlQuery = require('../../db')
const { OAuth2Client, UserRefreshClient } = require('google-auth-library')



const clientID = "81834534286-ksipb13ampj692eia95sqaed3r67jeje.apps.googleusercontent.com" // Secret
const client = new OAuth2Client(clientID)
router.post("/", (req, res) => {
    const { tokenId } = req.body
    client.verifyIdToken({ idToken: tokenId, audience: clientID })
        .then(oauth_res => {
            const { email_verified, name, email } = oauth_res.payload;
            console.log(oauth_res.payload)
            res.status(200).json({ userName: name, userEmail: email })

            //let strSql = "select * from userinfo where useremail = '" + email + "';"
            //let result =  sqlQuery(strSql)
            //console.log("result is " + result.toString())
            //if (result === []) {
            try {
                //console.log("no user info, register")
                let strSql = "insert ignore into userinfo (username,useremail) values ('" + name + "','" + email + "');" 
                console.log(strSql)
                let result = sqlQuery(strSql)
            } catch (e) {
                console.log(e)
            }

            //} 

        })

})



module.exports = router


