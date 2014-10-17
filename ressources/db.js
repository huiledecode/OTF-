/**
 * Created by epa on 10/06/14.
 */
//-- Db Setup
var mongoose = require('mongoose');
var dbUrl = process.env.MONGODB_URL || 'mongodb://@127.0.0.1:27017/css_em1';
var logger = require('log4js').getLogger('ccs');
//-- Db Connection
global.db = mongoose.connect(dbUrl, function (err) {
    if (err) {
        logger.debug('Data Base not connected to Mongodb URL: [%j]', dbUrl + ' ERROR :  '
            + err);
        throw err;
    } else {
        logger.debug('Data Base connected to MongoDb URL [%j] ', dbUrl);
        // connection = res;
    }
});
//module.exports = mongoose;
