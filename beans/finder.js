/*
 * GET / POST finding
 * Il s'agit ici d'un Bean générique qui en fonction des données dans
 * l'annuaire otf json est capable de faire un find et de retourner
 * un objet json contenant le resultat de la requête.
 */
var logger = require('log4js').getLogger('css');
var mongoose = require('mongoose');
var genericModel = require('../otf/lib/otf_mongooseGeneric');

/*
 * GET users listing.
 */

exports.finder = {
    list: function (req, cb) {
        var _controler = req.session.controler;
        //var modele = mongoose.model(model);
        //logger.debug('global.annuaire_schema avant : ', global.annuaire_schema);
        // On passe à mongooseGeneric le path unique pour l'action,
        // comme identifiant de modèle si il n'est pas déjà compilé
        // dans mongoose
        // Test emit WebSocket Event
        logger.debug(" Finder.list call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        try {
            var model = GLOBAL.schemas[_controler.data_model];
            model.getDocuments({}, function (err, list_users) {
                logger.debug('liste des utilisateurs :', JSON.stringify(list_users));
                return cb(null, {result: list_users, "state": req.session.login_info.state, room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    },

    one: function (req, cb) {
        //
        var _controler = req.session.controler;
        //@TODO not safety
        logger.debug('Finders.one params  : ', _controler.params);
        //logger.debug('Finders.one params  : ', _controler.params['login'].source);
        logger.debug('Finders.one room    : ', _controler.room);
        logger.debug('Finders.one model   : ' + _controler.data_model);
        logger.debug('Finders.one schema  : ' + _controler.schema);
        // Test emit WebSocket Event
        logger.debug(" One User emmit call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        try {
            var model = GLOBAL.schemas[_controler.data_model];
            model.getDocument(_controler.params, function (err, one_user) {
                logger.debug('liste des utilisateurs :', one_user);
                return cb(null, {result: one_user, "state": req.session.login_info.state, room: _controler.room});
            });

        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    },
    populate: function (req, cb) {
        var _controler = req.session.controler;
        //var modele = mongoose.model(model);
        //logger.debug('global.annuaire_schema avant : ', global.annuaire_schema);
        // On passe à mongooseGeneric le path unique pour l'action,
        // comme identifiant de modèle si il n'est pas déjà compilé
        // dans mongoose
        // Test emit WebSocket Event
        logger.debug(" Finder.list call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        try {
            var model = GLOBAL.schemas[_controler.data_model];
            var _params = { query: _controler.params, ref: _controler.data_ref};
            model.popDocuments(_params, function (err, list) {
                logger.debug('Populate Result  :', list);
                return cb(null, {result: list, "state": req.session.login_info.state, room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    }
};