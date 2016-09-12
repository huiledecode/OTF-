/**
 * Created by epa on 10/12/14.
 */
var log = require('log4js').getLogger('otf_webSocket');
log.setLevel(GLOBAL.config["LOGS"].level);
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
        //    {
        //        log.debug("WEBSOCKET MODULE TEST LIST SESSIONS [%s] ",util.inspect(sessions));
        //        if (sessions)
        //        {
        //            for (var session  in sessions)
        //            {
        //                 log.debug("sessionid %s, cookie %s, controler %s, data [%s]",session,util.inspect(sessions[session].cookie),util.inspect(sessions[session].controler),util.inspect(sessions[session]));
        //            }
        //        }
        //
        //    }
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
                log.debug("OTF² Websocket Authorization Verify sessionID  [%j]", sessionId);
                _sessionStore.get(sessionId, function (err, session) {
                    // on verifie que la session est authentifiée
                    // log.debug('Websocket Authorization  cookie [%j] ', data.signedCcookies);
                    if (err || !session || !session.passport || !session.passport.user) {
                        log.warn('OTF² Websocket Authorization Failed not in sessionStore sessionId :', sessionId);
                        next(new Error("Websocket not authorized Passport Failed"));
                        //accept(null, true);
                    }
                    else {
                        log.debug('OTF² Websocket Authorization  OK for sessionId :', sessionId);
                        //data.session = session;
                        //

                        data.sessionid = sessionId;
                        data.user = session.passport.user.login;
                        next();
                    }
                });
            });
        }
        else {
            return next(new Error('OTF² Websocket Authorization No cookie transmitted.'));
        }


    });


    sio.use(function trace(socket, next) {
        log.debug("OTF² Trace WS : " + util.inspect(socket.fns));
        next();
    });


//--
    sio.on('connection', function (socket) {
        //socket.broadcast.to(id).emit('my message', msg);
        log.debug("OTF² WS connection socket.id :" + socket.id);
        //log.debug(" WS connection cookie    : " + socket.request.headers.cookie);
        log.debug("OTF² WS connection sessionId : " + socket.handshake.sessionid);
        //log.debug(" WS connection user : " + socket.client.request.session.passport.user);
        log.debug("OTF² WS connection user : " + socket.handshake.user);
        //
        socket.join(socket.handshake.sessionid);
        //
        var mess = {'sessionid': socket.handshake.sessionid, 'user': socket.handshake.user};
        sio.sockets.in(socket.handshake.sessionid).emit('ack', mess);
        log.debug("OTF² WS connection Room n° : " + socket.handshake.sessionid);

    });
  //--
  // this event is generic to answer of client requests over websocket
  // structure of data could be : data : {pathname : '/actionName', data : {...what you want .. }}
    sio.on('action', function(data) {
      var pathname = data.pathname ;

    });


};