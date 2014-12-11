/*******************************************************************************
 * Date : 11/06/2014
 * OBJET: Réalisation d'un Framework de routage générique sur Express 4.X avec
 * gestion des exections, de l'authentification et template Jade.
 *
 * author : Stéphane Mascaron && Eric Papet
 *
 ******************************************************************************/

//--
//--
// @TODO Json config à mettre en place avec relod si modification !
var dbUrl = process.env.MONGODB_URL || 'mongodb://@127.0.0.1:27017/otf_demo';
var options = {server: { poolSize: 5 }};
require("./ressources/otf_db").initDb(dbUrl, options);
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
var bodyParser = require('body-parser');
var secret = '7m62cnP9rgVh7hH9NyUAdRNwTSHWDsfWFLeMMD7n4vUEuREJtyWbfzsTMFSeqzmYnng6CRd4yBYTCesJdDkNX4SjDmYWqZLcSscHw5Nh256b4wWjdjSdxr7rrsAU7RWZ"';
var cookie_name = 'connect.sid';
//--
// Express Configuration
var app = express();
//--
// view engine setup
require('./ressources/otf_viewer')(app);
//--
// favicon
app.use(favicon(__dirname + '/public/favicon/favicon.ico'));
//--
// Dev Logger
var logger = require('morgan');
app.use(logger('dev'));
//--
// Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//--
// Static path
app.use(express.static(path.join(__dirname, 'public')));
//--
// Managment Session Store
var sessionStore = require('./ressources/otf_session')(app, secret, cookie_name);
//--
// Authentification Managment by Passport
require('./ressources/otf_passport')(app);
//--
// Routes Managment by Otf Framework
require('./routes/otf/otf')(app);
//--
//WebSocket Managment
require('./ressources/otf_websocket')(sessionStore, secret, cookie_name);
//--
//-- TEST PASSAGE CONTEXT APPLICATIF
app.locals.test = 'OTF localsValue';
app.set('test', 'OTF setValue');

//-- Make the instance object app global
//  export app
module.exports = app;
