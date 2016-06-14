/**
 * New node file
 */
exports.index = {

    titre: function (req, cb) {
        var _controler = req.session.controler;
        return cb(null, { title: 'OTF with Express', "state": req.session.login_info.state, "user": req.session.login_info.user, "message": req.session.login_info.message, room : _controler.room });
    }

};