var mysql = require('mysql');
var mysql_config = {
    host: '18.162.46.87',
    port: '3306',
    user: 'root',
    password: 'example',
    database: 'egopod'
};

function handleDisconnection() {
   var connection = mysql.createConnection(mysql_config);
    connection.connect(function(err) {
        if(err) {
            setTimeout('handleDisconnection()', 2000);
        }
    });

    connection.on('error', function(err) {
        logger.error('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            logger.error('db error reconnect:'+err.message);
            handleDisconnection();
        } else {
            throw err;
        }
    });
    exports.connection = connection;
}

module.exports =  handleDisconnection();
