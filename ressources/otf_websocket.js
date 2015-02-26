/**
 * Created by epa on 10/12/14.
 */
var log = require('log4js').getLogger('css');
var util = require('util');
module.exports = function (sessionStore, secret, cookieName) {


//-- GLOBAL
    GLOBAL.sio = require('socket.io')();
    // on copie les infos choisies de la session à la socket
    sio.use(function authorization(socket, next) {
        //
        var data = socket.handshake;

        //--
        var _sessionStore = sessionStore;
        var _cookieParser = require('cookie-parser')(secret);
        // TEST sur memorySession de la liste des sessions active sessionStore.all(cb)
        //_sessionStore.all(function(err,sessions){
        //    if (!err )
        //        log.debug(" TEST LIST SESSION MEMORY SESSION : "+util.inspect(sessions));
        //
        //});
        //--
        if (data && data.headers && data.headers.cookie) {
            //--
            _cookieParser(data, {}, function (err) {
                if (err) {
                    return next(new Error("Websocket not authorized Cookie parser error " + err.message));
                }
                var sessionId = data.signedCookies[cookieName];
                //var sessionId = data.cookies[cookie_name];
                log.debug("Websocket Authorization Verify sessionID  [%j]", sessionId);
                _sessionStore.get(sessionId, function (err, session) {
                    // on verifie que la session est authentifiée
                    // log.debug('Websocket Authorization  cookie [%j] ', data.signedCcookies);
                    if (err || !session || !session.passport || !session.passport.user) {
                        log.debug('Websocket Authorization Failed not in sessionStore sessionId :', sessionId);
                        next(new Error("Websocket not authorized Passport Failed"));
                        //accept(null, true);
                    }
                    else {
                        log.debug('Websocket Authorization  for sessionId :', sessionId);
                        //data.session = session;
                        //@TODO généré un UUID par fle module flake-idgen pour la room et ajouter à la session et au data socket
                        data.sessionid = sessionId;
                        data.user = session.passport.user.login;
                        next();
                    }
                });
            });
        }
        else {
            return next(new Error('Websocket Authorization No cookie transmitted.'));
        }


    });


    sio.use(function trace(socket, next) {
        log.debug(" Trace WS : " + util.inspect(socket.fns));
        next();
    });


//--
    sio.on('connection', function (socket) {
        //socket.broadcast.to(id).emit('my message', msg);
        log.debug(" WS connection socket.id :" + socket.id);
        //log.debug(" WS connection cookie    : " + socket.request.headers.cookie);
        log.debug(" WS connection sessionId : " + socket.handshake.sessionid);
        //log.debug(" WS connection user : " + socket.client.request.session.passport.user);
        log.debug(" WS connection user : " + socket.handshake.user);
        //
        socket.join(socket.handshake.sessionid);
        //
        var mess = {'sessionid': socket.handshake.sessionid, 'user': socket.handshake.user};
        sio.sockets.in(socket.handshake.sessionid).emit('ack', mess);
        log.debug(" WS connection Room n° : " + socket.handshake.sessionid);

    });


};