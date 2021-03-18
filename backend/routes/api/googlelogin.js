const express = require('express')
const router = express.Router()
const {OAuth2Client, UserRefreshClient} = require('google-auth-library')


const clientID = "81834534286-ksipb13ampj692eia95sqaed3r67jeje.apps.googleusercontent.com" // Secret
const client = new OAuth2Client(clientID) 
router.post("/", (req, res)=>{
    const {tokenId} = req.body
    client.verifyIdToken({idToken: tokenId, audience:clientID}) 
    .then(oauth_res=>{
        const {email_verified, name, email} = oauth_res.payload;
        console.log(oauth_res.payload)
        res.status(200).json({userName: name})
    })
})


module.exports = router