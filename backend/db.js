const express = require('express')
const mysql = require('mysql')
//const handleDisconnection() = require('./mysqlconnection')

let db = mysql.createConnection({
    host: '18.162.46.87',
    port: '3306',
    user: 'root',
    password: 'example',
    database: 'egopod'
})
function handleDisconnect() {
    db = mysql.createConnection({
        host: '18.162.46.87',
        port: '3306',
        user: 'root',
        password: 'example',
        database: 'egopod'
    })
    db.on('error', function(err) {
        if (!err.fatal) {
            return;
        }
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        }else{
            console.log('mysql error: ' + err.code);
            throw err;
        }
    });
    db.connect(function(err) {
        if (err){
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect , 2000);
        }
        console.log('mysql connected');
    });
}
handleDisconnect();

// db.connect((err) => {
//     if (err) {
//         throw (err)
//         // connection.on('error', err => {
//         //     console.log('Re-connecting lost connection: ');
//         //     connection = mysql.createConnection(sqlConfig)
//         // })
//     }
//     console.log("Connected")
// })

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
        //db.release()
    })
}

module.exports = sqlQuery