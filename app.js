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
// @TODO Json config à mettre en place avec relod si modification !
var dbUrl = process.env.MONGODB_URL || 'mongodb://@127.0.0.1:27017/css_em1';
var options = {server: { poolSize: 5 }};
require("./ressources/db").initDb(dbUrl, options);
//--
// Looger log4j
var log = require('log4js').getLogger('css');
log.debug(' LOG4J APP.JS INIT');
var logMongo = require('log4js').getLogger('mongo');
log.debug(' LOG4J MONGO APP.JS INIT');
//--
// Expres 4.2 midleware
var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var secret = '7m62cnP9rgVh7hH9NyUAdRNwTSHWDsfWFLeMMD7n4vUEuREJtyWbfzsTMFSeqzmYnng6CRd4yBYTCesJdDkNX4SjDmYWqZLcSscHw5Nh256b4wWjdjSdxr7rrsAU7RWZ"';
//--
// User Session Managment
var session = require("express-session");
// Cookies Managment
var MemoryStore = session.MemoryStore;
var sessionStore = new MemoryStore();
var cookie_name = 'connect.sid';
//--

//--
// Express Configuration
var app = express();
//--
// view engine setup
var hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    partialsDir: [
        'views/partials/'
    ],
    helpers: {
        compare: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

            operator = options.hash.operator || "==";

            var operators = {
                '==': function (l, r) {
                    return l == r;
                },
                '===': function (l, r) {
                    return l === r;
                },
                '!=': function (l, r) {
                    return l != r;
                },
                '<': function (l, r) {
                    return l < r;
                },
                '>': function (l, r) {
                    return l > r;
                },
                '<=': function (l, r) {
                    return l <= r;
                },
                '>=': function (l, r) {
                    return l >= r;
                },
                'typeof': function (l, r) {
                    return typeof l == r;
                }
            }

            if (!operators[operator])
                throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);

            var result = operators[operator](lvalue, rvalue);

            if (result) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        json : function(context) {
          return JSON.stringify(context);
        }

}
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//--
// favicon
app.use(favicon(__dirname + '/public/favicon/favicon.ico'));
//--
// Dev Logger
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser(secret));
//--
// Salt
app.use(session({
    'name': cookie_name,
    'secret': secret,
    'store': sessionStore,
    'proxy': false,
    'resave': false,
    'saveUninitialized': false
}));
//--
//
app.use(express.static(path.join(__dirname, 'public')));
//--
// Authentification Managment by Passport
var passport = require('passport');
require('./ressources/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/otf/otf')(app);


//--
// Routes Managment by Otf Framework
//var router = require('./routes/otf/otf');
//require('./routes/otf/otf')(app);

//-- GLOBAL
GLOBAL.sio = require('socket.io')();
//
//sio.configure(function () {

sio.use(function authorization(socket, next) {
    //
    var data = socket.handshake;
    //-- Déja identifier
    //if (data.sessionid){
    //     log.debug("Websocket Authorization quick Verify sessionID  [%j]", data.sessionid);
    //    next();
    //}
    //--
    var _sessionStore = sessionStore;
    var _cookieParser = cookieParser(secret);
    //--
    if (data && data.headers && data.headers.cookie) {
        //--
        _cookieParser(data, {}, function (err) {
            if (err) {
                return next(new Error("Websocket not authorized Cookie parser error " + err.message));
            }
            var sessionId = data.signedCookies[cookie_name];
            //var sessionId = data.cookies[cookie_name];
            log.debug("Websocket Authorization Verify sessionID  [%j]", sessionId);
            _sessionStore.get(sessionId, function (err, session) {
                // log.debug('Websocket Authorization  cookie [%j] ', data.signedCcookies);
                if (err || !session || !session.passport || !session.passport.user) {
                    log.debug('Websocket Authorization Failed not in sessionStore sessionId :', sessionId);
                    next(new Error("Websocket not authorized Passport Failed"));
                    //accept(null, true);
                }
                else {
                    log.debug('Websocket Authorization  for sessionId :', sessionId);
                    //data.session = session;
                    //@TODO généré un UUID par fle module flake-idgen pour la room et ajouter à la session et au data
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

//});

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

//-- TEST PASSAGE CONTEXT APPLICATIF
app.locals.test = 'localsValue';
app.set('test', 'setValue');

//-- Make the instance object app global
//  export app
module.exports = app;
