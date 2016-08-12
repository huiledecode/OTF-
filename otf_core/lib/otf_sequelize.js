/**
 * Created by sma on 17/07/16.
 */

var fs        = require("fs");
var path      = require("path");
var Sequelize = require('sequelize');
var logger = require('log4js').getLogger('otf_mongooseGeneric');
var db = {};

   var globals = GLOBAL.config["SEQUELIZE"];
   sequelize = new Sequelize(globals.db_name, globals.db_login, globals.db_password,
        { host: globals.db_host, dialect: globals.db_dialect, pool: globals.pool[0]}
    );
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

   /** TODO Add Models to have the generic access to datas whatever the SQL database used **/
   /* you can see file dump/sqldb/models/index.js which charging models dynamically */

module.exports.db = db;

