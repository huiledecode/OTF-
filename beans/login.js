exports.login = {

    titre: function (req, cb) {
        var _controler = req.session.controler;
        //return cb(null, { title: 'OTF with Express Passport Authentification' });
        var data = {};
        data.title = 'OTF with ExpressPassport Authentification';
        //
        if (req.session.login_info) {
            data.state = req.session.login_info.state;
            data.user = req.session.login_info.user;
            data.message = req.session.login_info.message;
        } else {
            data.state = null;
            data.user = null;
            data.message = null;
        }

        return cb(null, data);

    }

};
/**
 * New node file
 */
