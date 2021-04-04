const express = require('express')
const path = require('path')
//const moment = require('moment')
//const logger = require('./middleware/logger')
const cors = require("cors");
const mysql = require('mysql')


const db = mysql.createConnection({
    host: '18.166.67.196',
    port: '8080',
    user: 'root',
    password: 'asdfjkl;',
    database: 'egopod'
  })

db.connect((err)=>{
    if(err) {
        throw err
    }
    console.log("Connected")
})

const app = express()
app.use(cors())
// Init middleware
// app.use(logger)

// app.get('/',  function(req, res) {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Set a static folder
app.use(express.static(path.join(__dirname, 'public')));

// Google login routes
app.use('/api/googlelogin', require('./routes/api/googlelogin'))

//user information get
app.use('/api/userinfo',require('./routes/api/userinfo'))

//user information get
app.use('/api/sub',require('./routes/api/sub'))

//user information get
app.use('/api/bm',require('./routes/api/bm'))

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>console.log(`Serevr started on PORT ${PORT}`))
