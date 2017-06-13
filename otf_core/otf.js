/**
 * Created by epa on 10/06/14.
 * Modified by SMA on 16/09/2014
 */
var fs = require('fs');
var multiparty = require('multiparty');
var util = require('util');
var logger = require('log4js').getLogger('otf');
logger.setLevel(GLOBAL.config["LOGS"].level);
var express = require('express');
var router = express.Router();
var appContext;
var managerSession;
var passport = require('passport');
var url = require("url");
var _ = require('underscore');
//GLOBAL.whoWhat = new Array();
//-- load annuaire file in sync mode
//


//---
// Fonction exportées pour paramétrer OTF
// Attention à l'odre des router.use et router.get et router.post
function otf(app, sessionStore) {
    //
    managerSession = sessionStore;

//-- Context applicatif
    appContext = app;
//-- Trace
    router.use(logHttpRequest);// -- LogHttpREquest
// -- Perform OTF Automate action
    router.use(otfAction);
//-- Error Handler if otf_core throw error
    router.use(errorHandler);
    //
    appContext.use('/', router);

}

//--
// Build the action Controller
//--
function getControler(req, cb) {
    //-- profile du user connecté
    var annuaire;
    // --
    //var acceptableFields = null;
    var filteredQuery = {}; // clause where de la requête MongoDB
    //var sessionData = {}; // info à passer au bean contenu dans la session
    var path;
    var modele; // Mongoose Schema modele
    var models; //SQL Sequelize models
    var schema;
    var type;
    var auth;
    var module;
    var methode;
    var screen;
    var controler = {};
    var redirect;
    var redirect_action;
    var ref;
    var content_type = req.headers['content-type'];
    var return_type;
    var sql_request;
    var no_cache;
    //--
    //-- USER PROFILE
    if (req.session.profile) {
        logger.debug("OTF² User Profile is %s", req.session.profile);
        annuaire = GLOBAL.profiles[req.session.profile];
    } else {
        logger.debug("OTF² User Profile is default");
        annuaire = GLOBAL.profiles["default"];
    }

    //--
    //-- ACTION NAME
    //
    path = url.parse(req.url).pathname;
    // -- GET, POST,DELETE, etc ..
    type = req.method;
    //-- test existance dans l'annuaire
    if (typeof annuaire[type + path] == 'undefined')
        return cb(handleError('OTF ERROR Action not implemented', '501', "Action not implemented for URL [" + type + path + "]"));

	// -- cache behavior
	no_cache=annuaire[type + path].no_cache;
	if (typeof no_cache == 'undefined'){no_cache=false};
    // -- Authentificate flag

    auth = annuaire[type + path].auth;
    if (typeof auth == 'undefined')
        return cb(handleError('OTF ERROR Authentification Flag not implemented', '501', "Authentification Flag not implemented in Annuaire for URL [" + type + path + "]"));

    // -- RedirectFlag flag
    redirect = annuaire[type + path].redirect;
    if (typeof redirect == 'undefined')
        redirect = false;

    // -- sql_request for SQL beans
    sql_request = annuaire[type + path].sql_request;


    // -- check Authentificate flag
    //@TODO GERER ÇA PAR L'ANNUAIRE
    if (auth && (!req.isAuthenticated() || typeof req.session.passport == 'undefined')) {
        logger.debug("OTF Protected Page, User not identify, Redirect for Login Page. ");// redirect to loggin
        module = 'login';
        methode = 'titre';
        screen = 'login';
        redirect = true;
        redirect_action = 'login';
    } else if (!auth) {
        logger.debug("OTF² Page non sécurisée  [session id : [%s] ]", req.sessionID);// redirect to redirect_action
        module = annuaire[type + path].module;
        methode = annuaire[type + path].methode;
        screen = annuaire[type + path].screen;
        redirect_action = annuaire[type + path].redirect_action;
    } else if (req.user !== 'undefined') {
        logger.debug("OTF² Page sécurisée & authentifiée [ user %j], [session id : [%s] ]", req.user, req.sessionID);// redirect to loggin
        module = annuaire[type + path].module;
        methode = annuaire[type + path].methode;
        screen = annuaire[type + path].screen;
        redirect_action = annuaire[type + path].redirect_action;
    }
    // --
    // --
    if (module && methode) {
        // -- Load module in otf_module
        try {

            instanceModule = require('../beans/' + module);
        } catch (err) {
            return cb(handleError('OTF ERROR Loading Module Error', '501', "Loading Module Error for URL [" + type + path + "] and Module [" + module + "], message [" + err.toString() + "]"));
        }
        if (typeof instanceModule == 'undefined')
            return cb(handleError('OTF ERROR Loading Module is undefined', '501', "Loading Module Error for URL [" + type + path + "] and Module [" + module + "]"));

    }
    //data_acceptableFields = annuaire[type + path].session_names;
    modele = annuaire[type + path].data_model;
    ref = annuaire[type + path].data_ref;
    //schema = annuaire_schema[path].schema;
    //@TODO Le modele est il obligatoire ???
    //
    if (methode !== 'undefined') {
        action = instanceModule[module][methode];
    } else {
        action = instanceModule[module]['execute'];
    }
    // --
    // -- content-type parameter to send data to client
    if (typeof annuaire[type + path].return_type == 'undefined') {
        return_type = "text/html";
    } else return_type = annuaire[type + path].return_type;
    // --
    // -- Add SQL models to controler, it is necessary to use SQL Models into Beans.
    if (typeof appContext.get('models') != 'undefined') {
        models = appContext.get('models')[modele];
    }
    // --
    // -- beans data structure with HTTP parameters
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
        'data_ref': ref,
        'content_type' : return_type,
        //'schema': schema,
        'isRedirect': redirect,
        'redirect_action': redirect_action,
        'sql_request': sql_request,
        'models': models,
        'no_cache':no_cache
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
    //-- la variable beans est visible dans la fonction appelante

} // fin function getControler(...)

