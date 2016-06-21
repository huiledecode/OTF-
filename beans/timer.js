/**
 * Created by stephane on 21/06/16.
 */
exports.timer = {

    today: function (req, cb) {
        var _controler = req.session.controler;
        var _params = req.session.params;
        var theDate = new Date().toString();
        if (_params) _params.today = theDate;
        else {
            _params = {};
            _params.today = theDate;
        }
        return cb(null, _params);
    }
};