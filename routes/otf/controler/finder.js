/*
 * GET / POST finding
 * Il s'agit ici d'un Bean générique qui en fonction des données dans
 * l'annuaire otf json est capable de faire un find et de retourner
 * un objet json contenant le resultat de la requête.
 */
var logger = require('log4js').getLogger('css');
var mongoose = require('mongoose');
var genericModel = require(__dirname + '/../../../ressources/models/mongooseGeneric');

/*
 * GET users listing.
 */

exports.finder = {
    list: function (req, cb) {
        var _controler = req.session.controler;
        var document;
        logger.debug('params : ', _controler.params);
        logger.debug('schema : ', _controler.schema);
        //var modele = mongoose.model(model);
        //logger.debug('global.annuaire_schema avant : ', global.annuaire_schema);
        // On passe à mongooseGeneric le path unique pour l'action,
        // comme identifiant de modèle si il n'est pas déjà compilé
        // dans mongoose
        // Test emit WebSocket Event
        logger.debug(" Finder.list call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        try {
            document = new genericModel.mongooseGeneric(_controler.path, _controler.schema, _controler.data_model);
            document.getDocuments({}, function (err, list_users) {
                logger.debug('liste des utilisateurs :', list_users);
                return cb(null, {result: list_users, room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            modele = global.db.model(_controler.path);
            // requete ici si model existe dejà dans mongoose
            modele.find(_controler.params, function (err, list_users) {
                logger.debug('Utilisateur sélectionné : ', list_users);
                return cb(null, {result: list_users, room: _controler.room});
            });
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
        //-- Accounts Model
        //var modele = mongoose.model(model);
        //logger.debug('global.annuaire_schema avant : ', global.annuaire_schema);
        // On passe à mongooseGeneric le path unique pour l'action,
        // comme identifiant de modèle si il n'est pas déjà compilé
        // dans mongoose
        // Test emit WebSocket Event
        logger.debug(" One User emmit call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        try {
            document = new genericModel.mongooseGeneric(_controler.path, _controler.schema, _controler.data_model);
            document.getDocuments(_controler.params, function (err, one_user) {
                logger.debug('liste des utilisateurs :', one_user);
                return cb(null, {result: one_user, room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            modele = global.db.model(_controler.path);
            // requete ici si model existe dejà dans mongoose
            modele.findOne(_controler.params, function (err, one_user) {  //on utilise findOne sinon on a un Array en retour
                logger.debug('Utilisateur sélectionné : ', one_user);
                return cb(null, {result: one_user, room: _controler.room});
            });
        }
    }

    /* Todo : Réfléchir à l'insertion dans MongoDB de façon aussi générique que le find.
     Todo : voir du côté des schémas mongoose qui permette 'insérer directement un bodyContents ??
     */
};