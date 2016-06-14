var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var paginate = require("mongoose-pages");
var logger = require('log4js').getLogger('otf_mongooseGeneric');
//logger.setLevel(GLOBAL.config["LOGS"].level);

//- var schema = new mongoose.Schema({ name: 'string', size: 'string' });
//- var Tank = mongoose.model('Tank', schema);
function mongooseGeneric(_schemaName, _schema, collection) {
    if (db.models[_schemaName])
        delete db.models[_schemaName];

    this.documentSchema = mongoose.Schema(_schema);
    paginate.anchor(this.documentSchema);
    //paginate.skip(this.documentSchema);
    //logger.debug(" schema_loader : Schema after Paginate",_schema);
    this.document = db.model(_schemaName, this.documentSchema, collection); // db global

};

mongooseGeneric.prototype.initDocument = function (_schema, _schemaName, _callback) {
    this.documentSchema = mongoose.Schema(_schema);
    this.document = db.model(_schemaName, this.documentSchema);
    _callback();
};

mongooseGeneric.prototype.getDocument = function (_condition, _callback) {

    this.document.findOne(_condition, function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
            _callback(null, result);
        }
    });

};

mongooseGeneric.prototype.getDocuments = function (_condition, _callback) {
    var t1 = new Date().getMilliseconds();
    this.document.find(_condition, function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
            var t2 = new Date().getMilliseconds();
            logger.info('Into mongooseGeneric.getDocuments TIME : ' + (t2 - t1) + ' ms');
            _callback(null, result);
        }
    });
};

mongooseGeneric.prototype.deleteDocument = function (_condition, _callback) {

    this.document.remove(_condition, function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
            _callback(null, _condition);
        }
    });

};

mongooseGeneric.prototype.createDocument = function (_values, _callback) {

    if(!_values.hasOwnProperty("_id"))
      _values._id = new ObjectId();

    var m = new this.document(_values);
    m.save(function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
            _callback(null, _values);
        }
    });

};

mongooseGeneric.prototype.updateDocuments = function (_conditions, _values, _callback) {

    this.document.update(_conditions, { $set: _values}, { multi: true }, function (err, numberAffected) {
        if (err) {
            _callback(err, null);
        }
        else {
            _callback(null, numberAffected);
        }
    });
};

mongooseGeneric.prototype.updateDocument = function (_conditions, _values, _callback) {

    this.document.update(_conditions, { $set: _values}, function (err, numberAffected) {
        if (err) {
            _callback(err, null);
        }
        else {
            _callback(null, numberAffected);
        }
    });
};

mongooseGeneric.prototype.popDocument = function (_condition, _callback) {

    this.document.findOne(_condition.query).populate(_condition.ref).exec(function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
            _callback(null, result);
        }
    });
};

mongooseGeneric.prototype.popDocuments = function (_condition, _callback) {

    this.document.find(_condition.query).populate(_condition.ref).exec(function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
            _callback(null, result);
        }
    });
};

mongooseGeneric.prototype.getPaginateDocuments = function (_condition, _callback) {

    this.document.findPaginated(_condition.query, function (err, result) {
        if (err) {
            _callback(err, null);
        }
        else {
            _callback(null, result);
        }
    }, condition.docsPerPage, pageNumber);
};


exports.mongooseGeneric = mongooseGeneric;
