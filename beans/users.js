/*
 * GET users listing.
 */
var logger = require('log4js').getLogger('users');
logger.setLevel(GLOBAL.config["LOGS"].level);
var mongoose = require('mongoose');

/*
 * GET users listing.
 */

exports.users = {
    list: function (req, cb) {
        var _controler = req.session.controler;
        logger.debug('params : ', _controler.params);
        //
        var modele = mongoose.model(_controler.data_model);
        //
        modele.find({}, function (err, list_users) {
            logger.debug('liste des utilisateurs :', list_users);
            return cb(null, {result: list_users, room: _controler.room});
        });
    },

    one: function (req, cb) {
        var _controler = req.session.controler;
        logger.debug('params : ', _controler.params);
        logger.debug('model : ' + _controler.data_model);
        //-- Accounts Model
        var modele = mongoose.model(_controler.data_model);

        modele.find(_controler.params, function (err, one_user) {
            logger.debug('Utilisateur sélectionné : ', one_user);
            return cb(null, {result: one_user, room: _controler.room});
        });
    }

    /* Todo : Réfléchir à l'insertion dans MongoDB de façon aussi générique que le find.
     Todo : voir du côté des schémas mongoose qui permette 'insérer directement un bodyContents ??
     */
};

