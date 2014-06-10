/**
 * Created by epa on 10/06/14.
 */
    var express = require('express');
    var router = express.Router();
    var passport = require('passport');
    var url = require("url");
    //-- load annuaire file in sync mode
    var annuaire;
    annuaire = JSON.parse(require('fs').readFileSync(
            __dirname + '/otf_annuaire.json', 'utf8'));
    console.log("\tOTF Otf.prototype.performAction Annuaire  : \n[\n%j\n]\n",
        annuaire);
    //--
    var getControler = function (req, cb) {
        // --
        path = url.parse(req.url).pathname;
        if (!path) {
            err = "{'error':' url parse error for path [%s]',path}";
            return cb(err);
        }
        // -- GET, POST,DELETE, etc ..
        type = req.method;
        if (!type) {
            err = "{'error':' type parse error for path [%s]',path}";
            return cb(err);
        }

        // -- Authentificate flag
        auth = annuaire[type + path].auth;

        // -- check Authentificate flag
        if (auth && !req.isAuthenticated()) {
            console.log("\tOTF Page sécurisée,demande d'authentification. ");// redirect to loggin
            module = 'login';
            methode = 'titre';
            screen = 'login';
        } else {
            console.log("\tOTF Account authentifier [ account %j], [session id : [%s] ]",req.session.account,req.sessionID);// redirect to loggin
            module = annuaire[type + path].module;
            methode = annuaire[type + path].methode;
            screen = annuaire[type + path].screen;
        }
        // --
        // --
        if (module && methode && screen) {
            // -- Load module in otf_module
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
        // -- controler data structure
        controler = {
            'auth' : auth,
            'module' : module,
            'methode' : methode,
            'screen' : screen,
            'action' : action
        };
        // -- set session otf controler
        req.session.otf = controler;
        // -- call the callback
        //-- la variable controller est visible dans la fonction appellente
        return cb(null);

    };
    //--
    var performAction = function(req, callback) {

        // --
        console.log("\tOTF  [ URL [type : %s], [Path : %s] ", req.method,req.url);
        // --
        // -- build controler
        getControler(req, function cb(err) {
            if (err) {
                // --
                console.log("\tOTF getController ERROR [%j]", err);
                callback(err, null);
            } else {
                // --
                console.log("\tOTF controler     :  [%j]",controler);
                console.log("\tOTF Session.otf   :  [%j]", req.session.otf);
                // --
                callback(null, controler );
            }
        }); // ~ getController
    };
    // --
    var logHttpRequest = function (req, res, next) {
        console.log("\napp Log Handler [ %s %s ]", req.method, req.url);
        next();
    };
    // --
    // -- Signup Accounts
    // --
    var signupAccount = function (req, res, next) {
        console.log("\napp signup Account [ %s %s %j]", req.method, req.url,
            req.body);
        //-- Authetificate, becarefull is a function
        passport.authenticate(
            'local',
            function(err, account) {

                // next();
                if (err) {
                    console.log("APP authenticate  signupAccount ERROR [%s]",
                        err);
                    return next(err); // will generate a 500 error
                }
                ;
                if (!account) {
                    console.log("APP authenticate  signupAccount Fail ");
                    return res.redirect('/login');
                }
                // if everything's OK
                // create objects in session
                req.logIn(account, function(err) {
                    if (err) {
                        console.log("APP logIn ERROR   account : [%j]",
                            account);
                        req.session.messages = "Error logIn";
                        return next(err);
                    }
                    console.log("APP authenticate   account : [%j,  session id : [%s]]",
                        account,req.sessionID);
                    // set the message
                    req.session.messages = {
                        'title' : 'Login successfully ' + account.login
                    };
                    //- je trouve que le redirect est meilleur car sinon avec le render l'ur affichée sur le browser est toujour /signup et pas /
                    //- ou autre path dans l'annuaire
                    //return res.redirect('/');
                    return res.render('index', {'title': "Bienvenue "+req.session.account.login+" votre votre n° de session  est "+req.sessionID});
                });

            })(req, res, next);

    };
    //--
    var logOut = function(req,res){
        // delete the account session
        req.logout();
        res.redirect('/login');
    };
    // --
    // -- Traite la requête par le routeur dynamique de OTF
    // --
    var otfAction = function (req, res, next) {// attention il ne
        // --
        console.log('\napp.js OTF buildAction [ %s %s ]', req.method, req.url);
        // --
        performAction(req, function(err, controler) {
            if (err)
                next(err);
            else {
                res.render(controler.screen, controler.action());
            }

        });
    };
    // --
// -- Gestion des erreurs Si erreur lors du traitement de la requête par le
// routeur dynamique de OTF
// --
    function errorHandler(err, req, res, next) {
        console
            .log(
            "APP OTF Handler status 500 Error cause by :  \n [\n %s \n] \n",
            err.stack);
        res.status(501);
        res.render('501', {
            title : 'Http Status 501: Action not implemented',
            error : err,
            url : req.method + req.url
        });
        return; // end of treath
    };
    // --logger
    router.use(logHttpRequest);// -- LogHttpREquest
//-- Authentificate Process

    //--
    router.post('/signup', signupAccount);

    //-- Logout Process
    router.get('/logout', logOut);

    // -- Perform OTF Automate action
    router.use(otfAction);

    //-- Error Handler if otf throw error
    router.use(errorHandler);// -- Error Handler After Otf Treath

module.exports = router;