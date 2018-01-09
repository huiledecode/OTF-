/**
 * Created by epa on 10/12/14.
 */

var util = require("util");
var logger = require('log4js').getLogger('otf_session');
logger.setLevel(GLOBAL.config["LOGS"].level);

module.exports = function(app, secret, cookie_name) {
    var cookieParser = require('cookie-parser');
    var session = require("express-session");
    var sessionStore;
    // TimeOut de session en secondes et prefix de la keyy pour REDIS
    var options = {
        "ttl": GLOBAL.config["SESSION"].ttl,
        "prefix": GLOBAL.config["SESSION"].prefix
    };
    var node_session = process.env.NODE_SESSION || GLOBAL.config["SESSION"].store || "MEMORY";
    // Store Memory or Redis
    if (node_session === "REDIS") {
        var RedisStore = require(__dirname + '/connect-redis')(session);
        sessionStore = new RedisStore(options);
        // logger.info("OTF² NODE_SESSION = REDIS");
    } else {
        var MemoryStore = session.MemoryStore;
        sessionStore = new MemoryStore();
        // logger.info("OTF² NODE_SESSION = MEMORY");
    }
    // -- Cookies Parser
    app.use(cookieParser(secret));
    //--
    app.use(session({
        'name': cookie_name,
        'secret': secret,
        'store': sessionStore,
        'proxy': false,
        'resave': false,
        'saveUninitialized': false
    }));

    return sessionStore;
};
