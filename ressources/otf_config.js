/**
 * Created by epa on 02/03/15.
 */
var util = require("util");
var conf = { config: __dirname + "/../bin/config.json" };
// Try IO
try {
    var schema_loader = require('../routes/otf/otf_modules/schema_loader');
    schema_loader.loadConfig(conf);
    for (var theme in GLOBAL.config) {
        console.log("THEME : [%s] : %s", theme, util.inspect(GLOBAL.config[theme]));
    }
} catch (e) {
    console.log(" OTF INIT PROBLEM message : " + e.message);
    process.exit(0);
}

