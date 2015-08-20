exports.getview = {

    view: function (req, cb) {
        var _controler = req.session.controler;
        var _params = req.session.params;

      if(_controler.auth){
        _params.title = 'AddUser';
        _params.state = req.session.login_info.state;
        _params.room  = _controler.room;
      }
      return cb(null, _params);
    }

};
/**
 * New node file
 */
