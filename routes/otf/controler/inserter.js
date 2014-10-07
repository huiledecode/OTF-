/*
 * GET / POST inserter
 * Il s'agit ici d'un Bean générique qui en fonction des données dans
 * l'annuaire otf json est capable de faire un insert et d'insérer un
 * ou des objets json dans le model passé dans l'annuaire.
 */
var logger = require('log4js').getLogger('css');
var mongoose = require('mongoose');

/*
 * GET users listing.
 */

exports.inserter = {
    one: function (params, model, room, cb) {
        // ici params est un objet simple à insérer
        logger.debug('params inserter : ' , params);
        var modele = mongoose.model(model);
       var oneInsert = new modele(params);
        oneInsert.save(function (err) {
           if (err)
              logger.debug('Erreur inserter : ' + err);
           else
              return cb(null, {result : 'insert OK', room : room});
        });
    },

    list: function(params, model, room, cb) {
        // ici parmas est un tableau d'objet à insérer
        /* TODO écrire l'insertion générique d'une liste d'objets avec mongoDB, via mongoose. */

    }
};