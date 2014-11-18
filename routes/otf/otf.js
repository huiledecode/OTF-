/**
 * Created by epa on 10/06/14.
 * Modified by SMA on 16/09/2014
 */
var fs = require('fs');
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
annuaire = JSON.parse(fs.readFileSync(__dirname + '/otf_annuaire.json', 'utf8'));
logger.debug("\tOTF Otf.prototype.performAction Annuaire  : \n[\n%j\n]\n",
    annuaire);
// -- load annuaire_schema json file
GLOBAL.annuaire_schema = JSON.parse(fs.readFileSync(__dirname + '/annuaire_schemas.json', 'utf8'));
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
    //router.post('/signupAccount', signupAccount);

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
    if (typeof annuaire[type + path] == 'undefined')
        return cb(handleError('OTF ERROR Action not implemented', '501', "Action not implemented for URL [" + type + path + "]"));

    // -- Authentificate flag
    auth = annuaire[type + path].auth;
    if (typeof auth == 'undefined')
        return cb(handleError('OTF ERROR Authentification Flag not implemented', '501', "Authentification Flag not implemented in Annuaire for URL [" + type + path + "]"));

    // -- check Authentificate flag
    //@TODO GERER ÇA PAR L'ANNUAIRE
    if (auth && !req.isAuthenticated()) {
        logger.debug("OTF Protected Page, User not identify, Redirect for Login Page. ");// redirect to loggin
        module = 'login';
        methode = 'titre';
        screen = 'login';
        redirect = true;
    } else if (!auth) {
        logger.debug("OTF Page non sécurisée  [session id : [%s] ]", req.sessionID);// redirect to loggin
        module = annuaire[type + path].module;
        methode = annuaire[type + path].methode;
        screen = annuaire[type + path].screen;
    } else if (req.user !== 'undefined') {
        logger.debug("OTF Page sécurisé et  authentifié [ user %j], [session id : [%s] ]", req.user, req.sessionID);// redirect to loggin
        module = annuaire[type + path].module;
        methode = annuaire[type + path].methode;
        screen = annuaire[type + path].screen;
    }
    // --
    // --
    if (module && methode && screen) {
        // -- Load module in otf_module
        try {
            instanceModule = require('./controler/' + module);
        } catch (err) {
            return cb(handleError('OTF ERROR Loading Module Error', '501', "Loading Module Error for URL [" + type + path + "] and Module [" + module + "], message [" + err.toString() + "]"));
        }
        if (typeof instanceModule == 'undefined')
            return cb(handleError('OTF ERROR Loading Module is undefined', '501', "Loading Module Error for URL [" + type + path + "] and Module [" + module + "]"));

    }
    //data_acceptableFields = annuaire[type + path].session_names;
    modele = annuaire[type + path].data_model;
    schema = annuaire_schema[path].schema;
    //@TODO Le modele est il obligatoire ???
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
        return cb(null, controler);
    } else if ((type === 'POST') && (typeof filter_acceptableFields != 'undefined')) {
        if (content_type.indexOf('multipart/form-data;') < 0) { // ce n'est pas du multipart ce POST
            for (var field in req.body) {
                if ((req.body.hasOwnProperty(field)) && (filter_acceptableFields.indexOf(field) >= 0)) {
                    //filteredQuery[field] = new RegExp('^' + req.body[field] + '$', 'i');
                    filteredQuery[field] = req.body[field];
                }
            }
        }
        return cb(null, controler);
        // on a un formulaire avec un content-type : multipart/form-data, un upload !
    } else if ((type === 'POST') && (typeof filter_acceptableFields == 'undefined')) {
        // test de l'existance du repertoire uploads
        checkAndCreateDirectory('./public/uploads', function (err) {
            if (err)
                return cb(handleError("OTF Check Directory Error for URL [" + type + path + "] and Module [" + module + "]", '501', err.toString()));
            //
            uploadFile(req, filteredQuery, function (err) {
                if (err)
                    return cb(handleError('OTF Error Multipart Download File', '501', err.toString()));
                else
                    return cb(null, controler);
            });
        });
    } else
        return cb(null, controler);

    // -- call the callback
    //-- la variable controler est visible dans la fonction appelante

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
        function (err, account, info) {

            if (err) {
                logger.debug("passport.authenticate  signupAccount ERROR [%s]",
                    err);
                return next(err); // will generate a 500 error
            }
            ;
            if (!account) {
                logger.debug("passport.authenticate  signupAccount Fail message %j", info);
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
    //logger.debug(" Test Context Applicatif  by app.set %s", appContext.get('test'));
    //logger.debug(" Test Context Applicatif  by app.locals %s", appContext.locals.test);
    // --
    getControler(req, function (err, controler) {
        if (err)
            next(err);
        else {
            /* Appel de la méthode du bean via une callback pour permettre
             * au bean d'exécuter des actions asynchrones et donc ne pas bloquer
             * l'application aux autres utilisateurs */
            // On ajoute la room
            req.session.controler = controler;
            //controler.params, controler.path, controler.data_model, controler.schema, controler.room
            controler.action(req, function (errBean, result) {
                // handling exception
                //-- @TODO Faire une gestion des exceptions plus fine !!
                if (errBean)
                    return next(handleError('OTF ERROR Controler Action failed', '501', "Controller Execution Failed for [" + req.session.controler.type + req.session.controler.path + "] Error Message [" + errBean + "]"));
                //
                logger.debug(" otf final %j", result);
                //
                // On gére le redirect pour l'authentification
                //@TODO try catch sur le renderer
                if (controler.isRedirect)
                    res.redirect('/' + req.session.controler.screen);
                else
                    res.render(req.session.controler.screen, result);
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


function checkAndCreateDirectory(directoryName, cb) {
    logger.debug('OTF call checkAndCreateDirectory for directory ' + directoryName);
    fs.exists(directoryName, function (exists) {
        if (!exists) {
            fs.mkdir(directoryName, '0777', function (err) {
                if (err) {
                    // if (err.code == 'EEXIST') {
                    //   return cb(null);
                    // } // ignore the error if the folder already exists
                    // else {
                    logger.debug("OTF Error to create Directory Upload File, message : " + err.toSting());
                    return cb(err);
                    //} // something else went wrong
                } //else cb(null); // successfully created folder
                logger.debug("OTF Create Directory : " + directoryName);
                //return cb(null);
            });

        }
        return cb(null);

    });
}


function uploadFile(req, filteredQuery, cb) {
    try {
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
            return cb(null);
        });


    } catch (err) {

        return cb(err);
    }


}

function handleError(title, status, message) {
    logger.error('[OTF:getController] ' + message);
    var error = new Error(title);
    error.status = status
    error.title = title;
    error.message = message;
    return error;
}

/**
 *
 * @type {otf}
 */
module.exports = otf;