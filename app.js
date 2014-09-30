/*******************************************************************************
 * Date : 11/06/2014
 * OBJET: Réalisation d'un Framework de routage générique sur Express 4.X avec
 * gestion des exections, de l'authentification et template Jade.
 *
 * author : Stéphane Mascaron && Eric Papet
 *
 ******************************************************************************/

//--
// Bootstrap MongoDB
require("./ressources/db");
//--
// Looger log4j
var log = require('log4js').getLogger('css');
log.debug(' LOG4J APP.JS INIT');
var logMongo = require('log4js').getLogger('mongo');
//--
// Expres 4.2 midleware
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//--
// User Session Managment
var session = require("express-session");
// Cookies Managment
var MemoryStore = session.MemoryStore;
var sessionStore = new MemoryStore();
//--
// Authentification Managment by Passport
var passport = require('passport');
require('./ressources/passport')(passport);
//--
// Express Configuration
var app = express();
//
//var sessionStore = new memoryStore();
//--
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//--
// favicon
app.use(favicon(__dirname + '/public/favicon/favicon.ico'));
//--
// Dev Logger
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//--
// Salt
app.use(session({
    'secret': '7m62cnP9rgVh7hH9NyUAdRNwTSHWDsfWFLeMMD7n4vUEuREJtyWbfzsTMFSeqzmYnng6CRd4yBYTCesJdDkNX4SjDmYWqZLcSscHw5Nh256b4wWjdjSdxr7rrsAU7RWZ"', 'saveUninitialized': true,
    'store': sessionStore,
    'proxy': false,
    'resave': true
}));
//--
//
app.use(express.static(path.join(__dirname, 'public')));
//--
//
app.use(passport.initialize());
app.use(passport.session());
//--
// Routes Managment by Otf Framework
router = require('./routes/otf/otf');
// -- NameSpace Management Sample /css
// -- Mount Root Path / for router
app.use('/', router);
//
app.set('port', process.env.NODE_PORT || 3000);
app.set('host', process.env.NODE_HOST || "localhost");

//--
sio = require('socket.io')();
//
sio.set('authorization', function (data, accept) {
    log.debug(" Socket.io authorization event call !");
    var _cookie = 'connect.sid';
    var _sessionStore = sessionStore;
    var _cookieParser = cookieParser('7m62cnP9rgVh7hH9NyUAdRNwTSHWDsfWFLeMMD7n4vUEuREJtyWbfzsTMFSeqzmYnng6CRd4yBYTCesJdDkNX4SjDmYWqZLcSscHw5Nh256b4wWjdjSdxr7rrsAU7RWZ"');

    if (data && data.headers && data.headers.cookie) {
        _cookieParser(data, {}, function (err) {
            if (err) {
                return accept('COOKIE_PARSE_ERROR');
            }
            var sessionId = data.signedCookies[_cookie];
            _sessionStore.get(sessionId, function (err, session) {
                console.log('in auth: session: ', session);
                console.log('in auth: sessionId: ', sessionId);
                console.log('in auth: signedCookie: ', data.signedCookies);
                if (err || !session || !session.passport || !session.passport.user || !session.passport.user) {
                    console.log('not logged in', sessionId);
                    accept('NOT_LOGGED_IN', false);
                    //accept(null, true);
                }
                else {
                    console.log('logged in');
                    data.session = session;
                    data.sessionid = sessionId;
                    data.user = session.passport.user;
                    accept(null, true);
                }
            });
        });
    }
    else {
        return accept('No cookie transmitted.', false);
    }
});

//--
//--
sio.use(function (socket, next) {

    if (socket.client.request.cookies) {
        log.debug(" Socket.io : Cookie is present ");
        log.debug(' Socket.io : sessionid :%s ', socket.client.request.sessionid);
        log.debug(' Socket.io : user      :%j  ', socket.client.request.session.account);
        //log.debug(' Socket.io : user     : ', socket.client.request.user);
        return next();
    } else {
        log.debug(" Socket.io : Cookie is not present ");
        return next('COOKIE_NOT_PRESENT', false);
    }
    //var _cookie =  'connect.sid';
    //var _sessionStore = sessionStore;
    //var _cookieParser = cookieParser('7m62cnP9rgVh7hH9NyUAdRNwTSHWDsfWFLeMMD7n4vUEuREJtyWbfzsTMFSeqzmYnng6CRd4yBYTCesJdDkNX4SjDmYWqZLcSscHw5Nh256b4wWjdjSdxr7rrsAU7RWZ"');
    //
    //if (socket.handshake && socket.handshake.headers && socket.handshake.headers.cookie) {
    //    _cookieParser(socket.handshake, {}, function(err){
    //        if(err){
    //            return next('COOKIE_PARSE_ERROR');
    //        }
    //        var sessionId = socket.handshake.signedCookies[_cookie];
    //        console.log('Socket.io :: sessionId: ', sessionId);
    //        _sessionStore.get(sessionId, function(err, session){
    //            console.log('Socket.io :: session: ', session);
    //            console.log('Socket.io :: signedCookie: ', socket.handshake.signedCookies);
    //            if(err || !session || !session.passport || !session.passport.user || !session.passport.user) {
    //               // accept('NOT_LOGGED_IN', false);
    //                console.log('not logged in', sessionId);
    //                //accept(null, true);
    //            }
    //            else{
    //                console.log('logged in');
    //                socket.session = session;
    //                socket.sessionid = sessionId;
    //                socket.user=session.passport.user;
    //                //accept(null, true);
    //            }
    //        });
    //    });
    //}
    //
    //
    //return next();
    //next(new Error('Authentication error'));
});
//--
sio.on('connection', function (socket) {
    //socket.broadcast.to(id).emit('my message', msg);
    console.log(" WS connection socket.id :" + socket.id);
    console.log(" WS connection cookie    : " + socket.request.headers.cookie);
    console.log(" WS connection sessionId : " + socket.client.request.sessionid);
    console.log(" WS connection user : " + socket.client.request.session.passport.user);
    //
    socket.join(socket.client.request.sessionid);
    //
    var mess = {'sessionid': socket.client.request.sessionid, 'user': socket.client.request.session.passport.user};
    sio.sockets.in(socket.client.request.sessionid).emit('ack', mess);
    console.log("Room n° : " + socket.client.request.sessionid);

});

//
//
//
//var server = app.listen(app.get('port'), app.get('host'), function() {
//    //debug('Express server listening on port ' + server.address().port);
//    log.debug("Express server listening on http://%s:%d \n", app.get('host'), app.get('port'));
//    logMongo.debug("Express server listening on http://%s:%d \n", app.get('host'), app.get('port'));
//});

//--
//-- Make the instance object app global
//  export app
module.exports = app;
