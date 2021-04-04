const express = require('express')
const mysql = require('mysql')

const db = mysql.createConnection({
    host: '18.162.46.87',
    port: '3306',
    user: 'root',
    password: 'example',
    database: 'egopod'
})

db.connect((err) => {
    if (err) {
        throw (err)
    }
    console.log("Connected")
})

function sqlQuery(strSql, arr) {
    return new Promise(function (resolve, reject) {
        db.query(strSql, arr, (err, results) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(results)
            }
        })
    })
}
/*
db.query('SHOW TABLES;', function (err, rows, fields) {
    if (err) throw err

    console.log('Response from DB', rows)
})
*/
module.exports = sqlQuery