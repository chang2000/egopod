const express = require('express')
const mysql = require('mysql')
const loginInfo = require('./config')
console.log(loginInfo)
const SERVER_IP = loginInfo.server_ip 
let db = mysql.createConnection({
    host: SERVER_IP,
    port: '3306',
    user: loginInfo.userName,
    password: loginInfo.password,
    database: 'egopod'
})

function handleDisconnect() {
    db = mysql.createConnection({
        host: SERVER_IP,
        port: '3306',
        user: loginInfo.userName,
        password: loginInfo.password,
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
        else{
            console.log('mysql connected');
        }
        
    });
}
handleDisconnect();

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