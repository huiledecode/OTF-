
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
        Accounts.find(params, function (err, one_user) {
            logger.debug('Utilisateur sélectionné : ', one_user);
            return cb(null, {result: one_user});
        });
    }

    /* Todo : Réfléchir à l'insertion dans MongoDB de façon aussi générique que le find.
       Todo : voir du côté des schémas mongoose qui permette 'insérer directement un bodyContents ??
     */
};

//xports.users = {
//   list: function (){
//
//           return {title: ' test liste users'};
//       }
//   };
//