/**
 * Created by epa on 10/12/14.
 */

var util = require("util");
var logger = require('log4js').getLogger('otf_session');

module.exports = function (app, secret, cookie_name) {
    var cookieParser = require('cookie-parser');
    var session = require("express-session");
    var sessionStore;
    // TimeOut de session en secondes et prefix de la keyy pour REDIS
    var options = {"ttl": GLOBAL.config["SESSION"].ttl, "prefix": GLOBAL.config["SESSION"].prefix};
    // Store Memory or Redis
    if (process.env.NODE_SESSION == "REDIS") {
        var RedisStore = require(__dirname+'/connect-redis')(session);
        sessionStore = new RedisStore(options);
        logger.debug("OTF² NODE_SESSION = REDIS");
    } else {
        var MemoryStore = session.MemoryStore;
        sessionStore = new MemoryStore();
        logger.debug("OTF² NODE_SESSION = MEMORY");
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