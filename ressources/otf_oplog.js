/**
 * Created by epa on 12/06/14.
 */
var MongoOplog = require('mongo-oplog');
var oplog = MongoOplog('mongodb://127.0.0.1:27017/local', 'otf_demo').tail();
var util = require("util");
var managerSession;

module.exports = function (sessionStore) {
    //  Service d'accés aux sessions
    srvSession = sessionStore;
    //
    oplog.on('op', function (data) {
        console.log("OPLOG ON [%s]", util.inspect(data));
    });

    oplog.on('insert', function (doc) {
      var dataModel = doc.ns.split('.')[1];
      console.log('****> insert on dataModel : ' + dataModel);
        //srvSession.all(function (err, sessions){
        //    for (var _sessionId in sessions) {
        //        console.log('OPOLOG ON  Session N° %s ',_sessionId);
        //       //
        //        var session =   JSON.stringify(sessions[_sessionId] ) ;
        //        if (typeof session.controler != 'undefined')
        //        {
        //             console.log('OPOLOG ON  Session N° %s  DATA_MODEL %s ' ,  _sessionId, (session.controler.data_model).toLowerCase() );
        //            //
        //            if (dataModel === (session.controler.data_model.toLowerCase()))
        //            {
        //                console.log("OPOLOG ON emit insertOk to sesionid : %s with doc : %s ",_sessionId,doc);
        //                GLOBAL.sio.sockets.in(_sessionId).emit('insertOk', doc);
        //            }
        //        }
        //    }
        //    console.log(doc.op);
        //});
        // Pour toutes les sessions qui sont accrochées au même MODEL on emit la modification c'est une varainte du Publish - Subcribe
      for (var _sessionId in GLOBAL.whoWhat) {
        console.log('whoWhat N° '+ _sessionId +': ' , GLOBAL.whoWhat[_sessionId] );
        if (typeof (GLOBAL.whoWhat[_sessionId]).data_model != 'undefined')
        {
            //
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
      console.log(error);
    });

    oplog.on('end', function () {
        console.log('Stream ended');
    });

    oplog.stop(function () {
        console.log('server stopped');
    });
};