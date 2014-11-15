/**
 * Created by epa on 10/06/14.
 * Modified by SMA on 16/09/2014
 */
var multiparty = require('multiparty');
var util = require('util');
var logger = require('log4js').getLogger('css');
var express = require('express');
var router = express.Router();
var appContext;
var passport = require('passport');
var url = require("url");
//-- load annuaire file in sync mode
var annuaire;
annuaire = JSON.parse(require('fs').readFileSync(__dirname + '/otf_annuaire.json', 'utf8'));
logger.debug("\tOTF Otf.prototype.performAction Annuaire  : \n[\n%j\n]\n",
    annuaire);
// -- load annuaire_schema json file
GLOBAL.annuaire_schema = JSON.parse(require('fs').readFileSync(__dirname + '/annuaire_schemas.json', 'utf8'));
logger.debug("\tOTF Otf.prototype.performAction Annuaire schéma  : \n[\n%j\n]\n",
    annuaire_schema);
//---
// Fonction exportées pour paramétrer OTF
// Attention à l'odre des router.use et router.get et router.post
function otf(app) {
    //-- Context applicatif
    appContext = app;
//-- Trace
    router.use(logHttpRequest);// -- LogHttpREquest

    //-- Authentificate Process
    router.post('/signupAccount', signupAccount);

//-- Logout Process
    router.get('/logout', logOut);


    // -- Perform OTF Automate action
    router.use(otfAction);

//-- Error Handler if otf throw error
    router.use(errorHandler);


    appContext.use('/', router);
}

