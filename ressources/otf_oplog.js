/**
 * Created by epa on 12/06/14.
 */
var MongoOplog = require('mongo-oplog');
var oplog = MongoOplog('mongodb://127.0.0.1:27017/local', 'otf_demo').tail();


module.exports = function () {
    oplog.on('op', function (data) {
        console.log(data);
    });

    oplog.on('insert', function (doc) {
      var dataModel = doc.ns.split('.')[1];
      console.log('****> insert on dataModel : ' + dataModel);
      for (var _sessionId in GLOBAL.whoWhat) {
        console.log('whoWhat N° '+ _sessionId +': ' , GLOBAL.whoWhat[_sessionId] );
        if (typeof (GLOBAL.whoWhat[_sessionId]).data_model != 'undefined')
        {
          if (dataModel === (GLOBAL.whoWhat[_sessionId]).data_model.toLowerCase()) {
            GLOBAL.sio.sockets.in(_sessionId).emit('insertOk', doc);
          }
        }
      }
      console.log(doc.op);
    });

    oplog.on('update', function (doc) {
      var dataModel = doc.ns.split('.')[1];
      console.log('****> update on dataModel : ' + dataModel);
      for (var _sessionId in GLOBAL.whoWhat) {
        console.log('whoWhat N° '+ _sessionId +': ' , GLOBAL.whoWhat[_sessionId] );
        if (typeof (GLOBAL.whoWhat[_sessionId]).data_model != 'undefined')
        {
          if (dataModel === (GLOBAL.whoWhat[_sessionId]).data_model.toLowerCase()) {
            GLOBAL.sio.sockets.in(_sessionId).emit('updateOk', doc);
          }
        }
      }
      console.log(doc.op);
    });

    oplog.on('delete', function (doc) {
      var dataModel = doc.ns.split('.')[1];
      console.log('****> update on dataModel : ' + dataModel);
      for (var _sessionId in GLOBAL.whoWhat) {
        console.log('whoWhat N° '+ _sessionId +': ' , GLOBAL.whoWhat[_sessionId] );
        if (typeof (GLOBAL.whoWhat[_sessionId]).data_model != 'undefined')
        {
          if (dataModel === (GLOBAL.whoWhat[_sessionId]).data_model.toLowerCase()) {
            GLOBAL.sio.sockets.in(_sessionId).emit('deleteOk', doc);
          }
        }
      }
      console.log(doc.op);
    });

    oplog.on('error', function (error) {
      var dataModel = doc.ns.split('.')[1];
      console.log('****> update on dataModel : ' + dataModel);
      for (var _sessionId in GLOBAL.whoWhat) {
        console.log('whoWhat N° '+ _sessionId +': ' , GLOBAL.whoWhat[_sessionId] );
        if (typeof (GLOBAL.whoWhat[_sessionId]).data_model != 'undefined')
        {
          if (dataModel === (GLOBAL.whoWhat[_sessionId]).data_model.toLowerCase()) {
            GLOBAL.sio.sockets.in(_sessionId).emit('errorMongo', doc);
          }
        }
      }
      console.log(error);
    });

    oplog.on('end', function () {
        console.log('Stream ended');
    });

    oplog.stop(function () {
        console.log('server stopped');
    });
};