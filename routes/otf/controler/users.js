
/*
 * GET users listing.
 */
var logger = require('log4js').getLogger('css');
var mongoose = require('mongoose');
//-- Accounts Model
var Accounts = mongoose.model('Accounts');

/*
 * GET users listing.
 */

exports.users = {
    list: function (params, cb) {
        logger.debug('params : ' , params);
        Accounts.find({}, function (err, list_users) {
            logger.debug('liste des utilisateurs :', list_users);
            return cb(null, {result: list_users});
        });
    },

    one: function (params, cb) {
        logger.debug('params : ' , params);
        /* TODO -> ici il faudra parser les params de façon plus générique pour les requêtes MongoDB
         * j'ai un plantage lorsque dans les paramètres de la requête Mongo je met :
         * Accounts.find({params['params_names'][0] :params['params_values'][0]}, function ... */
        //var login = params['params_names'][0];
        Accounts.find({login : params['params_values'][0]}, function (err, one_user) {
            logger.debug('Utilisateur sélectionné : ', one_user);
            return cb(null, {result: one_user});
        });
    }
};

//xports.users = {
//   list: function (){
//
//           return {title: ' test liste users'};
//       }
//   };
//