/**
 * New node file
 */
exports.index = {

    titre: function (params, path, model, schema, room, cb) {
        return cb(null, { title: 'OTF with Express' });
    }

};