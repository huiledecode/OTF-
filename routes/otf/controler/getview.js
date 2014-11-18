exports.getview = {

    view: function (req, cb) {
        var _controler = req.session.controler;
        return cb(null, { title: 'AddUser' });
    }

};
/**
 * New node file
 */
