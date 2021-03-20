const express = require('express')
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
        throw (err)
    }
    console.log("Connected")
})
  
db.query('SHOW TABLES;', function (err, rows, fields) {
if (err) throw err

console.log('Response from DB', rows)
})

module.exports = db