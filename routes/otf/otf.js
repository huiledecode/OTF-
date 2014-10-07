/**
 * Created by epa on 10/06/14.
 * Modified by SMA on 16/09/2014
 */

var logger = require('log4js').getLogger('css');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var url = require("url");
//-- load annuaire file in sync mode
var annuaire;
annuaire = JSON.parse(require('fs').readFileSync(__dirname + '/otf_annuaire.json', 'utf8'));
logger.debug("\tOTF Otf.prototype.performAction Annuaire  : \n[\n%j\n]\n",
    annuaire);
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
    var type = "";
    var auth = "";
    var module = "";
    var methode = "";
    var screen = "";
    var controler = {};
    var redirect = false;
    //
    path = url.parse(req.url).pathname;
    if (!path) {
        err = "{'error':' url parse error for path [%s]',path}";
        return cb(err);
    }
    // -- GET, POST,DELETE, etc ..
    type = req.method;
    //-- test existance dans l'annuaire
    if (!annuaire[type + path]) {
        logger.error(" Action not implemented for [%s/%s]", path, type);
        err = "{'error':' Action not implemented for [%s/%s]',path,type}";
        return cb(err);
    }
    // -- get parameters names from otf_annuaire.json
    filter_acceptableFields = annuaire[type + path].params_names;
    //data_acceptableFields = annuaire[type + path].session_names;
    modele = annuaire[type + path].data_model;
    if (!type) {
        err = "{'error':' type parse error for path [%s]',path}";
        return cb(err);
        // -- Type detection for HTTP parameters (GET --> req.query) / POST --> req.body)
    } else {
        if ((type === 'GET') && (typeof filter_acceptableFields != 'undefined')) {
            // -- On construit dynamiquement les params de la requête
            for (var field in req.query) {
                if (req.query.hasOwnProperty(field)) {
                    //filteredQuery[field] = new RegExp('^' + req.query[field] + '$', 'i');
                    filteredQuery[field] = req.query[field];
                }
            }
        } else if ((type === 'POST') && (typeof filter_acceptableFields != 'undefined')) {
            for (var field in req.body) {
                if (req.body.hasOwnProperty(field)) {
                    //filteredQuery[field] = new RegExp('^' + req.body[field] + '$', 'i');
                    filteredQuery[field] = req.body[field];
                }
            }
        }
        // -- faut-il implémenter le delete ?
        /* else if ((type === 'DELETE') && (typeof params_names != 'undefined')) {
         for (var j = 0; j < params_names.length; j++) {
         params_values[j] = req.body[params_names];
         }*/
        //-- passage du sesionId (Room) pour l'utilisation des Websocket dans le bean
        // sessionData['room'] = req.sessionID;
        //filteredQuery = JSON.stringify( filteredQuery);
    }

    // -- Authentificate flag
    auth = annuaire[type + path].auth;

    // -- check Authentificate flag
    //@TODO GERER ÇA PAR L'ANNUAIRE
    if (auth && !req.isAuthenticated()) {
        logger.debug("\tOTF Page sécurisée,demande d'authentification. ");// redirect to loggin
        module = 'login';
        methode = 'titre';
        screen = 'login';
        redirect = true;
        //return res.redirect("index.jade");
    } else {
        logger.debug("\tOTF Account authentifié [ account %j], [session id : [%s] ]", req.session.account, req.sessionID);// redirect to loggin
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
        if (!instanceModule) {
            err = "{'error':' module laod error for path [%s]',path}";
            return cb(err);
        }
    }

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
        'module': module,
        'methode': methode,
        'screen': screen,
        'action': action,
        'params': filteredQuery,
        'room': req.sessionID,
        'data_model': modele,
        'isRedirect': redirect
    };
    // -- set session otf controler
    req.session.otf = controler;
    // -- call the callback
    //-- la variable controller est visible dans la fonction appellente
    return cb(null, controler);

};
//--
//function performAction (req, callback) {
//
//    // --
//    logger.debug("\tOTF  [ URL [type : %s], [Path : %s] ", req.method, req.url);
//    // --
//    // -- build controler
//    getControler(req, function cb(err, controler) {
//        if (err) {
//            // --
//            logger.debug("\tOTF getController ERROR [%j]", err);
//            callback(err, null);
//        } else {
//            // --
//            logger.debug("\tOTF controler     :  [%j]", controler);
//            logger.debug("\tOTF Session.otf   :  [%j]", req.session.otf);
//            //logger.debug("\tOTF Session.socketid   :  [%j]", req.session.sessionid);
//            // --
//            return callback(null, controler);
//        }
//    }); // ~ getController
//};
// --
function logHttpRequest(req, res, next) {
    logger.debug("\napp Log Handler [ %s %s ]", req.method, req.url);
    next();
};
// --
// -- Signup Accounts
// --
function signupAccount(req, res, next) {
    logger.debug("\napp signup Account [ %s %s %j]", req.method, req.url,
        req.body);
    //-- Authetificate, becarefull is a function
    passport.authenticate(
        'local',
        function (err, account) {

            // next();
            if (err) {
                logger.debug("APP authenticate  signupAccount ERROR [%s]",
                    err);
                return next(err); // will generate a 500 error
            }
            ;
            if (!account) {
                logger.debug("APP authenticate  signupAccount Fail ");
                return res.redirect('/login');
            }
            // if everything's OK
            // create objects in session
            req.logIn(account, function (err) {
                if (err) {
                    logger.debug("APP logIn ERROR   account : [%j]",
                        account);
                    req.session.messages = "Error logIn";
                    return next(err);
                }
                logger.debug("APP authenticate   account : [%j,  session id : [%s]]",
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

};
//--
function logOut(req, res) {
    // delete the account session
    req.logout();
    res.redirect('/login');
};
// --
// -- Traite la requête par le routeur dynamique de OTF
// --
function otfAction(req, res, next) {// attention il ne
    // --
    logger.debug('OTF buildAction [ URL [type : %s], [Path : %s] [REMOTE IP : %s]', req.method, req.url, req.connection.remoteAddress);
    // --
    getControler(req, function (err, controler) {
        if (err)
            next(err);
        else {
            /* Appel de la méthode du bean via une callback pour permettre
             * au bean d'exécuter des actions asynchrones et donc ne pas bloquer
             * l'application aux autres utilisateurs */
            // On ajoute la room
            controler.action(controler.params, controler.data_model, controler.room, function (errBean, result) {
                // handling exception
                //-- @TODO Faire une gestion des exceptions plus fine !!
                if (errBean) {
                    logger.error(" Controler.action ERROR :: %s", errBean);
                    return next(errBean, req, res);
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
};
// --
// -- Gestion des erreurs Si erreur lors du traitement de la requête par le
// routeur dynamique de OTF
// --
function errorHandler(err, req, res) {
    logger.debug(
        "APP OTF Handler status 500 Error cause by :  \n [\n %s \n] \n",
        err.stack);
    res.status(501);
    res.render('501', {
        title: 'Http Status 501: Action not implemented',
        error: err,
        url: req.method + req.url
    });
    return; // end of treath
};
// --logger
router.use(logHttpRequest);// -- LogHttpREquest
//-- Authentificate Process

//--
router.post('/signupAccount', signupAccount);

//-- Logout Process
router.get('/logout', logOut);

// -- Perform OTF Automate action
router.use(otfAction);

//-- Error Handler if otf throw error
router.use(errorHandler);// -- Error Handler After Otf Treath


module.exports = router;