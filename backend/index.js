const express = require('express')
const path = require('path')
const cors = require("cors");
const mysql = require('mysql')

const app = express()
app.use(cors())

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

//user add note timestamp
app.use('/api/note',require('./routes/api/note'))

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>console.log(`Serevr started on PORT ${PORT}`))
