/**
 * New node file
 */
exports.index = {

    titre: function (req, cb) {
        var _controler = req.session.controler;
        return cb(null, { title: 'OTF with Express' });
    }

};