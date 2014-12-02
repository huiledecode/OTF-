exports.getview = {

    view: function (req, cb) {
        var _controler = req.session.controler;
      return cb(null, { title: 'AddUser', "state": req.session.login_info.state, room: _controler.room });
    }

};
/**
 * New node file
 */
