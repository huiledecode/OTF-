/**
 * Created by epa on 10/06/14.
 */
//-- Db Setup
var mongoose = require('mongoose');
//var dbUrl = process.env.MONGODB_URL || 'mongodb://@127.0.0.1:27017/css_em1';
var logger = require('log4js').getLogger('ccs');
//var options = {server: { poolSize: 5 }};
function getPoolConnection(dbUrl, options) {
    //
    if (mongoose.connection)
        mongoose.connection.close();
    //
    con = mongoose.connect(dbUrl, options);
    // Global DB
    if (GLOBAL.db)
        delete GLOBAL.db;
    //
    global.db = con;
    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', function () {
        logger.debug('OTF² Data Base connected to MongoDb URL [%j] State :[%j] ', dbUrl, mongoose.connection.readyState);
    });

    // If the connection throws an error
    mongoose.connection.on('error', function (err) {
        logger.debug('OTF² Data Base not connected to Mongodb URL: [%j]', dbUrl + ' ERROR :  ' + err);
        // Stop Node.js Express application
        process.exit(0);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        logger.debug('OTF² Data Base Disconnected to MongoDb URL [%j] State :[%j] ', dbUrl, mongoose.connection.readyState);
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            logger.debug('OTF² Data Base Disconnected to MongoDb URL [%j]', dbUrl);
            process.exit(0);
        });
    });
    //con.connection.readyState

}

exports.initDb = getPoolConnection;