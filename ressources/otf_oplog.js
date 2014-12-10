/**
 * Created by epa on 12/06/14.
 */
var MongoOplog = require('mongo-oplog');
var oplog = MongoOplog('mongodb://127.0.0.1:27017/local', 'test.posts').tail();


module.exports = function () {
    oplog.on('op', function (data) {
        console.log(data);
    });

    oplog.on('insert', function (doc) {
        console.log(doc.op);
    });

    oplog.on('update', function (doc) {
        console.log(doc.op);
    });

    oplog.on('delete', function (doc) {
        console.log(doc.op._id);
    });

    oplog.on('error', function (error) {
        console.log(error);
    });

    oplog.on('end', function () {
        console.log('Stream ended');
    });

    oplog.stop(function () {
        console.log('server stopped');
    });
};