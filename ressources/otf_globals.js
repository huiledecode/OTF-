/**
 * Created by epa on 03/03/15.
 */

var util = require("util");
var loader = require('../routes/otf/otf_modules/schema_loader');
var conf_file = "/home/epa/WebstormProjects/OTF_NEW/otf/bin/config.json";
var conf = __dirname + '/../bin/config.json';
var schema = __dirname + '/../routes/directory_schema.json';
var profiles = __dirname + '/../routes/otf/profiles';
//
var chokidar = require("chokidar");
var watcher;
//
var log4js = require('log4js');
var log;
var logMongo;
//
var conf_loader = {config: conf, schema: schema, profile: profiles};
//
//
console.log(">>> OTF² Try to load file configuration ... \n[%s]\n", util.inspect(conf_loader));
try {
    // load configuration file
    loader.loadConfig(conf_loader);
    console.log(">>> OTF² Mode [%s]", GLOBAL.config["ENV"].mode);
    //log4j
    log4js.configure(GLOBAL.config["LOGS"].path, { reloadSecs: GLOBAL.config["LOGS"].reload });
    mongoAppender = require('log4js-node-mongodb');
    // mongodb appender
    log4js.addAppender(
        mongoAppender.appender({connectionString: GLOBAL.config["LOGS"].mongodb}),
        'cheese'
    );
    // Start MongoDB
    reload_db();
    // Logger Initalisation File & DB
    log = log4js.getLogger('otf_globals');
    log.debug('>>> OTF² LOG4J INIT');
    logMongo = log4js.getLogger('otf_globals');
    log.debug('>>> OTF² LOG4J MONGO  INIT');
    //
    // Load DB MODELS
    loader.loadModels(conf_loader);
    //
    //Load Profiles
    loader.loadProfiles(conf_loader);
    //
    // Listener File Initialisation
    watcher = chokidar.watch(conf, {usePolling: true});
    watcher.add(schema, {usePolling: true});
    watcher.add(profiles);
} catch (e) {
    console.log(" OTF INIT PROBLEM message : " + e.messages);
    throw(e);
    process.exit(0);
}
//
//
//
//
watcher.on('change', function (path, stats) {
    if (stats) log.debug('File', path, 'changed size to', stats.size);
    if (path === conf) {
        try {
            loader.loadConfig(conf_loader);
            reload_db();
        } catch (e) {
            log.error(" OTF INIT PROBLEM message : " + e.messages);
            throw(e);
            process.exit(0);
        }
        log.debug("configuration reloaded !!");
    }
    else if (path === schema) {
        try {
            //reload_db();
            loader.loadModels(conf_loader);
        } catch (e) {
            log.error(" OTF INIT PROBLEM message : " + e.messages);
            throw(e);
            process.exit(0);
        }
        log.debug("schema reloaded !!");
    }
    else {  // (path === profiles) { //jamais d'égalité
        try {
            loader.loadProfiles(conf_loader);
        } catch (e) {
            log.error(" OTF INIT PROBLEM message : " + e.messages);
            throw(e);
            process.exit(0);
        }
        log.debug("profiles reloaded !!");
    }

});

/**
 * Reload Mongo avec Close si DB est instanciée
 */
function reload_db() {
    //
    //var dbUrl = GLOBAL.config["MONGO"].url || process.env.MONGODB_URL || 'mongodb://@127.0.0.1:27017/otf_demo';
    //var options = GLOBAL.config["MONGO"].options || {server: { poolSize: 5 }};
    require("./otf_db").initDb(GLOBAL.config["MONGO"].url || process.env.MONGODB_URL || 'mongodb://@127.0.0.1:27017/otf_demo', GLOBAL.config["MONGO"].options || {server: { poolSize: 5 }});
};
//watcher.on('all', function(event, path) {
//  console.log(event, path);
//}).on('ready',function(){ console.log("ready")});