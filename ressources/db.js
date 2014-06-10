/**
 * Created by epa on 10/06/14.
 */
//-- Db Setup
var mongoose = require('mongoose');
var dbUrl = process.env.MONGODB_URL || 'mongodb://@127.0.0.1:27017/css_em1';
//-- Db Connection
mongoose.connect(dbUrl, function(err) {
    if (err) {
        console.log('App ERROR Mongodb connecting to: [%j]', dbUrl + '. '
            + err);
        throw err;
    } else {
        console.log('APP Succeeded connected to Mongodb : [%j] ', dbUrl);
        // connection = res;
    }
});
module.exports = mongoose;
