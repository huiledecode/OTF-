/**
 * Created by epa on 06/03/15.
 */
var cluster = require("cluster");
var log4js = require('log4js');
var logger = log4js.getLogger('www');
var loggerMongo = log4js.getLogger('mongo');

if (cluster.isMaster) {
    var numCPUs;
    if (GLOBAL.config["CLUSTER"].nb_cpu == 'undefined')
        numCPUs = require('os').cpus().length;
    else
        numCPUs = GLOBAL.config["CLUSTER"].nb_cpu;
    //
    //logger.info("OTF² NB_CPU [%s]", numCPUs);
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    //
    cluster.on('exit', function (worker, code, signal) {
        logger.warn('worker ' + worker.process.pid + ' died');
    });
} else {
    run();
}

/**
 * START HTTP LISTENER
 */
function run() {
    var app = require('../../app');
    app.set('port', GLOBAL.config["LOGS"].port || process.env.NODE_PORT || 3000);
    app.set('host', GLOBAL.config["LOGS"].host || process.env.NODE_HOST || "0.0.0.0");
//
    var server = app.listen(app.get('port'), app.get('host'), function () {
        logger.info("OTF² server listening on http://%s:%d", app.get('host'), app.get('port'));
        //loggerMongo.debug("OTF² server listening on http://%s:%d", app.get('host'), app.get('port'));
    });
// SERVER SOCKET
    sio.listen(server, {log: GLOBAL.config["WEBSOCK"].log});
    logger.info("OTF² WebSocket Started");
//-- Middleware function
}
