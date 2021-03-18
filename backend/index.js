const express = require('express')
const path = require('path')
const moment = require('moment')
const logger = require('./middleware/logger')
const cors = require("cors");
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

// Memebers api routes
app.use('/api/members', require('./routes/api/members'))

// Google login routes
app.use('/api/googlelogin', require('./routes/api/googlelogin'))



const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>console.log(`Serevr started on PORT ${PORT}`))
