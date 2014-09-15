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
var MemoryStore = session.MemoryStore;
var sessionStore = new MemoryStore();
//var memoryStore = session.MemoryStore;
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
// -- Mount Root Paht / for router
app.use('/', router);
//
app.set('port', process.env.NODE_PORT || 3000);
app.set('host', process.env.NODE_HOST || "localhost");
//
//
//
//var server = app.listen(app.get('port'), app.get('host'), function() {
//    //debug('Express server listening on port ' + server.address().port);
//    log.debug("Express server listening on http://%s:%d \n", app.get('host'), app.get('port'));
//    logMongo.debug("Express server listening on http://%s:%d \n", app.get('host'), app.get('port'));
//});

//--
//  export app
module.exports = app;
