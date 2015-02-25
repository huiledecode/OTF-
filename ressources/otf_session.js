/**
 * Created by epa on 10/12/14.
 */


module.exports = function (app, secret, cookie_name) {
    var cookieParser = require('cookie-parser');
    var session = require("express-session");
    var sessionStore;
    // Store Memory or Redis
    if (process.env.NODE_SESSION == "REDIS") {
        var RedisStore = require('./connect-redis')(session);
        sessionStore = new RedisStore();
        console.log("NODE_SESSION = REDIS");
    } else {
        var MemoryStore = session.MemoryStore;
        sessionStore = new MemoryStore();
        console.log("NODE_SESSION = MEMORY");
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