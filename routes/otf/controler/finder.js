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
    list: function (params, model, cb) {
        logger.debug('params : ' , params);
        var modele = mongoose.model(model);

        modele.find({}, function (err, list_users) {
            logger.debug('liste des utilisateurs :', list_users);
            return cb(null, {result: list_users});
        });
    },

    one: function (params, model, cb) {
        logger.debug('params : ' , params);
        logger.debug('model : ' + model);
        //-- Accounts Model
        var modele = mongoose.model(model);

        modele.find(params, function (err, one_user) {
            logger.debug('Utilisateur sélectionné : ', one_user);
            return cb(null, {result: one_user});
        });
    }

    /* Todo : Réfléchir à l'insertion dans MongoDB de façon aussi générique que le find.
       Todo : voir du côté des schémas mongoose qui permette 'insérer directement un bodyContents ??
     */
};