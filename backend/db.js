const express = require('express')
const mysql = require('mysql')

const db = mysql.createConnection({
    host: '18.166.67.196',
    port: '3306',
    user: 'root',
    password: 'asdfjkl;',
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