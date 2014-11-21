/**
 * Created by sma and epa on 20/11/14.
 */
var logger = require('log4js').getLogger('css');
var fs = require('fs');
var mongoose = require('mongoose');
var genericModel = require('../../../ressources/models/mongooseGeneric');

exports.loader = {
    /**
     *
     */
    load: function (directory) {
        //temporaire
        var directory_schema = {};
        GLOBAL.schemas = [];
        // Load File
        try {
            directory_schema = JSON.parse(fs.readFileSync(directory.schema, 'utf8'));
            logger.debug("Load Directory Schema %s", directory_schema);
        } catch (err) {
            logger.debug(" Load Schema File ERROR mess :%s ", err.message);
        }
        // Tableaux
        try {
            for (modelName in directory_schema) {
                GLOBAL.schemas[modelName] = new genericModel.mongooseGeneric(modelName, directory_schema[modelName].schema, directory_schema[modelName].collection);
            }

        } catch (err) {
            logger.debug(" Load Schema ERROR mess :%s ", err.message);
        }
    },

    list: function () {

    }


};