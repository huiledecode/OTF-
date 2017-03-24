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

    /** TODO écrire l'insertion générique d'une liste d'objets avec mongoDB, via mongoose. */
    list: function (req, cb) {
        var _controler = req.session.controler;
        var model = GLOBAL.schemas[_controler.data_model];
        logger.debug('path    : ', _controler.path);
        logger.debug('room    : ', _controler.room);
        logger.debug('model   : ', _controler.data_model);
        logger.debug('params  : ', _controler.params);
        logger.debug('schema  : ', _controler.schema);
        //-- Accounts Model
        //var modele = mongoose.model(model);
        // Test Emit WebSocket Event
        var dataArray = _controler.params;
        var nbInserted =null;
        function insertArray(i, cbk) {
            logger.debug(" List inserter call");
            //sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' One User\n\t Your Filter is :'});
            try {
                if (i < dataArray.length) {
                    model.createDocument(dataArray[i], function (err, nb_inserted) {
                        nbInserted = nb_inserted;
                        logger.debug("objet inséré via inserter.list : ", dataArray[i]);
                        insertArray(i+1, cbk);
                    });
                } else {
                    cbk();
                }
            } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
                return cb(err);
            }

        }

        insertArray(0, function () {
            logger.debug('nombre documents insérés :', nbInserted);
            return cb(null, {data: nbInserted, room: _controler.room});
        });

    }
};