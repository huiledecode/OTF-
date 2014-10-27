/*
 * GET / POST finding
 * Il s'agit ici d'un Bean générique qui en fonction des données dans
 * l'annuaire otf json est capable de faire un find et de retourner
 * un objet json contenant le resultat de la requête.
 */
var logger = require('log4js').getLogger('css');
var mongoose = require('mongoose');
var genericModel = require(__dirname +'/../../../ressources/models/mongooseGeneric');

/*
 * GET users listing.
 */

exports.finder = {
  list: function (params, path, model, schema, room, cb) {
    var document;
    logger.debug('params : ', params);
    logger.debug('schema : ', schema);
    //var modele = mongoose.model(model);
    logger.debug('global.annuaire_schema avant : ', global.annuaire_schema);
    // On passe à mongooseGeneric le path unique pour l'action,
    // comme identifiant de modèle si il n'est pas déjà compilé
    // dans mongoose
    // Test emit WebSocket Event
    logger.debug(" One User emmit call");
    sio.sockets.in(room).emit('user', {room: room, comment: ' List of Users\n\t Your Filter is : *'});
    try {
      document = new genericModel.mongooseGeneric(path, schema, model);
      document.getDocuments({}, function (err, list_users) {
        logger.debug('liste des utilisateurs :', list_users);
        return cb(null, {result: list_users, room: room});
      });
    } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
      modele = global.db.model(path);
      // requete ici si model existe dejà dans mongoose
      modele.find(params, function (err, list_users) {
        logger.debug('Utilisateur sélectionné : ', list_users);
        return cb(null, {result: list_users, room: room});
      });
    }
  },

  one: function (params, path, model, schema, room, cb) {
      //@TODO not safety
      logger.debug('params : ', params['login'].source);
      logger.debug('room   : ', room);
      logger.debug('model  : ' + model);
      //-- Accounts Model
      //var modele = mongoose.model(model);
    logger.debug('global.annuaire_schema avant : ', global.annuaire_schema);
    // On passe à mongooseGeneric le path unique pour l'action,
    // comme identifiant de modèle si il n'est pas déjà compilé
    // dans mongoose
    // Test emit WebSocket Event
    logger.debug(" One User emmit call");
    sio.sockets.in(room).emit('user', {room: room, comment: ' List of Users\n\t Your Filter is : *'});
    try {
      document = new genericModel.mongooseGeneric(path, schema, model);
      document.getDocuments(params, function (err, one_user) {
        logger.debug('liste des utilisateurs :', one_user);
        return cb(null, {result: one_user, room: room});
      });
    } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
      modele = global.db.model(path);
      // requete ici si model existe dejà dans mongoose
      modele.findOne(params, function (err, one_user) {  //on utilise findOne sinon on a un Array en retour
        logger.debug('Utilisateur sélectionné : ', one_user);
        return cb(null, {result: one_user, room: room});
      });
    }
  }

  /* Todo : Réfléchir à l'insertion dans MongoDB de façon aussi générique que le find.
   Todo : voir du côté des schémas mongoose qui permette 'insérer directement un bodyContents ??
   */
};