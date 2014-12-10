/**
 * Created by epa on 10/12/14.
 */
module.exports = function (app, secret, cookie_name) {
    var cookieParser = require('cookie-parser');
    var session = require("express-session");
    // Cookies Managment
    var MemoryStore = session.MemoryStore;
    var sessionStore = new MemoryStore();
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