/**
 * Created by epa on 10/06/14.
 */
// config/passport.js
// load all the things we need
// var passport = require('passport');
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
//-- Schema account
require('./models/accounts');
//-- Accounts Model
var Accounts = mongoose.model('Accounts');
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

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(account, done) {
        done(null, account.login);
    });

    // used to deserialize the user
    passport.deserializeUser(function(login, done) {
        // done(null, account);
        Accounts.findOne({
            login : login
        }, function(err, account) {
            done(err, account);
        });
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
                        console.log("\tPassport account read db error : [%s]", err.message);
                        return done(null, false);
                    }

                    if (!_account) {
                        console.log("\tPassport account not found in db for login : [%j]",
                            search);
                        return done(null, false);
                    } else {
                        console.log("\tPassport account find : [%j], session id [%s]",
                            _account, req.sessionID);
                        if (login === _account.login
                            && password === _account.password) {
                            // On doit aussi load l'annuaire des authorisations pour
                            // le
                            // mettre dans la session le compte
                            req.session.account = _account;
                            // -- req.session.annuaire =
                            return done(null, _account);
                        } else {
                            return done(null, false);
                        }
                        ;
                    }

                });
            });// ~ nextTick
        }));

};
