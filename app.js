/*******************************************************************************
 * Date : 11/06/2014
 * OBJET: Réalisation d'un Framework de routage générique sur Express 4.X avec
 * gestion des exections, de l'authentification et template Jade.
 *
 * author : Stéphane Mascaron && Eric Papet
 *
 ******************************************************************************/

//--
// Bootstrap MongoDB wih global db
require("./ressources/db");
//--
// Looger log4j
var log = require('log4js').getLogger('css');
log.debug(' LOG4J APP.JS INIT');
var logMongo = require('log4js').getLogger('mongo');
log.debug(' LOG4J MONGO APP.JS INIT');
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
// GLOBAL for CApplication context app.settings
//app = express();
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
//var router = require('./routes/otf/otf');
require('./routes/otf/otf')(app);

//-- GLOBAL
GLOBAL.sio = require('socket.io')();
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
                //console.log('in auth: session: ', session);
                log.debug('Socket.io authorization : sessionId    : ', sessionId);
                log.debug('Socket.io authorization : signedCookie : ', data.signedCookies);
                if (err || !session || !session.passport || !session.passport.user) {
                    log.debug('Socket.io authorization not logged in : sessionId :', sessionId);
                    accept('NOT_LOGGED_IN', false);
                    //accept(null, true);
                }
                else {
                    log.debug('Socket.io authorization logged in : sessionId :', sessionId);
                    //data.session = session;
                    //@TODO généré un UUID par fle module flake-idgen pour la room et ajouter à la session et au data
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
        log.debug(" Socket.io Trace : Cookie is present ");
        log.debug(' Socket.io Trace : sessionid :%s ', socket.client.request.sessionid);
        //log.debug(' Socket.io : user      :%j  ', socket.client.request.session.account);
        log.debug(' Socket.io Trace : user     : ', socket.client.request.user);
        return next();
    } else {
        log.debug(" Socket.io Trace : Cookie is not present ");
        return next('COOKIE_NOT_PRESENT', false);
    }
});
//--
sio.on('connection', function (socket) {
    //socket.broadcast.to(id).emit('my message', msg);
    log.debug(" WS connection socket.id :" + socket.id);
    //log.debug(" WS connection cookie    : " + socket.request.headers.cookie);
    log.debug(" WS connection sessionId : " + socket.client.request.sessionid);
    //log.debug(" WS connection user : " + socket.client.request.session.passport.user);
    log.debug(" WS connection user : " + socket.client.request.user);
    //
    socket.join(socket.client.request.sessionid);
    //
    var mess = {'sessionid': socket.client.request.sessionid, 'user': socket.client.request.user};
    sio.sockets.in(socket.client.request.sessionid).emit('ack', mess);
    log.debug(" WS connection Room n° : " + socket.client.request.sessionid);

});

//-- TEST PASSAGE CONTEXT APPLICATIF
app.locals.test = 'localsValue';
app.set('test', 'setValue');

//-- Make the instance object app global
//  export app
module.exports = app;