// --
function logHttpRequest(req, res, next) {
    logger.debug("\nOTF² app Log Handler [ %s %s ]", req.method, req.url);
    next();
}

// --
// -- Traite la requête par le routeur dynamique de OTF
// --
function otfAction(req, res, next) {// attention il ne
    // --
    logger.debug('OTF² build Action [ URL [type : %s], [Path : %s] [REMOTE IP : %s]', req.method, req.url, req.connection.remoteAddress);
    //logger.debug(" Test Context Applicatif  by app.set %s", appContext.get('test'));
    //logger.debug(" Test Context Applicatif  by app.locals %s", appContext.locals.test);
    // --
    getControler(req, function (err, controler) {
        //console.log('controler : ', controler);
        if (err)
            if (err.title == 'OTF ERROR Action not implemented') res.redirect('/login?');
            else next(err);
        else {
            /* Appel de la méthode du bean via une callback pour permettre
             * au bean d'exécuter des actions asynchrones et donc ne pas bloquer
             * l'application aux autres utilisateurs */
            req.session.controler = controler;
            //beans.params, beans.path, beans.data_model, beans.schema, beans.room
            controler.action(req, function (errBean, result) {
				//manage cache behavior
				if (req.session.controler.no_cache){
					//Disable cache to prevent back button showing previous pages after logout
					logger.info("OTF² is configured to disable cache browser for this request");
					res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
					res.header('Expires', '-1');
					res.header('Pragma', 'no-cache');
				};
								
                result.url = controler.path;  // pour corriger un bug ? pas d'url en variable globale dans handlebars pour menu-treeview
                var t1 = new Date().getMilliseconds();
                // handling exception
                //-- @TODO Faire une gestion des exceptions plus fine !!
                if (errBean)
                    return next(handleError('OTF ERROR Controler Action failed', '501', "Controller Execution Failed for [" + req.session.controler.type + req.session.controler.path + "] Error Message [" + errBean + "]"));
                //
                logger.debug("OTF² Controler Action Return %j", result);
                //
                // inscription dans un tableau de qui fait quoi pour le push des données oplog ?
                // GLOBAL.whoWhat[req.sessionID] = {"what" :req.url, "data_model" : req.session.controler.data_model };
                // On gére le redirect pour l'authentification
                //@TODO try catch sur le renderer
                if (controler.isRedirect) {
                    logger.debug('Params sur redirect :' , controler.params);
                    
                    //Pour transférer les params au redirect screen avec les éventuels messages flash
                    req.session.params = controler.params;

                    req.session.params = addFlashToResult(req.flash(), req.session.params);

                    /** Todo add controler params for redirect action */
                    var propertiesNames = Object.keys(controler.params);
                    logger.debug('PropertiesNames redirect :' , propertiesNames);
                    var params ="?";

                    for (var k=0;k<propertiesNames.length;k++) {
                        if ((propertiesNames[k] != 'password') && (propertiesNames[k] != 'passwd')) {
                            params += propertiesNames[k] + '=' + controler.params[propertiesNames[k]] + '&';
                        }
                    }
                    logger.debug('redirect_action : ' + req.session.controler.redirect_action);

                    res.redirect('/' + req.session.controler.redirect_action + params);
                    //res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                    // res.writeHead(301, {'content-type': 'text/html'});
                    res.end();
                }

                else {
                  var t2 = new Date().getMilliseconds();
                  logger.info('controler.action callback TIME(ms) : ' + (t2-t1) + ' ms');
                    if (controler.content_type == 'text/html') {
                        result = addFlashToResult(req.flash(), result);
//logger.debug('###### Controleur retour vue getview avec result : ', result);
//logger.debug('###### Controleur req.flash error ? : ', req.flash());
                        if (typeof result.result != 'undefined') {
                            result.result.params = controler.params;
                            result.result.params.str = JSON.stringify(controler.params);
                        }
                        else {
                            result.params = controler.params;
                            result.params.str = JSON.stringify(controler.params);
                        }
                        res.render(req.session.controler.screen, result);
                    } else {
                        res.setHeader('Content-Type', controler.content_type);
                        if (controler.content_type !='application/vnd.openxmlformats')
                           res.send(result.result);
                        else
                           res.setHeader("Content-Disposition", "attachment; filename=" + 'Export_'+ new Date().getMilliseconds() +'.xlsx');
                           res.end(result, 'binary');
                    }
                }
            });
        }
    });
}

