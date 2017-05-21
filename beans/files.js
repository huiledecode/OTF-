/**
 * Created by sma on 16/05/17.
 *
 * list, read and write file from serveur to browser
 * Bean générique qui permet de lister un dossier, lire
 * et écrire un fichier texte sur le serveur
 * et pour la lecture de renvoyer le contenu dans la vue.
 */
var logger = require('log4js').getLogger('files');
logger.setLevel(GLOBAL.config["LOGS"].level);
var mongoose = require('mongoose');
var genericModel = require('../otf_core/lib/otf_mongooseGeneric');
var fs = require('fs');

/*
 * files methods.
 */

exports.files = {
    //-- -----------------------------------------------------------------------------------
    //-- function to list a directory for get files names and send json list to view
    //-- -----------------------------------------------------------------------------------
    list: function(req, cb) {
        var _controler = req.session.controler;
        var path = _controler.data_model;
        var fileNames = [];
        fs.readdir(path, function(err, items) {
            if (err) {
                return console.log(err);
            }
            console.log(items);
            for (var i = 0; i < items.length; i++) {
                if (fs.statSync(path + '/' + items[i]).isFile()) {
                    fileNames.push({
                        name: items[i]
                    });
                }
            }
            return cb(null, {
                result: JSON.stringify(fileNames)
            });
        });
    },
    //-- -----------------------------------------------------------------------------------
    //-- function to read a text file from server, and send content to the view
    //-- -----------------------------------------------------------------------------------
    read: function(req, cb) {
        var _controler = req.session.controler;
        var fileName = _controler.params.name;
        var path = _controler.data_model;
        fs.readFile(path + "/" + fileName, 'utf8', function(err, data) {
            if (err) {
                return console.log(err);
            }
            console.log("The file : " + path + " : has been readed !");
            return cb(null, {
                fileName: fileName,
                fileContent: data
            });
        });
    },
    //-- -----------------------------------------------------------------------------------
    //-- function to write a text file form view's content to the server
    //-- -----------------------------------------------------------------------------------
    write: function(req, cb) {
        var _controler = req.session.controler;
        var path = _controler.data_model;
        var content = _controler.params["content"];
        var fileName = _controler.params["name"];
        fs.writeFile(path + '/' + fileName, content, function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file : " + path + "/" + fileName + " : was saved!");
            return cb(null, {
                file: fileName,
                message: "The file was saved !"
            });
        });
    }
}
