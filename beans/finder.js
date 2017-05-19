/*
 * GET / POST finding
 * Il s'agit ici d'un Bean générique qui en fonction des données dans
 * l'annuaire otf json est capable de faire un find et de retourner
 * un objet json contenant le resultat de la requête.
 */
var logger = require('log4js').getLogger('finder');
logger.setLevel(GLOBAL.config["LOGS"].level);
var mongoose = require('mongoose');
var genericModel = require('../otf_core/lib/otf_mongooseGeneric');

/*
 * GET users listing.
 */

exports.finder = {
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
        logger.debug(" Finder.list call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        try {
            var model = GLOBAL.schemas[_controler.data_model];
            model.getDocuments({}, function (err, list_users) {
                logger.debug('data list  :', JSON.stringify(list_users));
                // On ajoute une propriété 'js' à notre litse_users qui contiendra les données sous forme de chaîne pour l'exploitation dans du JavaScript
                list_users.str = JSON.stringify(list_users);
                var t2 = new Date().getMilliseconds();
                logger.info('into Finder.list before return cb TIME (ms) : ' + (t2 - t1) + 'ms');
                return cb(null, {result: list_users, "state": state || "TEST", room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    },

    listWithParams: function (req, cb) {
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
        logger.debug(" Finder.list call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        try {
            var model = GLOBAL.schemas[_controler.data_model];
            model.getDocuments(_controler.params, function (err, list_users) {
                logger.debug('data list  :', JSON.stringify(list_users));
                // On ajoute une propriété 'js' à notre litse_users qui contiendra les données sous forme de chaîne pour l'exploitation dans du JavaScript
                list_users.str = JSON.stringify(list_users);
                var t2 = new Date().getMilliseconds();
                logger.info('into Finder.list before return cb TIME (ms) : ' + (t2 - t1) + 'ms');
                return cb(null, {result: list_users, "state": state || "TEST", room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
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
        logger.debug(" One User emmit call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        try {
            var model = GLOBAL.schemas[_controler.data_model];
            model.getDocument(_controler.params, function (err, one_user) {
                logger.debug('Utilisateurs :', one_user);
                one_user.str =  JSON.stringify(one_user);
                return cb(null, {result: one_user, "state": state, room: _controler.room});
            });

        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    },

    oneAndListMultiSchemas: function (req, cb) {
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
            state = req.session.login_info.state
        //@TODO not safety
        logger.debug('Finders.one params  : ', _controler.params);
        //logger.debug('Finders.one params  : ', _controler.params['login'].source);
        logger.debug('Finders.one room    : ', _controler.room);
        logger.debug('Finders.one model   : ' + _controler.data_model);
        logger.debug('Finders.one schema  : ' + _controler.schema);
        // Test emit WebSocket Event
        logger.debug(" One User emmit call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        var result = {};
        try {
            var model = GLOBAL.schemas[_controler.data_model];
            model.getDocument(_controler.params, function (err, one_user) {
                logger.debug('Utilisateurs :', one_user);
                result.one= one_user;
                result.one.role = result.one.role.toString();
                result.one.str = JSON.stringify(one_user);
                try {
                    var listSchemas = _controler.data_ref;
                        
                    function getDocsMultiSchemas(i, cbk) {
                        if (i < listSchemas.length) {
                            var model = GLOBAL.schemas[listSchemas[i]];
                            model.getDocuments({}, function (err, list_datas) {
                                if (err) {
                                    console.log('error: ' + err)
                                }
                                else {
                                    logger.debug('listes des données des schemas passés en data_model  :', JSON.stringify(list_datas));
                                    result[listSchemas[i]] = list_datas;
                                    (result[listSchemas[i]]).str = JSON.stringify(list_datas);
                                    logger.debug('affiche result pour i=' + i + '   : ', result);
                                    // L'asynchronicité peut être géré d'une autre façon soit promise soit async, ici récursivité
                                    getDocsMultiSchemas(i + 1, cbk);
                                }
                            });
                        } else {
                            cbk();
                        }
                    }
                    
                    getDocsMultiSchemas(0, function () {
                        var t2 = new Date().getMilliseconds();
                        logger.info('into Finder.listMultiSchema before return cb TIME (ms) : ' + (t2 - t1) + 'ms');
                        return cb(null, {result: result, "state": state || "TEST", room: _controler.room});
                    });
                } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
                    logger.error(err);
                }
            });

        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    },

    manyAndListMultiSchemas : function (req, cb) {
        // data_model must be an array
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
            state = req.session.login_info.state
        //@TODO not safety
        logger.debug('Finders.one params  : ', _controler.params);
        //logger.debug('Finders.one params  : ', _controler.params['login'].source);
        logger.debug('Finders.one room    : ', _controler.room);
        logger.debug('Finders.one model   : ' + _controler.data_model);
        logger.debug('Finders.one schema  : ' + _controler.schema);
        // Test emit WebSocket Event
        logger.debug(" One User emmit call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        var result = {};
        var listModels = _controler.data_model;
        try {
            function getDocsFromId(j, cbk) {
                if (j < _controler.data_model.length) {
                    var model = GLOBAL.schemas[listModels[j]];
                    model.getDocument({ "_id": _controler.params._id[j]}, function (err, data) {
                        logger.debug('datas :', data);
                        result[listModels[j]+'_one'] = data;
                        result[listModels[j]+'_one'].str = JSON.stringify(data);
                        getDocsFromId(j + 1, cbk);
                    });
                }
                else {
                    cbk();
                }
            }
            getDocsFromId(0, function () {
                var t2 = new Date().getMilliseconds();
                logger.info('into Finder.manyListMultiSchema before return cb TIME (ms) : ' + (t2 - t1) + 'ms');
                try {
                    var listSchemas = _controler.data_ref;

                    function getDocsMultiSchemas(i, cbk) {
                        if (i < listSchemas.length) {
                            var model = GLOBAL.schemas[listSchemas[i]];
                            model.getDocuments({}, function (err, list_datas) {
                                if (err) {
                                    console.log('error: ' + err)
                                }
                                else {
                                    logger.debug('listes des données des schemas passés en data_model  :', JSON.stringify(list_datas));
                                    result[listSchemas[i]] = list_datas;
                                    (result[listSchemas[i]]).str = JSON.stringify(list_datas);
                                    logger.debug('affiche result pour i=' + i + '   : ', result);
                                    // L'asynchronicité peut être géré d'une autre façon soit promise soit async, ici récursivité
                                    getDocsMultiSchemas(i + 1, cbk);
                                }
                            });
                        } else {
                            cbk();
                        }
                    }
                    getDocsMultiSchemas(0, function () {
                        var t2 = new Date().getMilliseconds();
                        logger.info('into Finder.listMultiSchema before return cb TIME (ms) : ' + (t2 - t1) + 'ms');
                        return cb(null, {result: result, "state": state || "TEST", room: _controler.room});

                    });
                } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
                    logger.error(err);
                }
                //return cb(null, {result: result, "state": state || "TEST", room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    },

    populate: function (req, cb) {
        // Input security Controle
        if (typeof req.session === 'undefined' || typeof req.session.controler === 'undefined') {
            error = new Error('req.session undefined');
            return cb(error);
        }
        var _controler = req.session.controler;
        var state;
        if (typeof req.session == 'undefined' || typeof req.session.login_info === 'undefined' || typeof req.session.login_info.state === 'undefined')
            state = "TEST";
        else
            state = req.session.login_info.state
        //
        //
        logger.debug(" Finder.populate call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        try {
            var model = GLOBAL.schemas[_controler.data_model];
            var _params = { query: _controler.params, ref: _controler.data_ref};
            model.popDocuments(_params, function (err, list) {
                logger.debug('Populate Result  :', list);
                logger.debug('req.session : ' , req.session );
                list.str = JSON.stringify(list);
                return cb(null, {result: list}); //, user:req.session.login_info.user, "state": state, room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    },

    populateAndListMultiSchemas: function (req, cb) {
        // Input security Controle
        var t1 = new Date().getMilliseconds();
        if (typeof req.session === 'undefined' || typeof req.session.controler === 'undefined') {
            error = new Error('req.session undefined');
            return cb(error);
        }
        var _controler = req.session.controler;
        var state;
        if (typeof req.session == 'undefined' || typeof req.session.login_info === 'undefined' || typeof req.session.login_info.state === 'undefined')
            state = "TEST";
        else
            state = req.session.login_info.state
        //
        //
        logger.debug(" Finder.populate call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        try {
            var isMultiModels = false;
            var popModelName = "";
            var model = {};
            if (Array.isArray(_controler.data_model)) {
                isMultiModels = true;
                popModelName = _controler.data_model[0];
                model = GLOBAL.schemas[popModelName];
            } else {
                popModelName = _controler.data_model;
                model = GLOBAL.schemas[popModelName];
            }
            var _params = { query: _controler.params, ref: _controler.data_ref};
            model.popDocuments(_params, function (err, list) {
                //logger.debug('Populate Result  :', list);
                logger.debug('req.session : ' , req.session );
                list.str = JSON.stringify(list);
                try {
                    var listSchemas = _controler.data_resources;
                    var result = {};
                    result[popModelName] = list;
                    function getDocsMultiSchemas(i, cbk) {
                        if (i < listSchemas.length) {
                            var model = GLOBAL.schemas[listSchemas[i]];
                            model.getDocuments({}, function (err, list_datas) {
                                if (err) {
                                    console.log('error: ' + err)
                                }
                                else {
                                    //logger.debug('listes des données des schemas passés en data_model  :', JSON.stringify(list_datas));
                                    result[listSchemas[i]] = list_datas;
                                    (result[listSchemas[i]]).str = JSON.stringify(list_datas);
                                    //logger.debug('affiche result pour i=' + i + '   : ', result);
                                    // L'asynchronicité peut être géré d'une autre façon soit promise soit async, ici récursivité
                                    getDocsMultiSchemas(i + 1, cbk);
                                }
                            });
                        } else {
                            cbk();
                        }
                    }
                    getDocsMultiSchemas(0, function () {
                        function getOneDataModelSchemasWithParams(i, cbk) {
                            if (i < _controler.data_model.length) {
                                var model = GLOBAL.schemas[_controler.data_model[i]];
                                var _paramsNames = Object.getOwnPropertyNames(_controler.params);
                                //var newId = new ObjectId(_controler.params[_paramsNames[i-1]]);

                                model.getDocument({_id: _controler.params[_paramsNames[i]]}, function (err, list_datas) {
                                    if (err) {
                                        console.log('error: ' + err)
                                    }
                                    else {
                                        //logger.debug('listes des données des schemas passés en data_model  :', JSON.stringify(list_datas));
                                        result[_controler.data_model[i]+"_one"] = list_datas;
                                        (result[_controler.data_model[i]+"_one"]).str = JSON.stringify(list_datas);
                                        //logger.debug('affiche result pour i=' + i + '   : ', result);
                                        // L'asynchronicité peut être géré d'une autre façon soit promise soit async, ici récursivité
                                        getOneDataModelSchemasWithParams(i + 1, cbk);
                                    }
                                });
                            } else {
                                cbk(); // on remonte la pile d'appel récursif
                            }
                        }
                        if (isMultiModels) getOneDataModelSchemasWithParams(1, function() {
                            var t2 = new Date().getMilliseconds();
                            logger.info('into Finder.populateAndListMultiSchemas before return cb TIME (ms) : ' + (t2 - t1) + 'ms');
                            return cb(null, {result: result, "state": state || "TEST", room: _controler.room});
                        });
                        else {
                            var t2 = new Date().getMilliseconds();
                            logger.info('into Finder.populateAndListMultiSchemas before return cb TIME (ms) : ' + (t2 - t1) + 'ms');
                            return cb(null, {result: result, "state": state || "TEST", room: _controler.room});
                        }
                    });
                } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
                    logger.error(err);
                }
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    },

    listMultiSchemas: function (req, cb) {
        var t1 = new Date().getMilliseconds();
        // Input security Controle
        if (typeof req.session === 'undefined' || typeof req.session.controler === 'undefined') {
            error = new Error('req.session undefined');
            return cb(error);
        }
        var _controler = req.session.controler;
        var state;
        logger.debug('REQUEST REQUEST REQUEST');
        
        if (typeof req.session == 'undefined' || typeof req.session.login_info === 'undefined' || typeof req.session.login_info.state === 'undefined')
            state = "TEST";
        else
            state = req.session.login_info.state
        //
        //
        logger.debug("finder.listMultiSchemas");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        var result = {};
        try {
            var listSchemas = _controler.data_model;

            function getDocsMultiSchemas(i, cbk) {
                if (i < listSchemas.length) {
                    var model = GLOBAL.schemas[listSchemas[i]];
                    model.getDocuments({}, function (err, list_datas) {
                        if (err) {
                            console.log('error: ' + err)
                        }
                        else {
                            logger.debug('listes des données des schemas passés en data_model  :', JSON.stringify(list_datas));
                            result[listSchemas[i]] = list_datas;
                            (result[listSchemas[i]]).str = JSON.stringify(list_datas);
                            logger.debug('affiche result pour i=' + i + '   : ', result);
                            // L'asynchronicité peut être géré d'une autre façon soit promise soit async, ici récursivité
                            getDocsMultiSchemas(i + 1, cbk);
                        }
                    });
                } else {
                    cbk();
                }
            }

            getDocsMultiSchemas(0, function () {
                var t2 = new Date().getMilliseconds();
                logger.info('into Finder.listMultiSchema before return cb TIME (ms) : ' + (t2 - t1) + 'ms');
                return cb(null, {result: result, "state": state || "TEST", room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }

    },

    listMultiSchemasAsync : function(req, cb) {
        var async = require('async');
        var t1 = new Date().getMilliseconds();
        // Input security Controle
        if (typeof req.session === 'undefined' || typeof req.session.controler === 'undefined') {
            error = new Error('req.session undefined');
            return cb(error);
        }
        var _controler = req.session.controler;
        var state;
        if (typeof req.session == 'undefined' || typeof req.session.login_info === 'undefined' || typeof req.session.login_info.state === 'undefined')
            state = "TEST";
        else
            state = req.session.login_info.state
        //
        //
        logger.debug("finder.listMultiSchemasAsync");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        var result={};
        try {
            var listSchemas = _controler.data_model;
            async.each(listSchemas,
                function (schema, callback) {
                    var model = GLOBAL.schemas[schema];
                    model.getDocuments({}, function (err, list_datas) {
                        if (err) {
                            console.log('error: ' + err)
                        }
                        else {
                            logger.debug('listes des données des schemas passés en data_model  :', JSON.stringify(list_datas));
                            result[schema] = list_datas;
                            result[schema].js = JSON.stringify(list_datas);
                            logger.debug('affiche result pour schema =' + schema + '   : ', result);
                            callback();
                        }
                    });

                },
                function (err) {
                    var t2 = new Date().getMilliseconds();
                    logger.info('into Finder.listMultiSchemasAsync before return cb TIME (ms) : ' + (t2 - t1) + 'ms');
                    return cb(null, {result: result, "state": state || "TEST", room: _controler.room});
                }
            ); // fin async.each
        } catch (err) {
            logger.error(err);
            return (err, null);
        }
    }
};