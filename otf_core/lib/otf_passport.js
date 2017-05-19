/**
 * Created by epa on 10/06/14.
 */
// config/otf_passport.js
// load all the things we need
var passport = require('passport');
var mongoose = require('mongoose');
var logger = require('log4js').getLogger('otf_passport');
logger.setLevel(GLOBAL.config["LOGS"].level);
var genericModel = require(__dirname + '/otf_mongooseGeneric');
var LocalStrategy = require('passport-local').Strategy;
// expose this function to our app using module.exports
module.exports = function (app) {
    //http://toon.io/understanding-passportjs-authentication-flow/
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    //This method can access the user object we passed back to the middleware. It's its job to determine
    // what data from the user object should be stored in the session.
    // The result of the serializeUser method is attached to the session as req.session.passport.user =
    passport.serializeUser(function (account, done) {
        //C'est Ici que le profil du user doit être loader
        logger.debug("OTF² Passport SerializeUser  account : %j", account);
        done(null, account);
    });

    // used to deserialize the userpassport.deserializeUser is invoked on every request by passport.session.
    // It enables us to load additional user information on every request.
    // This user object is attached to the request as req.user making it accessible in our request handling.
    //
    passport.deserializeUser(function (account, done) {
        logger.debug("OTF² Passport DeserializeUser  account: %j", account);
        done(null, account);

    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for
    // signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local', new LocalStrategy({
            // by default, local strategy uses username and password, we will
            // override with email
            usernameField: 'login',
            passwordField: 'password',
            passReqToCallback: true
            // allows us to pass back the entire request to the
            // callback
        },
        // -- Check auth account in DB
        function (req, login, password, done) {
            logger.debug('OTF² Passport  login [%s], password: [%s], body [%s]',
                login, password, req.body);
            var Accounts = GLOBAL.schemas['Accounts'];
            // asynchronous
            process.nextTick(function () {
                //--
                Accounts.popDocument({  //popDocuments(_params, function (err, list) {
                    query: {login: login},
                    ref: ["role"]
                }, function (err, _account) {
                    // --
                    if (err) {
                        logger.debug("OTF² Passport account read db err message : [%s]", err.message);
                        return done(err);
                    }
                    logger.debug('OTF² PASSEPORT _account : ', _account);
                    if (!_account) {
                        logger.debug("OTF² Passport account not found in db for login : [%j]",
                            login);
                        return done(null, false, {"flag": "login", "login": login, "message": 'Passport account not found in db for login : ' + login  });
                    } else {
                        //-- load du profile et affectation à la session
                        //-- If profile exist
                        if (_account.role.code == 'undefined')
                            req.session.profile = 'default';
                        else
                            req.session.profile = _account.role.code;
                        //Verification the user Identification
                        logger.debug("OTF² Passport account find : [%j], session id [%s]", _account, req.sessionID);
                        //-
                        //Test Password
                        if (login === _account.login && password === _account.password) {
                            return done(null, _account, {"flag": "ok", "login": login, "message": null  });
                        } else {
                            //Bab Password
                            return done(null, false, {"flag": "password", "login": login, "message": 'Passport Bad Password for login : ' + login  });
                        }
                        ;
                    }

                });
            });// ~ nextTick
        }));
    /* function (req, login, password, done) {
        logger.debug('OTF² Passport  login [%s], password: [%s], body [%s]', login, password, req.body);
        var ExtraUser = GLOBAL.schemas['ExtraUser'];
        // asynchronous
        process.nextTick(function () {*/
            /** todo : Faire un test sur le type de base de données pour l'authentification au back office */
    /*        if (GLOBAL.config['AUTH'].db === 'NoSQL') {
                ExtraUser.popDocument({
                        query: {login: login},
                        ref: ["role", "groupes", "usagers", "option"]
                    }, function (err, _account) {
                        manageAuthentif(null, req, _account, done);
                    }
                );
            } else {  // if not NoSQL so is SQL*/
                /** todo : ici faire la connexion avec la base de données SQL login / passwd */
    /*            dbSeq.db.sequelize
                    .query(GLOBAL.config['AUTH'].request, {replacements: { login: login, password: password}, type: dbSeq.db.sequelize.QueryTypes.SELECT})
                    .then(function(_account) {
                        _account[0].role = { _id : _account[0].ROLE_ID, code: _account[0].CODE, libelle: _account[0].LIBELLE};
                        manageAuthentif(null, req, _account[0], done);
                    });
            }

        });// ~ nextTick
    }));*/
    //
    app.use(passport.initialize());
    app.use(passport.session());

};
