/*
 * GET / POST inserter
 * Il s'agit ici d'un Bean générique qui en fonction des données dans
 * l'annuaire otf json est capable de faire un insert et d'insérer un
 * ou des objets json dans le model passé dans l'annuaire.
 */
var logger = require('log4js').getLogger('css');
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var genericModel = require(__dirname +'/../../../ressources/models/mongooseGeneric');

/*
 * SET users datas into MongoDB.
 */

exports.updater = {
  one: function (values, path, model, schema, room, cb) {
    // ici params est un objet simple à insérer
    var theId = values._id;
    delete values._id;
    logger.debug('params updater : ' , values);
    try {
      document = new genericModel.mongooseGeneric(path, schema, model);
      document.updateDocument({_id : theId}, values, function (err, numberAffected) {
        if (err) {
          logger.info('----> error : ' + err);
        } else {
          logger.debug('modification utilisateur : ', numberAffected);
          return cb(null, {data: numberAffected, room: room});
        }
      });
    } catch (errc) { // si existe pas alors exception et on l'intègre via mongooseGeneric
      logger.debug('----> error catch : ' + errc);
      modele = global.db.model(path);
      // requete ici si model existe dejà dans mongoose
      modele.update({_id : theId}, values, function (err, numberAffected) {
        if (err) {
          logger.info('---> error : ' + err) ;
        } else {
          logger.debug('Utilisateur sélectionné : ', numberAffected);
          return cb(null, {data: numberAffected, room: room});
        }
      });
    }
  },

  list: function(params, path, model, schema, room, cb) {
    // ici params est un tableau d'objet à mettre à jour
    /* TODO écrire l'insertion générique d'une liste d'objets avec mongoDB, via mongoose. */

  }
};