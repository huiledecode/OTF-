/*
 * GET / POST finding
 * Il s'agit ici d'un Bean générique qui en fonction des données dans
 * l'annuaire otf json est capable de faire un find et de retourner
 * un objet json contenant le resultat de la requête sur une base de données sqlite3.
 */
var logger = require('log4js').getLogger('finder');
logger.setLevel(GLOBAL.config["LOGS"].level);

var sqlite3 = require('sqlite3').verbose();
console.log('file_sqlite3 : ' + __dirname + '/../dump/sqldb/otf_demo.sqlite3');

/*
 * GET users listing.
 */

exports.finderSQL = {
    list: function (req, cb) {
        var t1 = new Date().getMilliseconds();
        // Input security Controle
        if (typeof req.session === 'undefined' || typeof req.session.controler === 'undefined') {
            error = new Error('req.session undefined');
            return cb(error);
        }
        //
        var _controler = req.session.controler;
        var state;
        if (typeof req.session == 'undefined' || typeof req.session.login_info === 'undefined' || typeof req.session.login_info.state === 'undefined')
            state = "TEST";
        else
            state = req.session.login_info.state;
        logger.debug(" FinderSQL.list call");
        //sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Datas\n\t Your Filter is : *'});
        try {
            var db = new sqlite3.Database(__dirname + '/../dump/sqldb/' + GLOBAL.config['SQLITE3'].db_file, sqlite3.OPEN_READWRITE, function(err) {
                var sql_query = _controler.sql_request;
                db.serialize(function() {
                    db.all(sql_query, function(err, rows) {
                        var t2 = new Date().getMilliseconds();
                        console.log('result list finderSQL in : '+ (t2 - t1) +': ', rows);
                        return cb(null, {result: rows, "state": state || "TEST", room: _controler.room});
                    });
                });
                db.close();
            });
            dbSeq.db.sequelize.query("SELECT * FROM `countries`", {type: dbSeq.db.sequelize.QueryTypes.SELECT})
                .then(function(countries) {
                    console.log('result list finder from sequelize : ', countries);
                });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    },

    listByModels: function(req, cb) {
        var _controler = req.session.controler;
        var state;
        if (typeof req.session == 'undefined' || typeof req.session.login_info === 'undefined' || typeof req.session.login_info.state === 'undefined')
            state = "TEST";
        else
            state = req.session.login_info.state;
        
        _controler.models.findAll().then(function(countries) {
            delete _controler.models;
            return cb(null, {result: countries, "state": state || "TEST", room: _controler.room});
        });
    },

    oneByModels: function(req, cb) {
        var _controler = req.session.controler;
        logger.debug('FinderSQL.oneByModels params  : ', _controler.params);
        var id = _controler.params.id;
        var state;
        if (typeof req.session == 'undefined' || typeof req.session.login_info === 'undefined' || typeof req.session.login_info.state === 'undefined')
            state = "TEST";
        else
            state = req.session.login_info.state;
        _controler.models.findById(id).then(function(record) {
            delete _controler.models;
            return cb(null, {result: record, "state": state || "TEST", room: _controler.room});
        });
    },

    one: function (req, cb) {
        // Input security Controle
        if (typeof req.session === 'undefined' || typeof req.session.controler === 'undefined') {
            error = new Error('req.session undefined');
            return cb(error);
        }
        //
        var _controler = req.session.controler;
        var state;
        if (typeof req.session == 'undefined' || typeof req.session.login_info === 'undefined' || typeof req.session.login_info.state === 'undefined')
            state = "TEST";
        else
            state = req.session.login_info.state
        //@TODO not safety
        logger.debug('Finders.one params  : ', _controler.params);
        //logger.debug('Finders.one params  : ', _controler.params['login'].source);
        logger.debug('Finders.one room    : ', _controler.room);
        logger.debug('Finders.one model   : ' + _controler.data_model);
        logger.debug('Finders.one schema  : ' + _controler.schema);
        // Test emit WebSocket Event
        //sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        logger.debug(" FinderSQL.one call");
        try {
            var db = new sqlite3.Database(__dirname + '/../dump/sqldb/' + GLOBAL.config['SQLITE3'].db_file, sqlite3.OPEN_READWRITE, function(err) {
                var sql_query = _controler.sql_request;
                db.get(sql_query, _controler.params, function(err, row) {
                    console.log("result one finderSQL : " , rows);
                    return cb(null, {result: rows, "state": state || "TEST", room: _controler.room});
                });
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    }
};