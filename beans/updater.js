/*
 * GET / POST inserter
 * Il s'agit ici d'un Bean générique qui en fonction des données dans
 * l'annuaire otf json est capable de faire un insert et d'insérer un
 * ou des objets json dans le model passé dans l'annuaire.
 */
var logger = require('log4js').getLogger('updater');
logger.setLevel(GLOBAL.config["LOGS"].level);
var mongoose = require('mongoose');
var genericModel = require('../otf_core/lib/otf_mongooseGeneric');

/*
 * SET users datas into MongoDB.
 */

exports.updater = {
    one: function (req, cb) {
        var _controler = req.session.controler;
        var values = _controler.params;
        // ici params est un objet simple à insérer
        var theId = values._id;
        delete values._id;
        var model = GLOBAL.schemas[_controler.data_model];
        logger.debug('params updater : ', values);
        try {
            model.updateDocument({_id: theId}, values, function (err, numberAffected) {
                if (err) {
                    logger.info('----> error : ' + err);
                } else {
                    logger.debug('modification utilisateur : ', numberAffected);
                    return cb(null, {data: numberAffected, room: _controler.room});
                }
            });
        } catch (errc) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.debug('----> error catch : ' + errc);
            return cb(err);
        }
    },

    list: function (req, cb) {
        var _controler = req.session.controler;
        // ici params est un tableau d'objet à mettre à jour
        /* TODO écrire l'insertion générique d'une liste d'objets avec mongoDB, via mongoose. */

    }
};