//--
// Build the action Controller
//--
function getControler(req, cb) {
  // --
  var acceptableFields = null;
  var filteredQuery = {}; // clause where de la requête MongoDB
  var sessionData = {}; // info à passer au bean contenu dans la session
  var path = "";
  var modele = "";
  var schema = "";
  var type = "";
  var auth = "";
  var module = "";
  var methode = "";
  var screen = "";
  var controler = {};
  var redirect = false;
  var content_type = req.headers['content-type'];
  //
  path = url.parse(req.url).pathname;
  // -- GET, POST,DELETE, etc ..
  type = req.method;
  //-- test existance dans l'annuaire
  if (typeof annuaire[type + path] == 'undefined') {
    var messError = "Action not implemented for URL [" + type + path + "]";
    logger.error('[OTF:getController]' + messError);
    var error = new Error(messError);
    error.status = '501';
    error.title = 'OTF ERROR Action not implemented';
    return cb(error);
  }
  // -- Authentificate flag
  auth = annuaire[type + path].auth;
  if (typeof auth == 'undefined') {
    var messError = "Authentification Flag not implemented in Annuaire for URL [" + type + path + "]";
    logger.error('[OTF:getController]' + messError);
    var error = new Error(messError);
    error.status = '501';
    error.title = 'OTF ERROR Authentification Flag not implemented';
    //err = {status: 501, title: 'OTF Http Status 501: Authentification Flag not implemented', message: messError};
    return cb(error);
  }
  // -- check Authentificate flag
  //@TODO GERER ÇA PAR L'ANNUAIRE
  if (auth && !req.isAuthenticated()) {
    logger.debug("\tOTF Protected Page, User not identify, Redirect for Login Page. ");// redirect to loggin
    module = 'login';
    methode = 'titre';
    screen = 'login';
    redirect = true;
    //return res.redirect("index.jade");
  } else {
    logger.debug("\tOTF Account authentifié [ user %j], [session id : [%s] ]", req.user, req.sessionID);// redirect to loggin
    module = annuaire[type + path].module;
    methode = annuaire[type + path].methode;
    screen = annuaire[type + path].screen;
  }
  // --
  // --
  if (module && methode && screen) {
    // -- Load module in otf_module
    //@TODO TRY / CATCH pour la gestion de l'erreur
    instanceModule = require('./controler/' + module);
    if (typeof instanceModule == 'undefined') {
      var messError = "Loading Module Error for URL [" + type + path + "] and Module [" + module + "]";
      logger.error('[OTF:getController]' + messError);
      var error = new Error(messError);
      error.status = '501';
      error.title = 'OTF ERROR Loading Module Error';
      //err = {status: 501, title: 'OTF Http Status 501 : Loading Module Error', message: messError};
      return cb(error);

    }
  }
  //data_acceptableFields = annuaire[type + path].session_names;
  modele = annuaire[type + path].data_model;
  schema = annuaire_schema[path].schema;
  //@TODO Le modele est il obligatoire ???
  //if (!modele)  {
  //    var messError ="Modele Property not implemented in Annuaire for ["+type+path+"]";
  //    logger.error('[OTF:getController]'+messError);
  //    err = {status:501,title:'OTF Http Status 501: Modele Property not implemented',message:messError};
  //    return cb(err);
  //}
  //
  if (methode !== 'undefined') {
    // Merci Stéphane
    // _module contient une instance d' objet Json, niveau
    // ObjecModule
    // [module] pathName, niveau Module
    // [methode)
    action = instanceModule[module][methode];

  } else {
    action = instanceModule[module]['execute'];
  }
  // --
  // -- controler data structure with HTTP parameters
  controler = {
    'auth': auth,
    'path': path,
    'module': module,
    'methode': methode,
    'screen': screen,
    'action': action,
    'params': filteredQuery,
    'room': req.sessionID,
    'data_model': modele,
    'schema': schema,
    'isRedirect': redirect
  };

  /****** Traitement des paramètres pour les requête mongoDB *********/
  filter_acceptableFields = annuaire[type + path].params_names;
  if ((type === 'GET') && (typeof filter_acceptableFields != 'undefined')) {
    // -- On construit dynamiquement les params de la requête
    for (var field in req.query) {
      if ((req.query.hasOwnProperty(field)) && (filter_acceptableFields.indexOf(field) >= 0)) {
        //filteredQuery[field] = new RegExp('^' + req.query[field] + '$', 'i');
        filteredQuery[field] = req.query[field];
      }
    }
    // -- set session otf controler
    req.session.otf = controler;
    // -- call the callback
    //-- la variable controler est visible dans la fonction appelante
    return cb(null, controler);

  } else if ((type === 'POST') && (typeof filter_acceptableFields != 'undefined')) {
    if (content_type.indexOf('multipart/form-data;') < 0) { // ce n'est pas du multipart ce POST
      for (var field in req.body) {
        if ((req.body.hasOwnProperty(field)) && (filter_acceptableFields.indexOf(field) >= 0)) {
          //filteredQuery[field] = new RegExp('^' + req.body[field] + '$', 'i');
          filteredQuery[field] = req.body[field];
        }
      }
      // -- set session otf controler
      req.session.otf = controler;
      // -- call the callback
      //-- la variable controler est visible dans la fonction appelante
      return cb(null, controler);
    }
      // on a un formulaire avec un content-type : multipart/form-data, un upload !
  } else if ((type === 'POST') && (typeof filter_acceptableFields == 'undefined')) {
    var form = new multiparty.Form({uploadDir: './public/uploads'});
    form.parse(req, function (err, fields, files) {
      console.log('----> fields : ', fields);
      console.log('----> files : ', files);
      / * TODO ici on traite le fichier transféré en ajoutant */
      if (files.thumbnail[0].size > 0) {
        // on a un fichier à récupérer on ajoute aux params un sous objet 'file'
        // contenant les informations sur le fichier pour le copie et le renomer.
        filteredQuery['file'] = {};
        filteredQuery['file'].name = files.thumbnail[0].originalFilename;
        filteredQuery['file'].size = files.thumbnail[0].size;
        filteredQuery['file'].path = files.thumbnail[0].path;
        logger.debug('----->filteredQuery : ', filteredQuery);
      } else {
        // ici fichier non modifié
        filteredQuery['file_name'] = 'none';
      }
      // -- set session otf controler
      req.session.otf = controler;
      // -- call the callback
      //-- la variable controler est visible dans la fonction appelante
      return cb(null, controler);
    });
  } else {
    // -- set session otf controler
    req.session.otf = controler;
    // -- call the callback
    //-- la variable controler est visible dans la fonction appelante
    return cb(null, controler);
  }
} // fin function getControler(...)

