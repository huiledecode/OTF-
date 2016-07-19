/**
 * Created by sma on 17/07/16.
 */

var fs        = require("fs");
var path      = require("path");
var Sequelize = require('sequelize');
var logger = require('log4js').getLogger('otf_mongooseGeneric');
var db = {};

    sequelize = new Sequelize('otf_demo', 'root', 'Vna2Pms4!',
        { host: 'localhost', dialect: 'mysql', pool: { max: 5, min: 0, idle: 10000 }}
    );
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

   /** TODO Add Models to have the generic access to datas whatever the SQL database used **/


module.exports.db = db;

