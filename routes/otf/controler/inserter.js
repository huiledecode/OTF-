/*
* GET / POST inserter
* Il s'agit ici d'un Bean générique qui en fonction des données dans
* l'annuaire otf json est capable de faire un insert et d'insérer un
* ou des objets json dans le model passé dans l'annuaire.
*/
var logger = require('log4js').getLogger('css');
var mongoose = require('mongoose');
var genericModel = require(__dirname +'/../../../ressources/models/mongooseGeneric');

/*
 * SET users datas into MongoDB.
 */

exports.inserter = {
  one: function (params, path, model, schema, room, session, cb) {
    //@TODO not safety
    logger.debug('room   : ', room);
    logger.debug('model  : ' + model);
    logger.debug('params  : ' , params);
    //-- Accounts Model
    //var modele = mongoose.model(model);
    // Test Emit WebSocket Event
    logger.debug(" One User emmit call");
    sio.sockets.in(room).emit('user', {room: room, comment: ' One User\n\t Your Filter is :'});
    try {
      document = new genericModel.mongooseGeneric(path, schema, model);
      document.createDocument(params, function (err, nb_inserted) {
        logger.debug('nombre documents insérés :', nb_inserted);
        return cb(null, {data: nb_inserted, result: {account: session.account}, room: room});
      });
    } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
      modele = global.db.model(path);
      // requete ici si model existe dejà dans mongoose
      modele.create(params, function (err, nb_inserted) {
        logger.debug('nombre documents insérés : ', nb_inserted);
        return cb(null, {data: nb_inserted, result: {account: session.account}, room: room});
      });
    }

  },

  list: function(params, path, model, schema, room, session, cb) {
    // ici params est un tableau d'objet à insérer
    /* TODO écrire l'insertion générique d'une liste d'objets avec mongoDB, via mongoose. */

  }
};