// --
  function logHttpRequest(req, res, next) {
    logger.debug("\napp Log Handler [ %s %s ]", req.method, req.url);
    next();
  }
// --
// -- Signup Accounts
// --
  function signupAccount(req, res, next) {
    logger.debug("\nOTF signup Account [ %s %s %j]", req.method, req.url,
      req.body);
    //-- Authetificate, becarefull is a function
    passport.authenticate(
      'local',
      function (err, account) {

        if (err) {
          logger.debug("passport.authenticate  signupAccount ERROR [%s]",
            err);
          return next(err); // will generate a 500 error
        }
        ;
        if (!account) {
          logger.debug("passport.authenticate  signupAccount Fail ");
          return res.redirect('/login');
        }
        // if everything's OK
        // create objects in session
        req.logIn(account, function (err) {
          if (err) {
            logger.debug("passport.authenticate req.LogIn ERROR   account : [%j]",
              account);
            req.session.messages = "Error logIn";
            return next(err);
          }
          logger.debug("passport.authenticate req.LogIn OK   account : [%j,  session id : [%s]]",
            account, req.sessionID);
          // set the message
          req.session.messages = {
            'title': 'Login successfully ' + account.login
          };

          //- je trouve que le redirect est meilleur car sinon avec le render l'ur affichée sur le browser est toujour /signup et pas /
          //- ou autre path dans l'annuaire
          return res.redirect('/index');
          //return res.render('index', {'title': "Bienvenue " + req.session.account.login + " votre n° de session  est : " + req.sessionID});
        });

      })(req, res, next);

  }
//--
  function logOut(req, res) {
    // delete the account session
    req.logout();
    res.redirect('/login');
  }
// --
// -- Traite la requête par le routeur dynamique de OTF
// --
  function otfAction(req, res, next) {// attention il ne
    // --
    logger.debug('OTF buildAction [ URL [type : %s], [Path : %s] [REMOTE IP : %s]', req.method, req.url, req.connection.remoteAddress);
    logger.debug(" Test Context Applicatif  by app.set %s", appContext.get('test'));
    logger.debug(" Test Context Applicatif  by app.locals %s", appContext.locals.test);
    // --
    getControler(req, function (err, controler) {
      if (err)
        next(err);
      else {
        /* Appel de la méthode du bean via une callback pour permettre
         * au bean d'exécuter des actions asynchrones et donc ne pas bloquer
         * l'application aux autres utilisateurs */
        // On ajoute la room
        controler.action(controler.params, controler.path, controler.data_model, controler.schema, controler.room, function (errBean, result) {
          // handling exception
          //-- @TODO Faire une gestion des exceptions plus fine !!
          if (errBean) {
            var messError = "Controller Execution Failed for [" + type + path + "] Error Message [" + errBean + "]";
            logger.error('[OTF:otfAction]' + messError);
            err = {status: 501, title: 'OTF Http Status 501: Controller Execution Failed', message: messError};
            //return next(errBean, req, res);
          }
          logger.debug(" otf final %j", result);
          // On gére le redirect pour l'authentification
          if (controler.isRedirect)
            res.redirect('/' + controler.screen);
          else
            res.render(controler.screen, result);
        });
      }
    });
  }
// --
// -- Gestion des erreurs Si erreur lors du traitement de la requête par le
// routeur dynamique de OTF
// Attention de ne pas oublier l'argument next sinon le milddleware express de la traite pas comme un gestionneire d'erreur
// --
  function errorHandler(err, req, res, next) {
    var status = err.status || '500';
    logger.error(
        "OTF Error Handler Http Status Code " + status + " Error cause by : [%s]",
      err.message);
    res.status(status);
    var ret = {title: err.title, status: status, message: err.message};
    res.render('501', ret);
    return; // end of treath
  };
// --logger
//router.use(logHttpRequest);// -- LogHttpREquest
////-- Authentificate Process
//
////--
//router.post('/signupAccount', signupAccount);
//
////-- Logout Process
//router.get('/logout', logOut);
//
//// -- Perform OTF Automate action
//router.use(otfAction);
//
////-- Error Handler if otf throw error
//router.use(errorHandler);// -- Error Handler After Otf Treath
//
//
//module.exports = router;

module.exports = otf;