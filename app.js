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
//--
// Expres 4.2 midleware
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var flash    = require('connect-flash');
var secret = GLOBAL.config["SESSION"].secret || '7m62cnP9rgVh7hH9NyUAdRNwTSHWDsfWFLeMMD7n4vUEuREJtyWbfzsTMFSeqzmYnng6CRd4yBYTCesJdDkNX4SjDmYWqZLcSscHw5Nh256b4wWjdjSdxr7rrsAU7RWZ"';
var cookie_name = GLOBAL.config["SESSION"].cookie_name || 'connect.sid';
//--
// Express Configuration
var app = express();
//var app;
//--
// view engine setup
require('./otf_core/lib/otf_viewer')(app);
//--
// favicon
app.use(favicon(__dirname + '/public/favicon/favicon.ico'));
//--
// Dev Logger
if (GLOBAL.config["ENV"].mode === 'DEBUG') {
    var logger = require('morgan');
    app.use(logger('dev'));
}
//--
// Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(flash());
//--
// Static path
app.use(express.static(path.join(__dirname, 'public')));
//--
// Managment Session Store
var sessionStore = require('./otf_core/lib/otf_session')(app, secret, cookie_name);
//--
// OPOLOG PLUBISH/SUBCRIBE WEBSOCKET FRAMEWORK
require('./otf_core/lib/otf_oplog')(sessionStore);
//--
// Authentification Managment by Passport
require('./otf_core/lib/otf_passport')(app);
//--
// Routes Managment by Otf Framework
require('./otf_core/otf')(app, sessionStore);
//--
//WebSocket Managment
require('./otf_core/lib/otf_websocket')(sessionStore, secret, cookie_name);

//Flash
app.use(function(req, res, next){
    app.locals.flash = req.flash();
    next();
});

//--
//-- TEST PASSAGE CONTEXT APPLICATIF
app.locals.test = 'OTF localsValue';
app.set('test', 'OTF setValue');
//-- Make the instance object app global
//  export app
module.exports = app;
