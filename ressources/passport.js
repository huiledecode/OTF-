/**
 * Created by epa on 10/06/14.
 */
// config/passport.js
// load all the things we need
// var passport = require('passport');
var mongoose = require('mongoose');
var genericModel = require(__dirname + '../../ressources/models/mongooseGeneric');
var LocalStrategy = require('passport-local').Strategy;
//-- Schema account
require('./models/accounts');
//-- Accounts Model
var Accounts = mongoose.model('Accounts_User');

//var account;
// var Accounts = new accountModel();
// load up the user model
// console.log(__dirname);
// var Account = require('./account');
// var account = {
// 'login' : 'test',
// 'password' : 'abcd1234'
// };
// expose this function to our app using module.exports
module.exports = function(passport) {
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
        console.log("Passport SerializeUser  account : %j", account);
        done(null, account);
    });

    // used to deserialize the userpassport.deserializeUser is invoked on every request by passport.session.
    // It enables us to load additional user information on every request.
    // This user object is attached to the request as req.user making it accessible in our request handling.
    //
    passport.deserializeUser(function (account, done) {

        console.log("Passport DeserializeUser  account: %j", account);
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
            usernameField : 'login',
            passwordField : 'password',
            passReqToCallback : true
            // allows us to pass back the entire request to the
            // callback
        },
        // -- Check auth account i DB
        function(req, login, password, done) {
            console.log('\tPassport  login [%s], password: [%s], body [%s]',
                login, password, req.body);

            // asynchronous
            process.nextTick(function() {
                // search an if exist load account with login req.param.login
                //account = new Accounts({"login":"toto","password":"tita"});
                //account.save();
                //Accounts.update({"_id":"5398f5fe2900db2d71c0e86b"},{ $set: {"login":"fake"}});
                //--
                Accounts.findOne({
                    login : login
                }, function(err, _account) {
                    // --
                    if (err) {
                        console.log("\tPassport account read db err message : [%s]", err.message);
                        return done(err);
                    }
                    console.log('PASSEPORT _account : ', _account);
                    if (!_account) {
                        console.log("\tPassport account not found in db for login : [%j]",
                            login);
                        return done(null, false);
                    } else {
                        //Verification the user Identification
                        console.log("\tPassport account find : [%j], session id [%s]",
                            _account, req.sessionID);
                        if (login === _account.login
                            && password === _account.password) {
                            // On doit aussi load l'annuaire des authorisations pour
                            // le
                            // mettre dans la session le compte
                            //req.session.account = _account;
                            // -- req.session.annuaire =
                            return done(null, _account);
                        } else {
                            //Bab Password
                            return done(null, false);
                        }
                        ;
                    }

                });
            });// ~ nextTick
        }));

};
