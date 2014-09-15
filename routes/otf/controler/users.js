
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
    list: function (cb) {
        Accounts.find({}, function (err, list_users) {
            logger.debug('liste des utilisateurs :', list_users);
            return cb(null, {result: list_users});
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