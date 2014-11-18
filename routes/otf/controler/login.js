exports.login = {

    titre: function (req, cb) {
        var _controler = req.session.controler;
        return cb(null, { title: 'OTF with Express Passport Authentification' });
    }

};
/**
 * New node file
 */
