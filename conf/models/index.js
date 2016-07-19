/**
 * Created by sma on 18/07/16.
 */
var fs        = require("fs");
var path      = require("path");
var Sequelize = require('sequelize');
var env       = process.env.NODE_ENV || "test";
var config    = require(path.join(__dirname, '../../dump', 'sqldb', 'config_sql.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db        = {};

  fs.readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
        //console.log('file read : ' + file);
    });
    // create associations
    Object.keys(db).forEach(function(modelName) {
        if ("associate" in db[modelName]) {
            db[modelName].associate(db);
        }
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