function addFlashToResult(flash, result){
  if(_.isEmpty(flash))
    return result;
  if(!result.flash)
    result.flash = flash;
  else{
    var flashResult = result.flash;
    for (prop in flash){
      if(flashResult[prop])
        Array.prototype.push.apply(flashResult[prop], flash[prop]);
      else
        flashResult[prop] = flash[prop];
    }
  }
  return result;
}
// --
// -- Gestion des erreurs Si erreur lors du traitement de la requête par le
// routeur dynamique de OTF
// Attention de ne pas oublier l'argument next sinon le milddleware express de la traite pas comme un gestionneire d'erreur
// --
function errorHandler(err, req, res, next) {
    var status = err.status || '500';
    logger.error(
            "OTF² Error Handler Http Status Code " + status + " Error cause by : [%s]", err.message);
    res.status(status);
    var ret = {title: err.title, status: status, message: err.message};
    res.render('501', ret);
    return; // end of treath
};


function checkAndCreateDirectory(directoryName, cb) {
    logger.debug('OTF² call checkAndCreateDirectory for directory ' + directoryName);
    fs.exists(directoryName, function (exists) {
        if (!exists) {
            fs.mkdir(directoryName, '0777', function (err) {
                if (err) {
                    // if (err.code == 'EEXIST') {
                    //   return cb(null);
                    // } // ignore the error if the folder already exists
                    // else {
                    logger.debug("OTF² Error to create Directory Upload File, message : " + err.toSting());
                    return cb(err);
                    //} // something else went wrong
                } //else cb(null); // successfully created folder
                logger.debug("OTF² Create Directory : " + directoryName);
                return cb(null);
            });

        } else
            return cb(null);

    });
}


function uploadFile(req, filteredQuery, cb) {
    try {
        var form = new multiparty.Form({uploadDir: './public/uploads'});
        form.parse(req, function (err, fields, files) {
            console.log('----> fields : ', fields);
            console.log('----> files : ', files);
            // Tempôraire avant renomage dans le bean
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
            // -- set session otf_core beans
            return cb(null);
        });


    } catch (err) {

        return cb(err);
    }


}

function handleError(title, status, message) {
    logger.error('[OTF²:getController] ' + message);
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
