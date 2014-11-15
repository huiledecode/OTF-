/*
 * POST uploader
 * Il s'agit ici d'un Bean générique qui en fonction des données dans
 * l'annuaire otf json est capable de faire un upload d'une image pour
 * la stockée dans un dossier spécifique.
 */
var logger = require('log4js').getLogger('css');
var fs = require('fs');
var gm = require('gm');
/*
 * SET users datas into MongoDB.
 */

exports.uploader = {
  oneFile : function (values, path, model, schema, room, cb) {
    // ici params est un objet simple à insérer
    var theId = values._id;
    var file = values.file;
    delete values._id;
    delete values.file;
    logger.debug('params updater with file : ', values);
    logger.debug('----> file data : ' + file.name + '-' + file.path + '-' + file.size);
    /** TODO ici je recopie le code d'alliage pour la copie du fichier image */
    if(!fs.existsSync('./public/uploads/images')) {
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
          fs.unlink(tmp_path, function (err) {
            if (err) throw err;
            //res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
            logger.debug('fichier copié dans : ' + target_path);
            return cb(null, {data: target_path, room: room});
          });
        });
      }); //-- Fin redimensionnement image
    }
  }
};