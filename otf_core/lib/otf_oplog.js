/**
 * Created by epa on 12/06/14.
 */
var logger = require('log4js').getLogger('otf_oplog');
logger.setLevel(GLOBAL.config["LOGS"].level);
var MongoOplog = require('mongo-oplog');
var oplog = MongoOplog('mongodb://127.0.0.1:27017/local', 'otf_demo').tail();
var util = require("util");
var managerSession;

module.exports = function (sessionStore) {
    //  Service d'accés aux sessions
    srvSession = sessionStore;
    //
    oplog.on('op', function (data) {
        logger.debug("OTF² OPLOG ON [%s]", util.inspect(data));
    });

    oplog.on('insert', function (doc) {
        var dataModel = doc.ns.split('.')[1];
        logger.debug('OTF² ****> insert on dataModel : ' + dataModel);
        // Avec le sessionStore de REDIS à tester avec memory
        srvSession.all(function (err, sessions) {
            for (var _sessionId in sessions) {
                logger.debug('OTF² OPOLOG ON  Session N° %s ', _sessionId);
                //
                //var session =   JSON.stringify(sessions[_sessionId] ) ;
                if (typeof sessions[_sessionId].controler != 'undefined' && typeof sessions[_sessionId].controler.data_model != 'undefined') {
                    logger.debug('OTF² OPOLOG ON  Session N° %s  DATA_MODEL %s ', _sessionId, sessions[_sessionId].controler.data_model.toLowerCase());
                    //
                    if (dataModel === (sessions[_sessionId].controler.data_model.toLowerCase())) {
                        logger.debug("OTF² OPOLOG ON EMIT insertOk to sessionId : %s with doc : %s ", _sessionId, util.inspect(doc));
                        GLOBAL.sio.sockets.in(_sessionId).emit('insertOk', doc);
                    }
                }
            }
            logger.debug(doc.op);
        });
    });

    oplog.on('update', function (doc) {
        var dataModel = doc.ns.split('.')[1];
        logger.debug('OTF² ****> update on dataModel : ' + dataModel);
        srvSession.all(function (err, sessions) {
            for (var _sessionId in sessions) {
                logger.debug('OTF² OPOLOG ON  Session N° %s ', _sessionId);
                //
                //var session =   JSON.stringify(sessions[_sessionId] ) ;
                if (typeof sessions[_sessionId].controler.data_model != 'undefined') {
                    logger.debug('OTF² OPOLOG ON  Session N° %s  DATA_MODEL %s ', _sessionId, sessions[_sessionId].controler.data_model.toLowerCase());
                    //
                    if (dataModel === (sessions[_sessionId].controler.data_model.toLowerCase())) {
                        logger.debug("OTF² OPOLOG ON EMIT updateOk to sessionId : %s with doc : %s ", _sessionId, util.inspect(doc));
                        GLOBAL.sio.sockets.in(_sessionId).emit('updateOk', doc);
                    }
                }
            }
        });
        logger.debug(doc.op);
    });

    oplog.on('delete', function (doc) {
        var dataModel = doc.ns.split('.')[1];
        logger.debug('OTF² ****> update on dataModel : ' + dataModel);
        srvSession.all(function (err, sessions) {
            for (var _sessionId in sessions) {
                logger.debug('OTF² OPOLOG ON  Session N° %s ', _sessionId);
                //
                //var session =   JSON.stringify(sessions[_sessionId] ) ;
                if (typeof sessions[_sessionId].controler.data_model != 'undefined') {
                    logger.debug('OTF² OPOLOG ON  Session N° %s  DATA_MODEL %s ', _sessionId, sessions[_sessionId].controler.data_model.toLowerCase());
                    //
                    if (dataModel === (sessions[_sessionId].controler.data_model.toLowerCase())) {
                        logger.debug("OTF² OPOLOG ON EMIT deleteOk to sessionId : %s with doc : %s ", _sessionId, util.inspect(doc));
                        GLOBAL.sio.sockets.in(_sessionId).emit('deleteOk', doc);
                    }
                }
            }
        });
        logger.debug(doc.op);
    });

    oplog.on('error', function (error) {
        logger.debug(error);
    });

    oplog.on('end', function () {
        logger.debug('OTF² Stream ended');
    });

    oplog.stop(function () {
        logger.debug('OTF² server stopped');
    });
};