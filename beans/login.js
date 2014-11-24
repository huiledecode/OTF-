exports.login = {

    titre: function (req, cb) {
        var _controler = req.session.controler;
        //return cb(null, { title: 'OTF with Express Passport Authentification' });
        return cb(null, { title: 'OTF with ExpressPassport Authentification', "state": req.session.login_info.state, "flag": req.session.login_info.flag, "user": req.session.login_info.user, "message": req.session.login_info.message });

    }

};
/**
 * New node file
 */
