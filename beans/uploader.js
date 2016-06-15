/*
 * POST uploader
 * Il s'agit ici d'un Bean générique qui en fonction des données dans
 * l'annuaire otf json est capable de faire un upload d'une image pour
 * la stockée dans un dossier spécifique.
 */
var logger = require('log4js').getLogger('uploader');
logger.setLevel(GLOBAL.config["LOGS"].level);
var fs = require('fs');
var gm = require('gm');
/*
 * SET users datas into MongoDB.
 */

exports.uploader = {
    oneFile: function (req, cb) {
        var _controler = req.session.controler;
        var values = _controler.params;
        // ici params est un objet simple à insérer
        if (typeof file != 'undefined') {
            var file = values.file;
            if (!fs.existsSync('./public/uploads/images')) {
                fs.mkdirSync('./public/uploads/images', [0777]);
            }
            if (file.size > 0) { // des données ont été uploadées
                logger.debug('params updater with file : ', values);
                logger.debug('----> file data : ' + file.name + '-' + file.path + '-' + file.size);
                var file_name_uve = file.name;
                var target_path = './public/uploads/images/' + file_name_uve;
                var tmp_path = './' + file.path;
                var readStream = fs.createReadStream(tmp_path);
                //-- On retaille l'image par défaut
                gm(readStream).resize(109).stream(function (err, stdout, stderr) {
                    stdout.pipe(fs.createWriteStream(target_path));
                    stdout.on('end', function () {
                        fs.unlink(tmp_path, function (err) { // suppression du fichier temporaire (ex. : ZWnIYKUmNPjagjXlZGr0V9sx.jpg )
                            if (err) throw err;
                            logger.debug('--->fichier copié dans : ' + target_path);
                            return cb(null, {data: {file: file}, room: _controler.room});
                        });
                    });
                }); //-- Fin redimensionnement image
            }
        } else {
            return cb(null, {data: {file: file}, room: _controler.room});
        }
    },

    oneFileAndUpdateFields: function (req, cb) {
        var _controler = req.session.controler;
        var values = _controler.params;
        // ici params est un objet simple à insérer
        var theId = values._id;
        var file = values.file;
        delete values._id;
        delete values.file;
        logger.debug('params updater with file : ', values);
        logger.debug('----> file data : ' + file.name + '-' + file.path + '-' + file.size);
        if (!fs.existsSync('./public/uploads/images')) {
            fs.mkdirSync('./public/uploads/images', [0777]);
        }
        if (file.size > 0) { // des données ont été uploadées
            var file_name_uve = file.name;
            var target_path = './public/uploads/images/' + file_name_uve;
            var tmp_path = './' + file.path;
            var readStream = fs.createReadStream(tmp_path);
            //-- On retaille l'image par défaut
            gm(readStream).resize(109).stream(function (err, stdout, stderr) {
                stdout.pipe(fs.createWriteStream(target_path));
                stdout.on('end', function () {
                    fs.unlink(tmp_path, function (err) { // suppression du fichier temporaire (ex. : ZWnIYKUmNPjagjXlZGr0V9sx.jpg )
                        if (err) throw err;
                        logger.debug('--->fichier copié dans : ' + target_path);
                        /** le fichier est copié et le temporaire est supprimé, ci-dessous on MAJ les champs de la base de données */
                        try {
                            var model = GLOBAL.schemas[_controler.data_model];
                            //document = new genericModel.mongooseGeneric(_controler.path, _controler.schema, _controler.data_model);
                            model.updateDocument({_id: theId}, values, function (err, numberAffected) {
                                if (err) {
                                    logger.info('----> error : ' + err);
                                } else {
                                    logger.debug('nb enreg modifiés : ', numberAffected);
                                    return cb(null, {data: numberAffected, room: _controler.room});
                                }
                            });
                        } catch (errc) { // si existe pas alors exception et on l'intègre via mongooseGeneric
                            logger.debug('----> error catch : ' + errc);
                            modele = global.db.model(_controler.path);
                            // requete ici si model existe dejà dans mongoose
                            return cb(errc);
                        }
                    });
                });
            }); //-- Fin redimensionnement image
        }
    }
};