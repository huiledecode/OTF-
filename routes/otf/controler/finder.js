/*
 * GET / POST finding
 * Il s'agit ici d'un Bean générique qui en fonction des données dans
 * l'annuaire otf json est capable de faire un find et de retourner
 * un objet json contenant le resultat de la requête.
 * Pour le moement il s'agit de requête simple en fonction d'un objet
 * passé en paramètre du find.
 */
var logger = require('log4js').getLogger('css');
var mongoose = require('mongoose');

/*
 * GET users listing.
 */

exports.finder = {
    list: function (params, model, room, cb) {
        logger.debug('params : ', params);
        var modele = mongoose.model(model);
        // Test emit WebSocket Event
        logger.debug(" One User emmit call");
        sio.sockets.in(room).emit('user', {room: room, comment: ' List of Users\n\t Your Filter is : *'});
        modele.find({}, function (err, list_users) {
            logger.debug('liste des utilisateurs :', list_users);
            return cb(null, {result: list_users, room: room});
        });
    },

    one: function (params, model, room, cb) {
        //@TODO not safety
        logger.debug('params : ', params['login'].source);
        logger.debug('room   : ', room);
        logger.debug('model  : ' + model);
        //-- Accounts Model
        var modele = mongoose.model(model);
        // Test Emit WebSocket Event
        logger.debug(" One User emmit call");
        sio.sockets.in(room).emit('user', {room: room, comment: ' One User\n\t Your Filter is :' + params['login'].source});
        modele.find(params, function (err, one_user) {
            logger.debug('Utilisateur sélectionné : ', one_user);
            return cb(null, {result: one_user, room: room});
        });

    }

    /* Todo : Réfléchir à l'insertion dans MongoDB de façon aussi générique que le find.
     Todo : voir du côté des schémas mongoose qui permette 'insérer directement un bodyContents ??
     */
};