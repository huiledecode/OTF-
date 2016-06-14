/*
 * GET / POST inserter
 * Il s'agit ici d'un Bean générique qui en fonction des données dans
 * l'annuaire otf json est capable de faire un insert et d'insérer un
 * ou des objets json dans le model passé dans l'annuaire.
 */
var logger = require('log4js').getLogger('inserter');
logger.setLevel(GLOBAL.config["LOGS"].level);
var mongoose = require('mongoose');
//var genericModel = require(__dirname + '/../../../ressources/models/mongooseGeneric');

/*
 * SET users datas into MongoDB.
 */

exports.inserter = {
    one: function (req, cb) {
        var _controler = req.session.controler;
        var model = GLOBAL.schemas[_controler.data_model];
        //@TODO not safety
        logger.debug('path    : ', _controler.path);
        logger.debug('room    : ', _controler.room);
        logger.debug('model   : ', _controler.data_model);
        logger.debug('params  : ', _controler.params);
        logger.debug('schema  : ', _controler.schema);
        //-- Accounts Model
        //var modele = mongoose.model(model);
        // Test Emit WebSocket Event
        logger.debug(" One User emmit call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' One User\n\t Your Filter is :'});
        try {
            model.createDocument(_controler.params, function (err, nb_inserted) {
                logger.debug('nombre documents insérés :', nb_inserted);
                return cb(null, {data: nb_inserted, room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            return cb(err);
        }

    },

    list: function (req, cb) {
        var _controler = req.session.controler;
        // ici params est un tableau d'objet à insérer
        /* TODO écrire l'insertion générique d'une liste d'objets avec mongoDB, via mongoose. */

    }
};