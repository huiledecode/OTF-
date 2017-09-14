/**
 * Created by sma and epa on 20/11/14.
 */
var util = require("util");
var logger = require('log4js').getLogger('schema_loader');

var fs = require('fs');
var mongoose = require('mongoose');
var genericModel = require(__dirname + '/otf_mongooseGeneric');

module.exports = {
    /**
     *
     */
    loadModels: function (directory) {
        //temporaire
        var directory_schema = {};
        GLOBAL.schemas = [];
        // Load File
        try {
            logger.debug("OTF² Load Schema Name [%s]", util.inspect(directory.schema));
            directory_schema = JSON.parse(fs.readFileSync(directory.schema, 'utf8'));
            //logger.debug("OTF² Load Schema [%s]", util.inspect(directory_schema));
        } catch (err) {
            logger.error("OTF² Load Schema File ERROR mess [%s] ", util.inspect(err.message));
        }
        // Tableaux
        try {
            for (modelName in directory_schema) {
                var _schema = directory_schema[modelName].schema
                logger.debug("OTF² schema_loader --> Model Name      [", modelName, "]");
                logger.debug("OTF² schema_loader --> Collection Name [", directory_schema[modelName].collection, "]");
                logger.debug("OTF² schema_loader --> Schema          [%s]", util.inspect(directory_schema[modelName].schema));
                GLOBAL.schemas[modelName] = new genericModel.mongooseGeneric(modelName, directory_schema[modelName].schema, directory_schema[modelName].collection);
                logger.debug("OTF² schema_loader Model Name          [", modelName + " Loaded OK]");
                logger.debug("---------------------------------------");
            }

        } catch (err) {
            logger.error(" Load Schema ERROR mess :%s ", err.message);
        }
    },

    loadConfig: function (directory) {
        //temporaire
        var directory_config = {};
        GLOBAL.config = [];
        // Load File
        try {
            console.log(">>> OTF² Load Configuration [%s]", util.inspect(directory.config));
            directory_config = JSON.parse(fs.readFileSync(directory.config, 'utf8'));
            //logger.debug("Load Configuration      [%s]", util.inspect(directory_config));
            GLOBAL.config = directory_config;
            logger.setLevel(GLOBAL.config["LOGS"].level);
        } catch (err) {
            console.log("OTF² Load Configuration File ERROR mess [%s] ", err.message);
            throw err;
        }
        // Tableaux

    },

    loadProfiles: function (directory) {
        logger.debug("OTF² Load Profile Directory [%s]", util.inspect(directory.profile));
        GLOBAL.profiles = [];
        //-- on récupère la liste des fichier json
        var files;
        var file;
        // on récupére la liste des fichiers
        try {
            files = fs.readdirSync(directory.profile, 'utf8');
            logger.debug("OTF² load Profiles files [%s] ", util.inspect(files));

        } catch (err) {
            logger.error("OTF² loadProfile read list file failed [%j]", directory, " message [%s]", err.message);
            return ({ error: err, message: "loadProfile read list file failed" + directory.profile});
        }

        //--
        if (!files)
            return  { error: null, message: "loadProfile no file found in directori" + directory.profile};
        // for eac file
        for (file in files) {
            var name = files[file];
            var profilePattern = /otf/;
            try {
                if (name.match(profilePattern)) {
                    var pre_idx = name.indexOf("_") + 1;
                    // var post_idx = name.indexOf(".json");
                    var profileName = name.substr(pre_idx, (name.length - ".json".length - pre_idx));
                    logger.debug("OTF² load Profiles file Name     [%s] ", name);
                    logger.debug("OTF² load Profiles profile Name [%s] ", profileName);
                    var _json = JSON.parse(fs.readFileSync(directory.profile + "/" + name, 'utf8'));
                    logger.debug("OTF² load Profiles json profile    [%j] ", util.inspect(_json));
                    GLOBAL.profiles[profileName] = (_json);
                } else {
                    logger.warn("OTF² loadProfiles not found for file [%s] ", name);
                }

            } catch (err) {
                logger.error("OTF² loadProfile load file failed [%j]", directory, " message [%s]", err.message);
                return ({ error: err, message: "loadProfile load file failed for " + name});
            }


        }


    }


};
