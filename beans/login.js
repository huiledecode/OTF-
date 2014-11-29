exports.login = {

    titre: function (req, cb) {
        var _controler = req.session.controler;
        //return cb(null, { title: 'OTF with Express Passport Authentification' });
        return cb(null, { title: 'OTF with ExpressPassport Authentification', "state": "not login", "flag": "none", "user": "none", "message": "identify yourself" });

    }

};
/**
 * New node file
 */
