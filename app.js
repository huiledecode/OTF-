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
//var logger = require('log4js').getLogger('css');
//logger.debug(' LOG4J APP.JS INIT');
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
//--
// Authentification Managment by Passport
var passport = require('passport');
require('./ressources/passport')(passport);
//--
// Express Configuration
var app = express();
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
    'secret': '7m62cnP9rgVh7hH9NyUAdRNwTSHWDsfWFLeMMD7n4vUEuREJtyWbfzsTMFSeqzmYnng6CRd4yBYTCesJdDkNX4SjDmYWqZLcSscHw5Nh256b4wWjdjSdxr7rrsAU7RWZ"'
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
//--
//  export app
module.exports = app;
